const { Op } = require("sequelize");
const Category = require("../models/Category");
const DiscountProduct = require("../models/DiscountProduct");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const sequelize = require("./DB");


module.exports = {

  async idExists(id) {
    const product = await Product.findOne({ 
      attributes: ['id'], 
      where: { 
        id, 
        deleted_at: { [Op.is]: null } 
      } 
    });
    return product !== null;
  },

  async idExistsForStore(id, store_id) {
    const product = await Product.findOne({ 
      attributes: ['id'], 
      where: { 
        id, 
        store_id, 
        deleted_at: { [Op.is]: null } 
      } 
    });
    return product !== null;
  },

  async titleExists(title) {
    const product = await Product.findOne({ attributes: ['id'], where: { title, deleted_at: { [Op.is]: null } } });
    return product !== null;
  },

  async updateTitleExists(title, id) {
    const product = await Product.findOne({ 
      attributes: ['id'], 
      where: { 
        title, 
        [Op.not]: { id },
        deleted_at: { [Op.is]: null }
      } 
    });
    return product !== null;
  },

  get(id) {
    return Product.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null },
        '$product_variants.deleted_at$': { [Op.is]: null }
      },
      include: [
        {
          model: Store,
          attributes: ['id'],
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: ProductVariant,
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        },
      ]
    });
  },
  
  async getListByStore(store, offset, limit) {
      
    const { count, rows } = await Product.findAndCountAll({
      where: { 
        store_id: store.id,
        deleted_at: { [Op.is]: null }
      },
      include: [
        {
          model: Store,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        },
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
    
    for (let [i, product] of rows.entries()) {
      let variant = await ProductVariant.findOne({
        attributes: ['id', 'price'],
        where: {
          product_id: product.id,
          deleted_at: { [Op.is]: null }
        },
        order: [['price', 'ASC']],
      });

      rows[i].setDataValue('product_variants', (variant === null ? [] : [variant]));
    }
    
    return { count, rows };
  },
  
  async getListByStoreWithDiscount(store, discount_id, offset, limit) {
    const { count, rows } = await Product.findAndCountAll({
      where: { 
        store_id: store.id,
        deleted_at: { [Op.is]: null }
      },
      order: [['created_at', 'DESC']],
      offset,
      limit,
    });

    for (let [i, product] of rows.entries()) {
      let discountProduct = await DiscountProduct.findOne({
        where: {
          discount_id,
          product_id: product.id,
          deleted_at: { [Op.is]: null }
        }
      });

      rows[i].setDataValue('discount_products', (discountProduct === null ? [] : [discountProduct]));
    }

    return { count, rows };
  },

  create({ sub_category_id, title, description }, store_id) {
    return Product.create({ store_id, sub_category_id, title, description });
  },
  
  update(product, { sub_category_id, title, description }) {
    return Product.update(
      { sub_category_id, title, description },
      { where: { id: product.id } }
    );
  },

  updatePhoto(product, photo) {
    return Product.update({ photo }, { where : { id: product.id } });
  },

  delete(product) {
    return sequelize.transaction(async (transaction)=> {

      const deleted_at = Date.now();

      return await Promise.all([
        Product.update(
          { deleted_at }, 
          { where: { id: product.id }, transaction }
        ),

        ProductVariant.update(
          { deleted_at }, 
          { where: { product_id: product.id, deleted_at: { [Op.is]: null } }, transaction }
        )
      ]);
    });
  }

};

