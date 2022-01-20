const fetch = require("node-fetch");

module.exports = {

  async accountNumberExists(number, code) {
    
    const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${number}&bank_code=${code}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
      }
    });

    return response.ok;
  },

  async getList() {
    
    const response = await fetch('https://api.paystack.co/bank?country=nigeria');

    const data = await response.json();

    return data.data.map(i=> ({ name: i.name, code: i.code }));
  },

};

