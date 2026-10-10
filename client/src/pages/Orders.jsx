import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api("/orders", { token })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <section>
        <h1>My orders</h1>
        <p className="muted">
          Please <Link to="/login">log in</Link> to see your orders.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>My orders</h1>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="muted">
          No orders yet. <Link to="/">Order something tasty</Link>
        </p>
      )}

      {orders.map((order) => (
        <div key={order._id} className="panel">
          <div className="order-head">
            <span className="muted">{new Date(order.createdAt).toLocaleString()}</span>
            <span className="badge">{order.status.replace(/-/g, " ")}</span>
          </div>
          <ul className="order-items">
            {order.items.map((i) => (
              <li key={i.menuItem}>
                {i.quantity} × {i.name} <span className="muted">(₹{i.price} each)</span>
              </li>
            ))}
          </ul>
          <div className="order-foot">
            <span className="muted">Deliver to: {order.address}</span>
            <strong>Total ₹{order.total}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}
