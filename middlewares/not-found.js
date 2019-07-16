const notFoundHandler = (req, res, next) => next({ status: 404, message: 'not found' });

export default notFoundHandler;
