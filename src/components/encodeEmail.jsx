export const encodeEmail = (email) => {
  return email.replace(/\./g, "_");
};