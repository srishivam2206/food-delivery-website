import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { lines, add, decrease, remove, clear, total } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  async function placeOrder() {
    setError("");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!address.trim()) {
      setError("Please enter your delivery address");
      return;
    }

    setPlacing(true);
    try {
      await api("/orders", {
        method: "POST",
        token,
        body: {
          address,
          paymentMethod,
          // Only ids and quantities are sent. The server looks up the real prices.
          items: lines.map((l) => ({ menuItemId: l.item._id, quantity: l.quantity })),
        },
      });
      clear();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p className="muted">
          Your cart is empty. <Link to="/">Browse the menu</Link>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>

      <div className="panel">
        {lines.map(({ item, quantity }) => (
          <div key={item._id} className="cart-row">
            <div>
              <strong>{item.emoji} {item.name}</strong>
              <div className="muted">₹{item.price} each</div>
            </div>
            <div className="qty">
              <button className="btn btn-ghost" onClick={() => decrease(item._id)}>−</button>
              <span>{quantity}</span>
              <button className="btn btn-ghost" onClick={() => add(item)}>+</button>
            </div>
            <strong>₹{item.price * quantity}</strong>
            <button className="btn btn-ghost" onClick={() => remove(item._id)}>Remove</button>
          </div>
        ))}
        <div className="cart-total">
          <span>Total</span>
          <strong>₹{total}</strong>
        </div>
      </div>

      <div className="panel">
        <label className="label" htmlFor="address">Delivery address</label>
        <textarea
          id="address"
          className="input"
          rows={3}
          placeholder="House no, street, city, pincode"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label className="label" htmlFor="payment">Payment method</label>
        <select
          id="payment"
          className="input"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cod">Cash on delivery</option>
          <option value="online-demo">Online payment (demo only, no real payment)</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-big" onClick={placeOrder} disabled={placing}>
          {placing ? "Placing order..." : token ? "Place order" : "Login to place order"}
        </button>
      </div>
    </section>
  );
}
