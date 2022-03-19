const sequelize = require("./DB");
const Administrator = require("../models/Administrator");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const Store = require("../models/Store");
const User = require("../models/User");

module.exports = {

  async getApplicationUser(admin, transaction) {
    if (admin !== null && admin.type === Administrator.TYPE_APPLICATION)
      admin.application = await User.findOne({ 
        where: { type: User.TYPE_APPLICATION },
        transaction
      });
  },

  get(id) {
    return sequelize.transaction(async (transaction)=> {
      const admin = await Administrator.findOne({   
        where: { id },
        include: [
          {
            model: Customer,
            include: {
              model: User
            } 
          },
          {
            model: Store,
            include: {
              model: User
            } 
          },
          {
            model: DeliveryFirm,
            include: {
              model: User
            } 
          }  
        ],
        transaction
      });

      await this.getApplicationUser(admin, transaction);
  
      return admin;
    });
  },

  async getByEmail(email) {
    return sequelize.transaction(async (transaction)=> {
      const admin =  await Administrator.findOne({   
        where: { '$customer.user.email$': email },
        include: {
          model: Customer,
          include: {
            model: User,
          } 
        },
        transaction
      });
      
      await this.getApplicationUser(admin, transaction);
  
      return admin;
    });
  },

  getByEmailAndStore(email, store_id) {
    return Administrator.findOne({ 
      attributes: [...Administrator.GET_ATTR, 'password'], 
      where: { 
        store_id,
        type: Administrator.TYPE_STORE,
        '$customer.user.email$': email
      },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        } 
      }
    });
  },
  
  getByEmailAndDeliveryFirm(email, delivery_firm_id) {
    return Administrator.findOne({ 
      attributes: [...Administrator.GET_ATTR, 'password'],
      where: { 
        delivery_firm_id,
        type: Administrator.TYPE_DELIVERY_FIRM,
        '$customer.user.email$': email,
      },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      } 
    });
  },

  updatePassword(id, password) {
    return Administrator.update({ password }, { where: { id } });
  },

};

