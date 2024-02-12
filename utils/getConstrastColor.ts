export default function getContrastColor(hexcolor: string) {
  if (!hexcolor) return "#000"; // Default to black if no color provided
  const hex = hexcolor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff"; // Return black or white based on contrast
}
