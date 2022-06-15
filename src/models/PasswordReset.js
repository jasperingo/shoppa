const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Administrator = require("./Administrator");
const Customer = require("./Customer");

class PasswordReset extends Model {

  static EXPIRE_DURATION = (1000 * 60 * 15); // 15 miniutes

}

PasswordReset.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  token: {
    type: DataTypes.STRING,
    allowNull: false
  },

  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'password_resets',
  modelName: 'password_reset'
});

const cForeignKey = {
  name: 'customer_id',
  type: DataTypes.BIGINT
};

Customer.hasMany(PasswordReset, { foreignKey: cForeignKey });

PasswordReset.belongsTo(Customer, { foreignKey: cForeignKey });


const aForeignKey = {
  name: 'administrator_id',
  type: DataTypes.BIGINT
};

Administrator.hasMany(PasswordReset, { foreignKey: aForeignKey });

PasswordReset.belongsTo(Administrator, { foreignKey: aForeignKey });


module.exports = PasswordReset;

