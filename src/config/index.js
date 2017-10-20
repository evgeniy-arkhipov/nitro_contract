const {
  MONGO_URI = 'mongodb://n0cte:19523@ds113915.mlab.com:13915/crowdapi',
  HOST_URI = 'localhost:8080',

  POLONIEX_KEY = 'OOLZ4ZWG-4XMD33SR-WCPLLAGS-OEUJ3F0H',
  POLONIEX_SEC = '2e55a8f124a63b837c188f6c8d6e66b0106248db721d89fa1ceb24af2abf3cd2d28023f38a8eb9179719516d83cbab9ed31823d879ec43f8730b1c2447365414',

  BTC_COMPANY_ADDRESS = 'mpMHGvoDmnEBaSW3JXZQB7sgatV8YkJDFU',
  ETH_CONTRACT_ADDRESS = '0x3D912097D3A2dDF39136D1d2dEe0138555Beb9A2',
  ETH_CONTRACT_OWNER = '0x99800e73c5ae15c80937fd42d26ca08249081727ae72155072bca9565c2aff40',

  BITCORE_RPC = 'https://testnet.blockexplorer.com',
  ETHEREUM_RPC = 'https://ropsten.infura.io/UoiDPLlaAoM5GmpK8aR3',
  
  NODE_ENV = 'development'
} = process.env;

module.exports = {
  env: NODE_ENV,

  hostUri: HOST_URI,
  mongoUri: MONGO_URI,

  poloniexKey: POLONIEX_KEY,
  poloniexSec: POLONIEX_SEC,
  
  btcAddress: BTC_COMPANY_ADDRESS,
  contractAddress: ETH_CONTRACT_ADDRESS,
  contractOwner: ETH_CONTRACT_OWNER,
  
  bitcoinRpc: BITCORE_RPC,
  ethereumRpc: ETHEREUM_RPC,

  btcCompanyAddr: BTC_COMPANY_ADDRESS
}