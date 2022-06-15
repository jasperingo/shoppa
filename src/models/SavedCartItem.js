
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const ProductVariant = require("./ProductVariant");
const SavedCart = require("./SavedCart");


class SavedCartItem extends Model {}

SavedCartItem.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'saved_cart_items',
  modelName: 'saved_cart_item'
});


const sForeignKey = {
  name: 'saved_cart_id',
  type: DataTypes.BIGINT
};

SavedCart.hasMany(SavedCartItem, {
  foreignKey: sForeignKey
});

SavedCartItem.belongsTo(SavedCart, {
  foreignKey: sForeignKey
});


const pvForeignKey = {
  name: 'product_variant_id',
  type: DataTypes.BIGINT
};

ProductVariant.hasOne(SavedCartItem, {
  foreignKey: pvForeignKey
});

SavedCartItem.belongsTo(ProductVariant, {
  foreignKey: pvForeignKey
});


module.exports = SavedCartItem;
