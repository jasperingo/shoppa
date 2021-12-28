const { Op } = require("sequelize");
const Address = require("../models/Address");
const Administrator = require("../models/Administrator");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const User = require("../models/User");
const WorkingHour = require("../models/WorkingHour");
const sequelize = require("./DB");


module.exports = {

  async nameExists(name) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_DELIVERY_FIRM, name } });
    return res !== null;
  },

  async updateNameExists(name, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_DELIVERY_FIRM, 
        name, 
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  async emailExists(email) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_DELIVERY_FIRM, email } });
    return res !== null;
  },

  async updateEmailExists(email, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_DELIVERY_FIRM, 
        email,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  async phoneNumberExists(phone_number) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_DELIVERY_FIRM, phone_number } });
    return res !== null;
  },

  async updatePhoneNumberExists(phone_number, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_DELIVERY_FIRM, 
        phone_number,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  getByName(name) {
    return DeliveryFirm.findOne({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone_number', 'photo', 'status'],
          where: {
            '$user.name$': name,
          },
          include: [
            {
              model: Address,
              attributes: ['id', 'street', 'city', 'state']
            },
            {
              model: WorkingHour,
              attributes: ['id', 'day', 'opening', 'closing']
            }
          ]
        }
      ]
    });
  },

  getWithAdministrator(id, administrator_id) {
    return DeliveryFirm.findOne({
      where: { 
        id,
        '$administrators.id$': administrator_id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone_number', 'photo', 'status'],
          include: [
            {
              model: Address,
              attributes: ['id', 'street', 'city', 'state']
            },
            {
              model: WorkingHour,
              attributes: ['id', 'day', 'opening', 'closing']
            }
          ]
        },
        {
          model: Administrator,
          attributes: ['id', 'role', 'type'],
          include: {
            model: Customer,
            attributes: ['first_name', 'last_name']
          }
        },
      ]
    });
  },

  async add(data, password, customer) {

    return sequelize.transaction(async (transaction)=> {

      const deliveryFirm = await DeliveryFirm.create(
        {
          user: {
            name: data.name,
            email: data.email,
            phone_number: data.phone_number,
            type: User.TYPE_DELIVERY_FIRM,
            status: User.STATUS_ACTIVATING
          }
        }, 
        { include: User, transaction }
      );

      const administrator = await Administrator.create(
        {
          password,
          customer_id: customer.id,
          delivery_firm_id: deliveryFirm.id,
          role: Administrator.ROLE_SUPER,
          type: Administrator.TYPE_DELIVERY_FIRM
        },
        { transaction }
      );

      return { deliveryFirm, administrator };
    });
  },

};


