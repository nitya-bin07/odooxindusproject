/**
 * Send a successful JSON response.
 */
export const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

/**
 * Send an error JSON response.
 */
export const sendError = (res, message = "Error", statusCode = 400, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
