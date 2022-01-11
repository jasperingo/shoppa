const WithdrawalAccount = require("../models/WithdrawalAccount");


module.exports = {

  async getByUser(user_id) {
    return WithdrawalAccount.findOne({ where: { user_id } });
  },

  async addOrUpdate(user, { bank_name, account_name, account_number, account_type }) {
    
    const account = await WithdrawalAccount.findOne({ where: { user_id: user.id } });

    if (account === null) {
      return WithdrawalAccount.create({ user_id: user.id, bank_name, account_name, account_number, account_type });
    } else {
      return WithdrawalAccount.update({ bank_name, account_name, account_number, account_type }, { where: { id: account.id }});
    }
  },


};

