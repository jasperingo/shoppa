const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const User = require("./User");

class WithdrawalAccount extends Model {}

WithdrawalAccount.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  bank_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  account_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  account_number: {
    type: DataTypes.STRING,
    allowNull: false
  },

  account_type: {
    type: DataTypes.STRING,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  },

},
{
  sequelize,
  timestamps: false,
  tableName: 'withdrawal_accounts',
  modelName: 'withdrawal_account'
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasOne(WithdrawalAccount, {
  foreignKey
});

WithdrawalAccount.belongsTo(User, {
  foreignKey
});


module.exports = WithdrawalAccount;


