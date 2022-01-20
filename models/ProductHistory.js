const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Product = require("./Product");

class ProductHistory extends Model {}

ProductHistory.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  sub_category_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false
  },

  photo: {
    type: DataTypes.STRING
  },

  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'products_history',
  modelName: 'product_history'
});

const foreignKey = {
  name: 'product_id',
  type: DataTypes.BIGINT
};

Product.hasMany(ProductHistory, { foreignKey });

ProductHistory.belongsTo(Product, { foreignKey });


module.exports = ProductHistory;


