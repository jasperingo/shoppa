
const { Model, DataTypes } = require("sequelize");
const Files = require("../utils/Files");
const sequelize = require('../repository/DB');

class Promotion extends Model {}

Promotion.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  link: {
    type: DataTypes.STRING,
    allowNull: false
  },

  call_to_action: {
    type: DataTypes.STRING,
    allowNull: false
  },

  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  photo: {
    type: DataTypes.STRING,
    get() {
      const photoName = this.getDataValue('photo');
      return {
        name: photoName,
        href: Files.getPromotionPhotoPath(photoName)
      };
    }
  },

  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  deleted_at: {
    type: DataTypes.DATE
  },
  
  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: true,
  createdAt: false,
  paranoid: true,
  updatedAt: false,
  deletedAt: 'deleted_at',
  tableName: 'promotions',
  modelName: 'promotion',
});

module.exports = Promotion;
