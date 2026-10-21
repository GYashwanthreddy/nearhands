export const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

// "9000000001" -> "+91 90000 00001"
export function formatPhone(phone = "") {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

// WhatsApp click-to-chat link (no API needed)
export function waLink(phone = "") {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}`;
}

// Where each role lands after login
export const homeFor = (user) =>
  user?.role === "admin" ? "/admin" : user?.role === "worker" ? "/my-profile" : "/";
