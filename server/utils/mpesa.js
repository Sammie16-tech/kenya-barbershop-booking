const axios = require('axios');
const moment = require('moment');

class MpesaHelper {
  constructor() {
    // Default system-wide credentials (for unified payment or fallback)
    this.defaultConfig = {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      shortcode: process.env.MPESA_SHORTCODE,
      passkey: process.env.MPESA_PASSKEY,
      callbackUrl: process.env.MPESA_CALLBACK_URL
    };
  }

  async getAccessToken(config = this.defaultConfig) {
    try {
      const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa Token Error:', error.response?.data || error.message);
      throw new Error('Failed to generate M-Pesa access token');
    }
  }

  async stkPush(phoneNumber, amount, accountReference, transactionDesc, shopConfig = null) {
    try {
      // Use shop-specific config if provided, otherwise use default
      const config = shopConfig && shopConfig.mpesaShortcode ? {
        consumerKey: shopConfig.mpesaConsumerKey || this.defaultConfig.consumerKey,
        consumerSecret: shopConfig.mpesaConsumerSecret || this.defaultConfig.consumerSecret,
        shortcode: shopConfig.mpesaShortcode,
        passkey: shopConfig.mpesaPasskey,
        callbackUrl: this.defaultConfig.callbackUrl
      } : this.defaultConfig;

      const accessToken = await this.getAccessToken(config);
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');
      
      let formattedPhone = phoneNumber.replace(/^(0|\+254)/, '254');
      
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: config.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: config.shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: config.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errorMessage || 'M-Pesa STK Push failed');
    }
  }
}

module.exports = new MpesaHelper();
