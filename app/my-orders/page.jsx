'use client';
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

const MyOrders = () => {

    const { currency, user, orders, ordersLoading, fetchUserOrders } = useAppContext();

    useEffect(() => {
        if (user) {
            fetchUserOrders();
        }
    }, [user]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {!user ? (
                        <div className="max-w-5xl border border-gray-300 rounded-lg p-5 text-sm text-gray-600">
                            Please sign in to view your orders.
                        </div>
                    ) : ordersLoading ? (
                        <div className="max-w-5xl border border-gray-300 rounded-lg p-5 text-sm text-gray-600">
                            Loading your orders...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="max-w-5xl border border-gray-300 rounded-lg p-5 text-sm text-gray-600">
                            No orders yet. Add products to cart and place your first order.
                        </div>
                    ) : (<div className="max-w-5xl border-t border-gray-300 text-sm">
                        {orders.map((order, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-3">
                                        <span className="font-medium text-base">
                                            {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                        </span>
                                        <span>Items : {order.items.length}</span>
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <span className="font-medium">{order.address.fullName}</span>
                                        <br />
                                        <span >{order.address.area}</span>
                                        <br />
                                        <span>{`${order.address.city}, ${order.address.state}`}</span>
                                        <br />
                                        <span>{order.address.phoneNumber}</span>
                                    </p>
                                </div>
                                <p className="font-medium my-auto">{currency}{order.amount}</p>
                                <div>
                                    <p className="flex flex-col">
                                        <span>Method : {order.paymentType || 'COD'}</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span>Payment : {order.payment || 'Pending'}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;