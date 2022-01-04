const { Op } = require("sequelize");
const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const sequelize = require("./DB");


module.exports = {

  async idExists(id) {
    const product = await Product.findOne({ attributes: ['id'], where: { id } });
    return product !== null;
  },

  async idExistsForStore(id, store_id) {
    const product = await Product.findOne({ attributes: ['id'], where: { id, store_id } });
    return product !== null;
  },

  async variantIdExists(id) {
    const productVariant = await ProductVariant.findOne({ attributes: ['id'], where: { id } });
    return productVariant !== null;
  },

  async codeExists(code) {
    const product = await Product.findOne({ attributes: ['id'], where: { code } });
    return product !== null;
  },

  async titleExists(title) {
    const product = await Product.findOne({ attributes: ['id'], where: { title } });
    return product !== null;
  },

  async updateCodeExists(code, id) {
    const product = await Product.findOne({ attributes: ['id'], where: { code, [Op.not]: { id } } });
    return product !== null;
  },

  async updateTitleExists(title, id) {
    const product = await Product.findOne({ attributes: ['id'], where: { title, [Op.not]: { id } } });
    return product !== null;
  },

  get(id) {
    return Product.findOne({
      where: { id },
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
          where: {
            deleted_at: {
              [Op.is]: null
            }
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
      ]
    });
  },
  
  getListByStore(store, offset, limit) {
    return sequelize.transaction(async (transaction)=> {

      const count = await Product.count({
        where: { store_id: store.id },
        transaction
      });
      
      const rows = await Product.findAll({
        where: { store_id: store.id },
        include: [
          {
            model: Store,
            include: {
              model: User,
              attributes: User.GET_ATTR
            }
          },
          {
            model: ProductVariant,
            attributes: ['price'],
            where: {
              deleted_at: {
                [Op.is]: null
              }
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
        limit,
        transaction
      });
      
      return { count, rows };
    });
  },

  add({ store_id, sub_category_id, code, title, description, product_variants }) {
    return sequelize.transaction(async (transaction)=> {

      const product = await Product.create(
        { store_id, sub_category_id, code, title, description },
        { transaction }
      );
      
      for (let { name, price, quantity, weight, available } of product_variants) {
        await ProductVariant.create(
          { product_id: product.id, name, price, quantity, weight, available },
          { transaction }
        );
      }

      return product;
    });
  },

  update(product, { sub_category_id, code, title, description, product_variants }) {
    return sequelize.transaction(async (transaction)=> {

      const result = await Product.update(
        { sub_category_id, code, title, description },
        { where: { id: product.id }, transaction }
      );

      const variantIDs = [];
      
      for (let { id, name, price, quantity, weight, available } of product_variants) {

        if (id === undefined) {
          let variant = await ProductVariant.create(
            { product_id: product.id, name, price, quantity, weight, available },
            { transaction }
          );
          variantIDs.push(variant.id);
        } else {
          variantIDs.push(id);
          await ProductVariant.update(
            { name, price, quantity, weight, available },
            { where: { id }, transaction }
          );
        }
      }

      await ProductVariant.update({ deleted_at: Date.now() }, { 
        where: { 
          product_id: product.id, 
          id: {
            [Op.notIn]: variantIDs
          }
        },
        transaction
      });
      
      return result;
    });
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

