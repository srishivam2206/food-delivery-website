import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">🍔 Foodie</Link>
        <nav className="nav-links">
          <Link to="/">Menu</Link>
          {user && <Link to="/orders">My Orders</Link>}
          <Link to="/cart">Cart ({count})</Link>
          {user ? (
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout ({user.name.split(" ")[0]})
            </button>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
