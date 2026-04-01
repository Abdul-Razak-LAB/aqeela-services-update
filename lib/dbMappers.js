export function mapAddressRow(row) {
  return {
    _id: String(row.id),
    userId: row.user_id,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    pincode: row.pincode,
    area: row.area,
    city: row.city,
    state: row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOrderRow(row) {
  return {
    _id: row.id,
    userId: row.user_id,
    items: row.items || [],
    address: row.address || {},
    subTotal: Number(row.sub_total || 0),
    tax: Number(row.tax || 0),
    amount: Number(row.amount || 0),
    status: row.status,
    paymentType: row.payment_type,
    payment: row.payment,
    paymentSessionId: row.payment_session_id,
    date: Number(row.date || Date.now()),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
