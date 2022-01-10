const Order = require("../../models/Order");

module.exports = {

  processed_at: {
    custom: {
      options: (value, { req })=> {

        if (req.data.orderItem.order.status !== Order.STATUS_PROCESSING) {
          throw req.__('_error._form._order_item_cant_update_date', { date: 'processing date' });
        } 

        if (req.data.orderItem.processed_at !== null) {
          throw req.__('_error._form._order_item_date_updated', { date: 'processing date' });
        }

        return true;
      }
    }
  }
}
