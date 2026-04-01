'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const CART_STORAGE_KEY = "aqeela_cart_items";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const { user, isLoaded } = useUser()

    // const { user } = useUser()

    const [products, setProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [userAddresses, setUserAddresses] = useState([])
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [addressesLoading, setAddressesLoading] = useState(false)

    const fetchProductData = async () => {
        setProducts(productsDummyData)
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

    }

    const fetchUserAddresses = async () => {
        if (!user) {
            setUserAddresses([])
            return
        }

        setAddressesLoading(true)
        try {
            const response = await fetch('/api/addresses')
            const data = await response.json()
            if (response.ok && data.success) {
                setUserAddresses(data.addresses || [])
            }
        } finally {
            setAddressesLoading(false)
        }
    }

    const fetchUserOrders = async () => {
        if (!user) {
            setOrders([])
            return
        }

        setOrdersLoading(true)
        try {
            const response = await fetch('/api/orders/user')
            const data = await response.json()
            if (response.ok && data.success) {
                setOrders(data.orders || [])
            }
        } finally {
            setOrdersLoading(false)
        }
    }

    const addUserAddress = async (address) => {
        if (!isLoaded) {
            return { success: false, message: "Please wait. Checking your sign-in status..." }
        }

        if (!user) {
            return { success: false, message: "Please sign in to save address." }
        }

        const response = await fetch('/api/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
            return { success: false, message: data.message || "Failed to save address." }
        }

        setUserAddresses((prev) => [data.address, ...prev])
        return { success: true }
    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const placeOrder = async (address, paymentType = 'COD') => {
        if (!user) {
            return { success: false, message: "Please sign in to place an order." };
        }

        const cartCount = getCartCount();
        if (!cartCount) {
            return { success: false, message: "Your cart is empty." };
        }

        const resolvedAddress = address || userAddresses[0];
        if (!resolvedAddress) {
            return { success: false, message: "Please add a shipping address first." };
        }

        const orderItems = Object.keys(cartItems)
            .map((itemId) => {
                const product = products.find((item) => item._id === itemId);
                const quantity = cartItems[itemId];
                if (!product || quantity <= 0) return null;
                return {
                    product: {
                        _id: product._id,
                        name: product.name,
                        offerPrice: product.offerPrice,
                        image: product.image,
                    },
                    quantity,
                };
            })
            .filter(Boolean);

        const subTotal = getCartAmount();
        const tax = Math.floor(subTotal * 0.02);

        const response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: orderItems,
                address: resolvedAddress,
                subTotal,
                tax,
                amount: subTotal + tax,
                paymentType,
            }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
            return { success: false, message: data.message || "Could not place order." }
        }

        if (paymentType === 'ONLINE') {
            const paymentResponse = await fetch('/api/payments/stripe/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.order._id }),
            })

            const paymentData = await paymentResponse.json()

            if (!paymentResponse.ok || !paymentData.success || !paymentData.checkoutUrl) {
                return { success: false, message: paymentData.message || "Could not start online payment." }
            }

            return {
                success: true,
                redirectToPayment: true,
                checkoutUrl: paymentData.checkoutUrl,
            }
        }

        setOrders((prev) => [data.order, ...prev]);
        setCartItems({});

        return { success: true };
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (storedCart) setCartItems(JSON.parse(storedCart));
        } catch {
            setCartItems({});
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems])

    useEffect(() => {
        fetchUserAddresses()
        fetchUserOrders()
    }, [user])

    const value = {
        
        currency, router,
        searchQuery, setSearchQuery,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        user,
        authLoaded: isLoaded,
        userAddresses, addUserAddress, addressesLoading,
        orders, ordersLoading,
        fetchUserOrders,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        placeOrder
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}