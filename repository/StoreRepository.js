const { Op } = require("sequelize");
const Address = require("../models/Address");
const Administrator = require("../models/Administrator");
const Category = require("../models/Category");
const Customer = require("../models/Customer");
const Store = require("../models/Store");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const WithdrawalAccount = require("../models/WithdrawalAccount");
const WorkingHour = require("../models/WorkingHour");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const res = await Store.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

  async nameExists(name) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_STORE, name } });
    return res !== null;
  },

  async updateNameExists(name, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_STORE, 
        name, 
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  async emailExists(email) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_STORE, email } });
    return res !== null;
  },

  async updateEmailExists(email, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_STORE, 
        email,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  async phoneNumberExists(phone_number) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_STORE, phone_number } });
    return res !== null;
  },

  async updatePhoneNumberExists(phone_number, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_STORE, 
        phone_number,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  get(id) {
    return Store.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: User.GET_ATTR,
          include: [
            {
              model: Address,
              attributes: Address.GET_ATTR
            },
            {
              model: WorkingHour,
              attributes: WorkingHour.GET_ATTR
            }
          ]
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        }
      ]
    });
  },

  getList(offset, limit) {
    return Store.findAndCountAll({
      include: [
        {
          model: User,
          attributes: User.GET_ATTR,
          include: [
            {
              model: Address,
              attributes: Address.GET_ATTR
            },
            {
              model: WorkingHour,
              attributes: WorkingHour.GET_ATTR
            }
          ]
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        }
      ],
      order: [[User, 'created_at', 'DESC']],
      offset,
      limit
    });
  },

  getWithAdministrator(id, administrator_id) {
    return Store.findOne({
      where: { 
        id,
        '$administrators.id$': administrator_id
      },
      include: [
        {
          model: User,
          attributes: User.GET_ATTR,
          include: [
            {
              model: Address,
              attributes: Address.GET_ATTR
            },
            {
              model: WorkingHour,
              attributes: WorkingHour.GET_ATTR
            }
          ]
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        },
        {
          model: Administrator,
          attributes: Administrator.GET_ATTR,
          include: {
            model: Customer,
            attributes: Customer.GET_ATTR
          }
        },
      ]
    });
  },

  getWithWithdrawalAccount(id) {
    return Store.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: User.GET_ATTR,
          include: [
            {
              model: Address,
              attributes: Address.GET_ATTR
            },
            {
              model: WorkingHour,
              attributes: WorkingHour.GET_ATTR
            },
            {
              model: WithdrawalAccount
            }
          ]
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        }
      ]
    });
  },

  getByName(name) {
    return Store.findOne({
      include: [
        {
          model: User,
          attributes: User.GET_ATTR,
          where: {
            '$user.name$': name,
          },
          include: [
            {
              model: Address,
              attributes: Address.GET_ATTR
            },
            {
              model: WorkingHour,
              attributes: WorkingHour.GET_ATTR
            }
          ]
        },
        {
          model: SubCategory,
          attributes: SubCategory.GET_ATTR,
          include: {
            model: Category,
            attributes: Category.GET_ATTR,
          }
        }
      ]
    });
  },

  async add({ sub_category_id, name, email, phone_number }, password, customer_id) {

    return sequelize.transaction(async (t)=> {

      const store = await Store.create(
        {
          sub_category_id,
          user: {
            name,
            email,
            phone_number,
            type: User.TYPE_STORE,
            status: User.STATUS_ACTIVATING
          }
        }, 
        { include: User, transaction: t }
      );

      const administrator = await Administrator.create(
        {
          password,
          customer_id,
          store_id: store.id,
          role: Administrator.ROLE_SUPER,
          type: Administrator.TYPE_STORE
        },
        { transaction: t }
      );

      return { store, administrator };
    });
  },

  update(store, { sub_category_id, name, email, phone_number }) {
    return sequelize.transaction(async (t)=> {

      const userUpdate = await User.update(
        { email, phone_number, name }, 
        { where: { id: store.user_id }, transaction: t }
      );
      
      const storeUpdate = await Store.update(
        { sub_category_id }, 
        { where: { id: store.id }, transaction: t }
      );

      return userUpdate[0] || storeUpdate[0];
    });
  },

  updatePhoto(store, photo) {
    return User.update({ photo }, { where : { id: store.user_id } });
  },
  
  updateStatus(store, status) {
    return User.update({ status }, { where : { id: store.user_id } });
  },
  
};

