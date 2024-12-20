const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'orseAlert',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

