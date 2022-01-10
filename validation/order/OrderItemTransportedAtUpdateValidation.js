
module.exports = {

  transported_at: {
    custom: {
      options: (value, { req })=> {

        if (req.data.orderItem.processed_at === null) {
          throw req.__('_error._form._order_item_cant_update_date', { date: 'transporting date' });
        } 
        
        if (req.data.orderItem.transported_at !== null) {
          throw req.__('_error._form._order_item_date_updated', { date: 'transporting date' });
        }

        return true;
      }
    }
  }
}
