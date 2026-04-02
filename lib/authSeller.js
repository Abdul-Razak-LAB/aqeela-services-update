const authSeller = async (userId) => {
    const sellerUserId = String(process.env.SELLER_USER_ID || '').trim();
    return Boolean(sellerUserId) && String(userId || '') === sellerUserId;
}

export default authSeller;