/**
 * Generate a unique document reference code.
 * e.g.  REC-20240315-4F2A
 */
export const generateRef = (prefix = "DOC") => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${date}-${rand}`;
};
