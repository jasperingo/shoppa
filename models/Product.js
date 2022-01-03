const { Model, DataTypes } = require("sequelize");
const Files = require("../http/Files");
const sequelize = require('../repository/DB');
const Store = require("./Store");
const SubCategory = require("./SubCategory");


class Product extends Model {

  static GET_ATTR = ['id', 'title', 'code', 'photo']

}

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
        href: Files.getProductPhotoPath(photoName)
      };
    }
  },

  deleted_at: {
    type: DataTypes.DATE
  },

  created_at: {
    type: DataTypes.DATE
  },

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}product/${this.id}`;
    }
  },

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


