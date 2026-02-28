import React, { useContext } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const CartItems = () => {
  const {products} = useContext(ShopContext);
  const {cartItems,removeFromCart,getTotalCartAmount} = useContext(ShopContext);
  const handlePayment = async () => {
  try {
    const amount = getTotalCartAmount(); // total cart value

    // 1️⃣ create order from backend
    const res = await fetch("https://e-commerce-i9ps.onrender.com/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    // 2️⃣ Razorpay options
    const options = {
      key: "rzp_test_SKs8CLuT3trPRa", // 🔴 replace with your NEW test key id
      amount: data.order.amount,
      currency: "INR",
      name: "Ashik E-Commerce",
      description: "Order Payment",
      order_id: data.order.id,

      // payment success handler
      handler: async function (response) {
        const verify = await fetch("https://e-commerce-i9ps.onrender.com/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
  products: cartItems,
  userId: localStorage.getItem("auth-token")
})
        });

        const result = await verify.json();

        if (result.success) {
          alert("🎉 Payment Successful");
        } else {
          alert("❌ Payment Failed");
        }
      },

      theme: {
        color: "#ff4141",
      },
    };

    // 3️⃣ open Razorpay popup
    const razor = new window.Razorpay(options);
    razor.open();

  } catch (error) {
    console.log(error);
    alert("Payment error");
  }
};

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e)=>{

        if(cartItems[e.id]>0)
        {
          return  <div>
                    <div className="cartitems-format-main cartitems-format">
                      <img className="cartitems-product-icon" src={backend_url+e.image} alt="" />
                      <p cartitems-product-title>{e.name}</p>
                      <p>{currency}{e.new_price}</p>
                      <button className="cartitems-quantity">{cartItems[e.id]}</button>
                      <p>{currency}{e.new_price*cartItems[e.id]}</p>
                      <img onClick={()=>{removeFromCart(e.id)}} className="cartitems-remove-icon" src={cross_icon} alt="" />
                    </div>
                     <hr />
                  </div>;
        }
        return null;
      })}
      
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{currency}{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handlePayment}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
