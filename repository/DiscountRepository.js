const Discount = require("../models/Discount");
const DiscountProduct = require("../models/DiscountProduct");
const Product = require("../models/Product");
const sequelize = require("./DB");

module.exports = {

  async titleExists(title, store_id) {
    const discount = await Discount.findOne({ where: { title, store_id } });
    return discount !== null;
  },

  async productOnDiscount(product_id) {
    const discount = await DiscountProduct.findOne({ where: { product_id } });
    //TODO check end date...
    return discount !== null;
  },

  get(id) {
    return Discount.findOne({
      where: { id },
      include: {
        model: DiscountProduct,
        include: {
          model: Product,
          attributes: Product.GET_ATTR
        }
      }
    });
  },

  create({ store_id, title, type, value, minimium_required_amount, minimium_required_quantity, start_date, end_date, discount_products }) {
    return sequelize.transaction(async (transaction)=> {

      const values = { store_id, title, type, value, start_date, end_date };

      if (minimium_required_amount !== undefined || minimium_required_amount !== null) {
        values.minimium_required_amount = minimium_required_amount;
      }

      if (minimium_required_quantity !== undefined || minimium_required_quantity !== null) {
        values.minimium_required_quantity = minimium_required_quantity;
      }

      const discount = await Discount.create(values, { transaction });
      
      for (let { product_id } of discount_products) {
        await DiscountProduct.create(
          { discount_id: discount.id, product_id },
          { transaction }
        );
      }

      return discount;
    });
  }

};

