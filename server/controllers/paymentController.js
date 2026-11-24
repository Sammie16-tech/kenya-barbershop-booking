const { Payment, Appointment } = require('../models');
const mpesa = require('../utils/mpesa');

exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { appointmentId, phoneNumber } = req.body;

    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        { model: Service },
        { model: Shop }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const shop = appointment.Shop;

    // Initiate real STK Push with shop-specific config
    const stkResponse = await mpesa.stkPush(
      phoneNumber,
      Math.round(appointment.Service.price),
      `APT-${appointment.id.slice(0, 8)}`,
      `Payment for ${appointment.Service.name}`,
      {
        mpesaShortcode: shop.mpesaShortcode,
        mpesaPasskey: shop.mpesaPasskey,
        mpesaConsumerKey: shop.mpesaConsumerKey,
        mpesaConsumerSecret: shop.mpesaConsumerSecret
      }
    );

    // Create real payment record
    const payment = await Payment.create({
      appointmentId,
      amount: appointment.Service.price,
      phoneNumber: phoneNumber,
      merchantRequestId: stkResponse.MerchantRequestID,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      status: 'pending'
    });

    res.json({
      message: 'Payment initiated. Please check your phone for the M-Pesa prompt.',
      payment
    });
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    res.status(500).json({ 
      message: 'Payment initiation failed',
      error: error.message 
    });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    console.log('M-Pesa callback:', JSON.stringify(callbackData, null, 2));

    if (callbackData.Body.stkCallback.ResultCode === 0) {
      const checkoutRequestId = callbackData.Body.stkCallback.CheckoutRequestID;
      
      const payment = await Payment.findOne({ where: { checkoutRequestId } });
      if (payment) {
        payment.status = 'completed';
        const meta = callbackData.Body.stkCallback.CallbackMetadata.Item;
        payment.mpesaReceiptNumber = meta.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        payment.transactionDate = new Date();
        await payment.save();

        await Appointment.update(
          { status: 'confirmed', paymentStatus: 'paid' },
          { where: { id: payment.appointmentId } }
        );
      }
    } else {
      const checkoutRequestId = callbackData.Body.stkCallback.CheckoutRequestID;
      await Payment.update(
        { status: 'failed', failureReason: callbackData.Body.stkCallback.ResultDesc },
        { where: { checkoutRequestId } }
      );
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    const payment = await Payment.findOne({ where: { checkoutRequestId } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ status: payment.status });
  } catch (error) {
    res.status(500).json({ message: 'Error checking payment status' });
  }
};

exports.subscribeShop = async (req, res) => {
  try {
    const { shopId, plan, phoneNumber } = req.body;
    const amount = plan === 'yearly' ? 3200 : 300;

    // Use platform-wide M-Pesa config for subscriptions
    const stkResponse = await mpesa.stkPush(
      phoneNumber,
      amount,
      `SUB-${shopId.slice(0, 8)}`,
      `Subscription for ${plan} plan`,
      {
        mpesaShortcode: process.env.MPESA_SHORTCODE,
        mpesaPasskey: process.env.MPESA_PASSKEY,
        mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY,
        mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET
      }
    );

    res.json({
      message: 'Subscription prompt sent. Please complete payment on your phone.',
      checkoutRequestId: stkResponse.CheckoutRequestID
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Failed to initiate subscription payment' });
  }
};