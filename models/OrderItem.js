
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const DiscountProduct = require("./DiscountProduct");
const Order = require("./Order");
const ProductVariant = require("./ProductVariant");
const RouteDuration = require("./RouteDuration");
const RouteWeight = require("./RouteWeight");

class OrderItem extends Model {}

OrderItem.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  product_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  product_variant_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  discount_amount: {
    type: DataTypes.DOUBLE
  },

  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  delivery_weight_fee: {
    type: DataTypes.DOUBLE
  },

  delivery_duration_fee: {
    type: DataTypes.DOUBLE
  },

  weight: {
    type: DataTypes.DOUBLE
  },

  processed_at: {
    type: DataTypes.DATE
  },

  transported_at: {
    type: DataTypes.DATE
  },

  delivered_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'order_items',
  modelName: 'order_item'
});


const oForeignKey = {
  name: 'order_id',
  type: DataTypes.BIGINT
};

Order.hasMany(OrderItem, { foreignKey: oForeignKey });

OrderItem.belongsTo(Order, { foreignKey: oForeignKey });


const pvForeignKey = {
  name: 'product_variant_id',
  type: DataTypes.BIGINT
};

ProductVariant.hasMany(OrderItem, { foreignKey: pvForeignKey });

OrderItem.belongsTo(ProductVariant, { foreignKey: pvForeignKey });


const rwForeignKey = {
  name: 'route_weight_id',
  type: DataTypes.BIGINT
};

RouteWeight.hasMany(OrderItem, { foreignKey: rwForeignKey });

OrderItem.belongsTo(RouteWeight, { foreignKey: rwForeignKey });


const rdForeignKey = {
  name: 'route_duration_id',
  type: DataTypes.BIGINT
};

RouteDuration.hasMany(OrderItem, { foreignKey: rdForeignKey });

OrderItem.belongsTo(RouteDuration, { foreignKey: rdForeignKey });


const dpForeignKey = {
  name: 'discount_product_id',
  type: DataTypes.BIGINT
};

DiscountProduct.hasMany(OrderItem, { foreignKey: dpForeignKey });

OrderItem.belongsTo(DiscountProduct, { foreignKey: dpForeignKey });


module.exports = OrderItem;
