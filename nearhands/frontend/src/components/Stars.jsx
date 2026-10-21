// Read-only stars, for example value={4.3}
export function Stars({ value = 0 }) {
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= full ? "star on" : "star"}>★</span>
      ))}
    </span>
  );
}

// Clickable stars for the review form
export function StarInput({ value, onChange }) {
  return (
    <div className="stars input">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? "star on" : "star"}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
