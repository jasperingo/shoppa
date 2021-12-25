const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class DeliveryFirm extends Model {}

DeliveryFirm.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'delivery_firms',
  modelName: 'delivery_firm'
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasOne(DeliveryFirm, { foreignKey });

DeliveryFirm.belongsTo(User, { foreignKey });

module.exports = DeliveryFirm;
