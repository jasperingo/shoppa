

module.exports = (req, res, next) => {

  const page = req.query.page == undefined ? 1 : parseInt(''+req.query.page.replace(/[^0-9]/, ''));

  const page_limit = req.query.page_limit == undefined ? 10 : parseInt(''+req.query.page_limit.replace(/[^0-9]/, ''));

  let page_offset;
  
  if (isNaN(page) || page <= 1) 
    page_offset = 0;
  else
    page_offset = (page * page_limit)-page_limit;

  req.data = { pager: { page, page_offset, page_limit } };

  next();
}



