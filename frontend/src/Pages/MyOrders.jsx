import React, { useEffect, useState } from "react";
import { backend_url } from "../App";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${backend_url}/my-orders`, {
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Orders</h1>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <div key={order._id} style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "10px"
        }}>
          <h3>Order ID: {order._id}</h3>
          <p>Total: ₹{order.amount}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;