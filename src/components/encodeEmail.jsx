export const encodeEmail = (email) => {
  if (!email) return "";
  return email.replace(/\./g, "_");
};
