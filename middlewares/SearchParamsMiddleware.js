
module.exports = (req, res, next)=> {

  const options = {
    q: req.query.q,
    sub_category_id: req.query.sub_category
  }

  if (req.data)
    req.data.searchParams = { ...options }
  else 
    req.data = { searchParams: options };

  next();
}



