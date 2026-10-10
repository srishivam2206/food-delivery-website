import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import MenuCard from "../components/MenuCard.jsx";

export default function Menu() {
  const { add } = useCart();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the category buttons once
  useEffect(() => {
    api("/menu/categories").then(setCategories).catch(() => {});
  }, []);

  // Reload the menu when the category or search text changes.
  // The small delay (debounce) avoids calling the server on every single keystroke.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (category !== "All") params.set("category", category);

      api(`/menu?${params.toString()}`)
        .then((data) => {
          setItems(data);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <section>
      <h1>What would you like to eat?</h1>

      <input
        className="input"
        type="search"
        placeholder="Search dishes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? "chip active" : "chip"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading menu...</p>}
      {!loading && !error && items.length === 0 && <p className="muted">No dishes found.</p>}

      <div className="grid">
        {items.map((item) => (
          <MenuCard key={item._id} item={item} onAdd={add} />
        ))}
      </div>
    </section>
  );
}
