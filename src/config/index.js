const {
  MONGO_URI = 'mongodb://n0cte:19523@ds113915.mlab.com:13915/crowdapi',
  HOST_URI = 'localhost:8080',
  BITCORE_RPC = 'https://testnet.blockexplorer.com/api',
  ETHEREUM_RPC = 'https://ropsten.infura.io/UoiDPLlaAoM5GmpK8aR3',
  NODE_ENV = 'development'
} = process.env;

module.exports = {
  env: NODE_ENV,

  hostUri: HOST_URI,
  mongoUri: MONGO_URI,
  
  bitcoinRpc: BITCORE_RPC,
  ethereumRpc: ETHEREUM_RPC
}