const ethereum = require('./ethereum');
const abi = require('../config/abi');
const config = require('../config');

const TokenContract = new ethereum.eth.Contract(abi, config.contractAddress);

module.exports = TokenContract;