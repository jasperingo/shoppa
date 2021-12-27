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

  USER_INCLUDE: {
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

  USER_WITH_WITHDRAWAL_ACCOUNT_INCLUDE: {
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
      },
      {
        model: WithdrawalAccount
      }
    ]
  },

  SUB_CATEGORY_INCLUDE: {
    model: SubCategory,
    attributes: ['id', 'name', 'href'],
    include: {
      model: Category,
      attributes: ['id', 'name', 'href'],
    }
  },

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

  get(id) {
    return Store.findOne({
      where: { id },
      include: [
        this.USER_INCLUDE,
        this.SUB_CATEGORY_INCLUDE
      ]
    });
  },

  getList(offset, limit) {
    return Store.findAndCountAll({
      include: [
        this.USER_INCLUDE,
        this.SUB_CATEGORY_INCLUDE
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
        this.USER_INCLUDE,
        this.SUB_CATEGORY_INCLUDE,
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

  getWithWithdrawalAccount(id) {
    return Store.findOne({
      where: { id },
      include: [
        this.USER_WITH_WITHDRAWAL_ACCOUNT_INCLUDE,
        this.SUB_CATEGORY_INCLUDE,
      ]
    });
  },

  getByName(name) {
    return Store.findOne({
      where: {
        '$user.name$': name,
      },
      include: [
        this.USER_INCLUDE,
        this.SUB_CATEGORY_INCLUDE
      ]
    });
  },

  async add(data, password, customer_id) {

    return sequelize.transaction(async ()=> {

      const store = await Store.create({
        sub_category_id: data.sub_category_id,
        user: {
          name: data.name,
          email: data.email,
          type: User.TYPE_STORE,
          status: User.STATUS_ACTIVATING
        }
      }, { include: User });

      const administrator = await Administrator.create({
        password,
        customer_id,
        store_id: store.id,
        role: Administrator.ROLE_SUPER,
        type: Administrator.TYPE_STORE
      });

      return { store, administrator } ;
    });
  },

  update(store, { sub_category_id, name, email, phone_number }) {
    return sequelize.transaction(async ()=> {

      const userUpdate = await User.update({ email, phone_number, name }, { where: { id: store.user_id } });
      
      const storeUpdate = await Store.update({ sub_category_id }, { where: { id: store.id } });

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

