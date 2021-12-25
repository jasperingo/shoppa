const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const SubCategory = require("./SubCategory");
const User = require("./User");

class Store extends Model {}

Store.init({},
{
  sequelize,
  timestamps: false,
  tableName: 'stores',
  modelName: 'store'
});

const foreignKey = {
  name: 'id',
  type: DataTypes.BIGINT,
  primaryKey: true
};

const catForeignKey = {
  name: 'sub_category_id',
  type: DataTypes.BIGINT
};

User.hasOne(Store, { foreignKey });

Store.belongsTo(User, { foreignKey });

Store.belongsTo(SubCategory, { foreignKey: catForeignKey });

SubCategory.hasMany(Store, { foreignKey: catForeignKey });

module.exports = Store;
