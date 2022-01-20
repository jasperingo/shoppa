const fetch = require("node-fetch");
const WithdrawalAccount = require("../models/WithdrawalAccount");


module.exports = {

  async getByUser(user_id) {
    return WithdrawalAccount.findOne({ where: { user_id } });
  },

  async addOrUpdate(user, { bank_code, account_name, account_number, account_type }) {

    const response = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
      },
      body: JSON.stringify({
        bank_code,
        account_number, 
        type: "nuban", 
        name: account_name,  
        currency: "NGN"
      })
    });

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();

    if (user.withdrawal_account === null) {
      return WithdrawalAccount.create({ 
        user_id: user.id, 
        paystack_recipient_code: data.data.recipient_code, 
        bank_name: data.data.details.bank_name, 
        account_name, 
        account_number, 
        account_type 
      });
    } else {
      return WithdrawalAccount.update({ 
        paystack_recipient_code: data.data.recipient_code, 
        bank_name: data.data.details.bank_name, 
        account_name, 
        account_number, 
        account_type 
      }, 
      { where: { id: user.withdrawal_account.id } });
    }
  },


};

