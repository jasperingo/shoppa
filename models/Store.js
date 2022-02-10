const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const SubCategory = require("./SubCategory");
const User = require("./User");

class Store extends Model {}

Store.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  recommended: {
    type: DataTypes.BOOLEAN
  },

  updated_at: {
    type: DataTypes.DATE
  },

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}store/${this.id}`;
    }
  },

  review_summary: {
    type: DataTypes.VIRTUAL,
  },

},
{
  sequelize,
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at',
  tableName: 'stores',
  modelName: 'store'
});

const foreignKey = {
  name: 'user_id',
  type: DataTypes.BIGINT
};

User.hasOne(Store, { foreignKey });

Store.belongsTo(User, { foreignKey });

const catForeignKey = {
  name: 'sub_category_id',
  type: DataTypes.BIGINT
};

Store.belongsTo(SubCategory, { foreignKey: catForeignKey });

SubCategory.hasMany(Store, { foreignKey: catForeignKey });

module.exports = Store;
