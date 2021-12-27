const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Store = require("./Store");
const SubCategory = require("./SubCategory");


class Product extends Model {}

Product.init({

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

  sub_title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },

  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },

  weight: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false
  },

  photo: {
    type: DataTypes.STRING,
    get() {
      const photoName = this.getDataValue('photo');
      return {
        name: photoName,
        href: `${process.env.PHOTOS_PATH}product/${photoName ? photoName : 'default.jpg'}`
      };
    }
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'products',
  modelName: 'product'
});

const storeForeignKey = {
  name: 'store_id',
  type: DataTypes.BIGINT
};

Store.hasMany(Product, { foreignKey: storeForeignKey });

Product.belongsTo(Store, { foreignKey: storeForeignKey });

const catForeignKey = {
  name: 'sub_category_id',
  type: DataTypes.BIGINT
};

Product.belongsTo(SubCategory, { foreignKey: catForeignKey });

SubCategory.hasMany(Product, { foreignKey: catForeignKey });

module.exports = Product;


