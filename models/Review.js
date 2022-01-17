
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Customer = require("./Customer");
const DeliveryFirm = require("./DeliveryFirm");
const Product = require("./Product");
const Store = require("./Store");

class Review extends Model {

  static RATING_ONE = '1';
  static RATING_TWO = '2';
  static RATING_THREE = '3';
  static RATING_FOUR = '4';
  static RATING_FIVE = '5';

  static getRatings() {
    return [
      Review.RATING_ONE,
      Review.RATING_TWO,
      Review.RATING_THREE,
      Review.RATING_FOUR,
      Review.RATING_FIVE
    ];
  }
  
}


Review.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  rating: {
    type: DataTypes.ENUM(...Review.getRatings()),
    allowNull: false,
    get() {
      return Number(this.getDataValue('rating'));
    }
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'reviews',
  modelName: 'review'
});


const cForeignKey = {
  name: 'customer_id',
  type: DataTypes.BIGINT
};

Customer.hasOne(Review, { foreignKey: cForeignKey });

Review.belongsTo(Customer, { foreignKey: cForeignKey });


const pForeignKey = {
  name: 'product_id',
  type: DataTypes.BIGINT
};

Product.hasOne(Review, { foreignKey: pForeignKey });

Review.belongsTo(Product, { foreignKey: pForeignKey });


const sForeignKey = {
  name: 'store_id',
  type: DataTypes.BIGINT
};

Store.hasOne(Review, { foreignKey: sForeignKey });

Review.belongsTo(Store, { foreignKey: sForeignKey });


const dForeignKey = {
  name: 'delivery_firm_id',
  type: DataTypes.BIGINT
};

DeliveryFirm.hasOne(Review, { foreignKey: dForeignKey });

Review.belongsTo(DeliveryFirm, { foreignKey: dForeignKey });


module.exports = Review;

