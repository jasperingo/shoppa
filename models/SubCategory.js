const { Model, DataTypes } = require("sequelize");
const Files = require("../http/Files");
const sequelize = require('../repository/DB');
const Category = require("./Category");

class SubCategory extends Model {

  static GET_ATTR =  ['id', 'name', 'href'];
  
}

SubCategory.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
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
        href: Files.getSubCategoryPhotoPath(photoName)
      };
    }
  },

  description: {
    type: DataTypes.STRING
  },

  created_at: {
    type: DataTypes.DATE
  },

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}sub-category/${this.id}`;
    }
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'sub_categories',
  modelName: 'sub_category'
});

const foreignKey = {
  name: 'category_id',
  type: DataTypes.BIGINT
};

Category.hasMany(SubCategory, { foreignKey });

SubCategory.belongsTo(Category, { foreignKey });


module.exports = SubCategory;
