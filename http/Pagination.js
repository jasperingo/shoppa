
module.exports = class Pagination {

  req;
  
  previous;
  next;
  page_limit;
  current_page;
  number_of_pages;
  number_of_items;

  constructor(req, current_page, page_limit, number_of_items) {
    this.req = req;
    this.current_page = current_page;
    this.page_limit = page_limit;
    this.number_of_items = number_of_items;
    this.number_of_pages = Math.ceil(number_of_items / page_limit);

    this.next = this.getNextLink();
    this.previous = this.getPrevLink();

    this.req = undefined;
  }

  getNextLink() {
    const num = this.current_page + 1;
    if (num > this.number_of_pages) 
      return null;
    else
      return this.getLink(num);
  }

  getPrevLink() {
    const num = this.current_page - 1;
    if (num < 1) 
      return null;
    else
      return this.getLink(num);
  }

  getLink(page) {
    return {
      page,
      href: `${this.req.baseUrl}${this.req.path}?page=${page}&page_limit=${this.page_limit}`
    };
  }

}
