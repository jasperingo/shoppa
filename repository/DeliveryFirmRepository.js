const { Op } = require("sequelize");
const Address = require("../models/Address");
const Administrator = require("../models/Administrator");
const DeliveryFirm = require("../models/DeliveryFirm");
const User = require("../models/User");
const WithdrawalAccount = require("../models/WithdrawalAccount");
const WorkingHour = require("../models/WorkingHour");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const res = await DeliveryFirm.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

  async statusIsActive(id) {
    const res = await DeliveryFirm.findOne({ 
      attributes: ['id'], 
      where: {
        id, 
        '$user.type$': User.TYPE_DELIVERY_FIRM, 
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
        type: User.TYPE_DELIVERY_FIRM, 
        status: {
          [Op.or]: [User.STATUS_ACTIVE, User.STATUS_ACTIVATING]
        }
      } 
    });
    return res !== null;
  },

  get(id) {
    return DeliveryFirm.findOne({
      where: { id },
      include: {
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
      }
    });
  },

  getByName(name) {
    return DeliveryFirm.findOne({
      include: {
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
      }
    });
  },

  getList(offset, limit) {
    return DeliveryFirm.findAndCountAll({
      include: {
        model: User,
        attributes: User.GET_ATTR,
        include: {
          model: Address,
          attributes: Address.GET_ATTR
        }
      },
      order: [[User, 'created_at', 'DESC']],
      offset,
      limit
    });
  },

  getCount() {
    return DeliveryFirm.count();
  },
  
  async add({ name, email, phone_number }, password, customer, email_verification_token) {

    return sequelize.transaction(async (transaction)=> {

      const deliveryFirm = await DeliveryFirm.create(
        {
          user: {
            name,
            email,
            phone_number,
            email_verification_token,
            type: User.TYPE_DELIVERY_FIRM,
            status: User.STATUS_PENDING
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
  
  update(deliveryFirm, { name, email, phone_number }) {
    return User.update({ email, phone_number, name }, { where: { id: deliveryFirm.user_id } });
  },

  updatePhoto(deliveryFirm, photo) {
    return User.update({ photo }, { where : { id: deliveryFirm.user_id } });
  },

  updateStatus(deliveryFirm, status) {

    if (status === User.STATUS_ACTIVE && !deliveryFirm.user.email_verified)
      status = User.STATUS_EMAIL_PENDING;
    else if (status === User.STATUS_ACTIVE && (deliveryFirm.user.addresses.length === 0 || deliveryFirm.user.working_hours.length === 0))
      status = User.STATUS_ACTIVATING;

    return User.update({ status }, { where : { id: deliveryFirm.user_id } });
  },

};
