const COLORS = ["#0f766e", "#b45309", "#7c3aed", "#be123c", "#1d4ed8", "#4d7c0f", "#c2410c", "#0e7490"];

// Shows the worker's photo, or a coloured circle with their first letter when there is none
export default function Avatar({ name = "?", photoUrl, size = 64 }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const color = COLORS[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % COLORS.length];
  const style = { width: size, height: size, fontSize: size * 0.42 };

  if (photoUrl) return <img className="avatar" style={style} src={photoUrl} alt={name} />;
  return (
    <div className="avatar" style={{ ...style, background: color }} aria-label={name}>
      {initial}
    </div>
  );
}
