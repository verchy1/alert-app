const functions = require('firebase-functions');
const axios = require('axios');

// Remplacez les valeurs par vos propres informations Africa's Talking
const username = 'sandbox';
const apiKey = 'atsk_edc3692f2c1e4d30247ddaa52e7cdcf3151ee16bdcc2baf1ed28470beba865c410245813';
const shortCode = '+242';

exports.sendSMS = functions.https.onCall((data, context) => {
  const { phoneNumber, message } = data;

  // URL de l'API Africa's Talking pour l'envoi de SMS
  const url = `https://api.africastalking.com/version1/messaging`;

  return axios.post(url, {
    username: username,
    apiKey: apiKey,
    to: '065254776',
    message: 'hello world',
    from: shortCode
  })
  .then(response => {
    return { success: true, messageSid: response.data.SMSMessageData.MessageId };
  })
  .catch(error => {
    return { success: false, error: error.message };
  });
});
