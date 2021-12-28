const { Op } = require("sequelize");
const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const sequelize = require("./DB");


module.exports = {

  async codeExists(code) {
    const product = await Product.findOne({ where: { code } });
    return product !== null;
  },

  async titleExists(title) {
    const product = await Product.findOne({ where: { title } });
    return product !== null;
  },

  async updateCodeExists(code, id) {
    const product = await Product.findOne({ where: { code, [Op.not]: { id } } });
    return product !== null;
  },

  async updateTitleExists(title, id) {
    const product = await Product.findOne({ where: { title, [Op.not]: { id } } });
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
            attributes: ['id', 'name', 'photo']
          }
        },
        {
          model: ProductVariant
        },
        {
          model: SubCategory,
          attributes: ['id', 'name', 'href'],
          include: {
            model: Category,
            attributes: ['id', 'name', 'href'],
          }
        },
      ]
    })
  },

  add({ store_id, sub_category_id, code, title, description, product_variants }) {
    return sequelize.transaction(async (t)=> {

      const product = await Product.create(
        { store_id, sub_category_id, code, title, description },
        { transaction: t }
      );
      
      for (let { name, price, quantity, weight, available } of product_variants) {
        await ProductVariant.create(
          { product_id: product.id, name, price, quantity, weight, available },
          { transaction: t }
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
      
      for (let { name, price, quantity, weight, available } of product_variants) {

        let variant = await ProductVariant.findOne({ where: { name, product_id: product.id }, transaction });

        if (variant === null) {
          await ProductVariant.create(
            { product_id: product.id, name, price, quantity, weight, available },
            { transaction }
          );
        } else {
          await ProductVariant.update(
            { name, price, quantity, weight, available },
            { where: { id: variant.id }, transaction }
          );
        }
      }
      
      return result;
    });
  },

  updatePhoto(product, photo) {
    return Product.update({ photo }, { where : { id: product.id } });
  },

};

