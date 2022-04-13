const { Op } = require("sequelize");
const Address = require("../models/Address");
const Administrator = require("../models/Administrator");
const Category = require("../models/Category");
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

  async statusIsActive(id) {
    const res = await Store.findOne({ 
      attributes: ['id'], 
      where: {
        id, 
        '$user.type$': User.TYPE_STORE, 
        '$user.status$': User.STATUS_ACTIVE
      },
      include: {
        model: User,
        attributes: []
      }
    });
    return res !== null;
  },
  
  async statusIsActiveOrActivating(id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: {
        id, 
        type: User.TYPE_STORE, 
        status: {
          [Op.or]: [User.STATUS_ACTIVE, User.STATUS_ACTIVATING]
        }
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
            },
            {
              model: WithdrawalAccount,
              attributes: WithdrawalAccount.GET_ATTR
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
          include: {
            model: Address,
            attributes: Address.GET_ATTR
          }
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

  getCount() {
    return Store.count();
  },

  getRandomList(limit) {
    return sequelize.transaction(async (transaction)=> {
      const rows = await Store.findAll({
        where: { '$user.status$': User.STATUS_ACTIVE },
        include: [
          {
            model: User,
            attributes: User.GET_ATTR,
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
        order: sequelize.random(),
        limit
      });

      for (let store of rows) {
          
        let address = await Address.findOne({
          attributes: Address.GET_ATTR,
          where: { user_id: store.user.id },
          transaction
        });
        
        store.user.setDataValue('addresses', [address]);
      }

      return rows;
    });
  },

  getListByRecommended(limit) {
    return sequelize.transaction(async (transaction)=> {
      const rows = await Store.findAll({
        where: { 
          recommended: true,
          '$user.status$': User.STATUS_ACTIVE 
        },
        include: [
          {
            model: User,
            attributes: User.GET_ATTR,
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
        order: sequelize.random(),
        limit
      });

      for (let store of rows) {
          
        let address = await Address.findOne({
          attributes: Address.GET_ATTR,
          where: { user_id: store.user.id },
          transaction
        });
        
        store.user.setDataValue('addresses', [address]);
      }

      return rows;
    });
  },
  
  getListBySearch(offset, limit, { q, sub_category_id }) {

    const where = { '$user.status$': User.STATUS_ACTIVE };

    if (q) {
      where['$user.name$'] = { [Op.like]: `%${q}%` };
    }

    if (sub_category_id) {
      where.sub_category_id = sub_category_id;
    }

    return sequelize.transaction(async (transaction)=> {

      const { count, rows } = await Store.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: User.GET_ATTR,
            
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
        order: [[User, 'name', 'ASC']],
        offset,
        limit,
        transaction
      });

      for (let store of rows) {
        
        let address = await Address.findOne({
          attributes: Address.GET_ATTR,
          where: { user_id: store.user.id },
          transaction
        });
        
        store.user.setDataValue('addresses', [address]);
      }

      return { count, rows };
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
            },
            {
              model: WithdrawalAccount,
              attributes: WithdrawalAccount.GET_ATTR
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

  async add({ sub_category_id, name, email, phone_number }, password, customer_id, email_verification_token) {

    return sequelize.transaction(async (t)=> {

      const store = await Store.create(
        {
          sub_category_id,
          user: {
            name,
            email,
            phone_number,
            email_verification_token,
            type: User.TYPE_STORE,
            status: User.STATUS_PENDING,
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

  updateRecommended(store, recommended) {
    return Store.update({ recommended }, { where : { id: store.id } });
  },
  
  updateStatus(store, status) {

    if (status === User.STATUS_ACTIVE && !store.user.email_verified)
      status = User.STATUS_EMAIL_PENDING;
    else if (status === User.STATUS_ACTIVE && (store.user.addresses.length === 0 || store.user.working_hours.length === 0))
      status = User.STATUS_ACTIVATING;

    return User.update({ status }, { where : { id: store.user_id } });
  },
  
};

