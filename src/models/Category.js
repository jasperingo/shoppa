const { Model, DataTypes } = require("sequelize");
const Files = require("../utils/Files");
const sequelize = require('../repository/DB');

class Category extends Model {

  static TYPE_PRODUCT = 'product';

  static TYPE_STORE = 'store';


  static GET_ATTR =  ['id', 'name', 'href', 'hide_products'];

}

Category.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  type: {
    type: DataTypes.ENUM(Category.TYPE_PRODUCT, Category.TYPE_STORE),
    allowNull: false
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  photo: {
    type: DataTypes.STRING,
    get() {
      const photoName = this.getDataValue('photo');
      return {
        name: photoName,
        href: Files.getCategoryPhotoPath(photoName)
      };
    }
  },

  description: {
    type: DataTypes.STRING
  },

  hide_products: {
    type: DataTypes.BOOLEAN
  },

  created_at: {
    type: DataTypes.DATE
  },

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}category/${this.id}`;
    }
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'categories',
  modelName: 'category'
});


module.exports = Category;
