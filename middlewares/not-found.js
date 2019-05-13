export const notFoundHandler = (req, res, next) => {
  return next({status: 404, message: 'not found'});
};