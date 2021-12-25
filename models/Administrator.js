
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Customer = require("./Customer");
const DeliveryFirm = require("./DeliveryFirm");
const Store = require("./Store");

class Administrator extends Model {

  static TYPE_APPLICATION = 'application';

  static TYPE_STORE = 'store';
  
  static TYPE_DELIVERY_FIRM = 'delivery_firm';


  static ROLE_SUPER = 'super';

  static ROLE_SUB = 'sub';


  static STATUS_ACTIVE = 'active';

  static STATUS_SUSPENDED = 'suspended';

  static STATUS_DEACTIVATED = 'deactivated';
  

  hidePassword() {
    this.password = undefined;
    this.customer.password = undefined;
  }

}

Administrator.init({

  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  type: {
    type: DataTypes.ENUM(Administrator.TYPE_APPLICATION, Administrator.TYPE_STORE, Administrator.TYPE_DELIVERY_FIRM),
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM(Administrator.ROLE_SUPER, Administrator.ROLE_SUB),
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(Administrator.STATUS_ACTIVE, Administrator.STATUS_SUSPENDED, Administrator.STATUS_DEACTIVATED),
    allowNull: false,
    defaultValue: Administrator.STATUS_ACTIVE
  },

  created_at: {
    type: DataTypes.DATE
  },

  href: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${process.env.API_PATH}administrator/${this.id}`;
    }
  },
},
{
  sequelize,
  timestamps: false,
  tableName: 'administrators',
  modelName: 'administrator',
});

const customerForeignKey = {
  name: 'customer_id',
  type: DataTypes.BIGINT
};

Customer.hasMany(Administrator, { foreignKey: customerForeignKey });

Administrator.belongsTo(Customer, { foreignKey: customerForeignKey });

const storeForeignKey = {
  name: 'store_id',
  type: DataTypes.BIGINT
};

Store.hasMany(Administrator, { foreignKey: storeForeignKey });

Administrator.belongsTo(Store, { foreignKey: storeForeignKey });

const deliveryForeignKey = {
  name: 'delivery_firm_id',
  type: DataTypes.BIGINT
};

DeliveryFirm.hasMany(Administrator, { foreignKey: deliveryForeignKey });

Administrator.belongsTo(DeliveryFirm, { foreignKey: deliveryForeignKey });


module.exports = Administrator;
