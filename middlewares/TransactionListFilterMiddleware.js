
module.exports = function(req, res, next) {

  const options = req.query.type ? { type: req.query.type } : null;

  if (req.data)
    req.data.transactionFilter = { ...options }
  else 
    req.data = { transactionFilter: options };

  next();
}
