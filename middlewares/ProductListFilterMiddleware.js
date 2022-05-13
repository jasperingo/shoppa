
module.exports = function(req, res, next) {

  const options = {};

  if (req.query.sub_category_id)
    options.sub_category_id = req.query.sub_category_id;

  if (req.auth === undefined || req.auth?.customerId !== undefined) {
    options['$sub_category.category.hide_products$'] = false;
    options['$store.sub_category.category.hide_products$'] = false;
  }

  if (req.data)
    req.data.productFilter = { ...options }
  else 
    req.data = { productFilter: options };

  next();
}
