export const encodeEmail = (email) => {
  if (!email) return ""; // or throw new Error("Invalid email")
  return email.replace(/\./g, "_");
};
