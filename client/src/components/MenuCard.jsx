export default function MenuCard({ item, onAdd }) {
  return (
    <article className="card">
      <div className="card-emoji">{item.emoji}</div>
      <div className="card-body">
        <h3>
          {item.name}{" "}
          <span className={item.veg ? "dot veg" : "dot nonveg"} title={item.veg ? "Veg" : "Non-veg"} />
        </h3>
        <p className="muted">{item.description}</p>
        <div className="card-footer">
          <strong>₹{item.price}</strong>
          <button className="btn" onClick={() => onAdd(item)}>Add</button>
        </div>
      </div>
    </article>
  );
}
