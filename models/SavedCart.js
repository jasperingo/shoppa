
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class SavedCart extends Model {

  static CODE_PREFIX = 'CART';

}

SavedCart.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'saved_carts',
  modelName: 'saved_cart'
});


const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasMany(SavedCart, {
  foreignKey
});

SavedCart.belongsTo(User, {
  foreignKey
});

module.exports = SavedCart;

