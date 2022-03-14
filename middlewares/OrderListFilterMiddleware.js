
module.exports = function(req, res, next) {

  const options = req.query.status ? { status: req.query.status } : null;

  if (req.data)
    req.data.orderFilter = { ...options }
  else 
    req.data = { orderFilter: options };

  next();
}
