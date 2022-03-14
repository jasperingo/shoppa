
module.exports = function(req, res, next) {

  const options = req.query.sub_category_id ? { sub_category_id: req.query.sub_category_id } : null;

  if (req.data)
    req.data.productFilter = { ...options }
  else 
    req.data = { productFilter: options };

  next();
}
