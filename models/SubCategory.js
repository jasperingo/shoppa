const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Category = require("./Category");

class SubCategory extends Model {}

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
  },

  description: {
    type: DataTypes.STRING
  },

  create_at: {
    type: DataTypes.DATE
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
