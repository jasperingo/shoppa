const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Review = require("../models/Review");
const Store = require("../models/Store");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async existsForProduct(product_id, customer_id) {
    const rev = await Review.findOne({ attributes: ['id'], where: { product_id, customer_id } });
    return rev !== null;
  },

  async existsForStore(store_id, customer_id) {
    const rev = await Review.findOne({ attributes: ['id'], where: { store_id, customer_id } });
    return rev !== null;
  },

  async existsForDeliveryFirm(delivery_firm_id, customer_id) {
    const rev = await Review.findOne({ attributes: ['id'], where: { delivery_firm_id, customer_id } });
    return rev !== null;
  },

  async canReviewProduct(product_id, customer_id) {
    const res = await OrderItem.findOne({
      attributes: ['id'],
      where: {
        delivered_at: { [Op.not]: null },
        '$order.customer_id$': customer_id,
        '$product_variant.product_id$': product_id
      },
      include: [
        {
          model: Order,
          attributes: ['id']
        },
        {
          model: ProductVariant,
          attributes: ['id']
        }
      ]
    });
    return res !== null;
  },

  async canReviewStore(store_id, customer_id) {
    const res = await Order.findOne({
      attributes: ['id'],
      where: {
        status: Order.STATUS_FULFILLED,
        customer_id,
        store_id
      },
    });
    return res !== null;
  },

  async canReviewDeliveryFirm(delivery_firm_id, customer_id) {
    const res = await Order.findOne({
      attributes: ['id'],
      where: {
        status: Order.STATUS_FULFILLED,
        customer_id,
        delivery_firm_id
      },
    });
    return res !== null;
  },

  get(id) {
    return Review.findOne({
      where: { id },
      include: [
        {
          model: Customer,
          attributes: Customer.GET_ATTR,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: Product,
          attributes: Product.GET_ATTR
        },
        {
          model: Store,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        
        {
          model: DeliveryFirm,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        }
      ]
    });
  },

  getListByProduct(product, offset, limit) {
    return Review.findAndCountAll({ 
      where: { product_id: product.id },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByStore(store, offset, limit) {
    return Review.findAndCountAll({ 
      where: { store_id: store.id },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByDeliveryFirm(deliveryFirm, offset, limit) {
    return Review.findAndCountAll({ 
      where: { delivery_firm_id: deliveryFirm.id },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  async getSummaryRatings(projection, transaction) {
    const one = await Review.findOne({ 
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      where: {
        ...projection,
        rating: Review.RATING_ONE
      },
      transaction
    });

    const two = await Review.findOne({ 
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      where: {
        ...projection,
        rating: Review.RATING_TWO
      },
      transaction
    });

    const three = await Review.findOne({ 
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      where: {
        ...projection,
        rating: Review.RATING_THREE
      },
      transaction
    });

    const four = await Review.findOne({ 
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      where: {
        ...projection,
        rating: Review.RATING_FOUR
      },
      transaction
    });

    const five = await Review.findOne({ 
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      where: {
        ...projection,
        rating: Review.RATING_FIVE
      },
      transaction
    });

    return [
      one.getDataValue('count') || 0, 
      two.getDataValue('count') || 0, 
      three.getDataValue('count') || 0, 
      four.getDataValue('count') || 0, 
      five.getDataValue('count') || 0
    ];
  },

  getSummaryForProduct(product) {
    return sequelize.transaction(async (transaction)=> {

      const ratings = await this.getSummaryRatings({ product_id: product.id }, transaction);

      const total = await Review.findOne({ 
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
        ],
        where: { product_id: product.id },
        transaction
      });

      const average = await Review.findOne({ 
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg']
        ],
        where: { product_id: product.id },
        transaction
      });

      return {
        ratings,
        total: total.getDataValue('count') || 0,
        average: average.getDataValue('avg') || 0.0
      }
    });
  },

  getSummaryForStore(store) {
    return sequelize.transaction(async (transaction)=> {

      const ratings = await this.getSummaryRatings({ store_id: store.id }, transaction);

      const total = await Review.findOne({ 
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
        ],
        where: { store_id: store.id },
        transaction
      });

      const average = await Review.findOne({ 
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg']
        ],
        where: { store_id: store.id },
        transaction
      });

      return {
        ratings,
        total: total.getDataValue('count') || 0,
        average: average.getDataValue('avg') || 0.0
      }
    });
  },

  getSummaryForDeliveryFirm(deliveryFirm) {
    return sequelize.transaction(async (transaction)=> {

      const ratings = await this.getSummaryRatings({ delivery_firm_id: deliveryFirm.id }, transaction);

      const total = await Review.findOne({ 
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
        ],
        where: { delivery_firm_id: deliveryFirm.id },
        transaction
      });

      const average = await Review.findOne({ 
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg']
        ],
        where: { delivery_firm_id: deliveryFirm.id },
        transaction
      });
      
      return {
        ratings,
        total: total.getDataValue('count') || 0,
        average: average.getDataValue('avg') || 0.0
      }
    });
  },
  
  createForProduct({ product_id, rating, description }, customer_id) {
    return Review.create({ product_id, customer_id, rating, description });
  },

  createForStore({ store_id, rating, description }, customer_id) {
    return Review.create({ store_id, customer_id, rating, description });
  },

  createForDeliveryFirm({ delivery_firm_id, rating, description }, customer_id) {
    return Review.create({ delivery_firm_id, customer_id, rating, description });
  },

  update(review, { rating, description }) {
    return Review.update({ rating, description }, { where: { id: review.id } });
  },
  
  delete(review) {
    return Review.destroy({ where: { id: review.id } });
  }

};

