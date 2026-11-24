const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/mpesa', protect, paymentController.initiateMpesaPayment);
router.post('/subscribe', protect, paymentController.subscribeShop);
router.get('/status/:checkoutRequestId', protect, paymentController.getPaymentStatus);
router.post('/mpesa-callback', paymentController.mpesaCallback);

// Simulator for testing (Remove in production)
router.post('/simulate-callback', async (req, res) => {
  const { checkoutRequestId } = req.body;
  req.body = {
    Body: {
      stkCallback: {
        MerchantRequestID: 'SIM-123',
        CheckoutRequestID: checkoutRequestId,
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'Amount', Value: 1000 },
            { Name: 'MpesaReceiptNumber', Value: 'QWE123RTY4' },
            { Name: 'TransactionDate', Value: 20240101120000 },
            { Name: 'PhoneNumber', Value: 254700000000 }
          ]
        }
      }
    }
  };
  return paymentController.mpesaCallback(req, res);
});

module.exports = router;
