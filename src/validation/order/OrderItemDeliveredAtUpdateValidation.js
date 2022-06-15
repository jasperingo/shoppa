
module.exports = {

  delivered_at: {
    custom: {
      options: (value, { req })=> {

        if (
          (req.data.orderItem.delivery_weight_id !== null && req.data.orderItem.transported_at === null) || 
          (req.data.orderItem.delivery_weight_id === null && req.data.orderItem.processed_at === null)
        ) {
          throw req.__('_error._form._order_item_cant_update_date', { date: 'delivery date' });
        } 
        
        if (req.data.orderItem.delivered_at !== null) {
          throw req.__('_error._form._order_item_date_updated', { date: 'delivery date' });
        }

        return true;
      }
    }
  }
}
