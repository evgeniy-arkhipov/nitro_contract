const ethereum = require('./ethereum');
const abi = require('../config/abi');
const config = require('../config');

const address = config.contractAddress;
const account = ethereum.eth.accounts.privateKeyToAccount(config.contractOwner);
const contract = new ethereum.eth.Contract(abi, address);

const method = contract.methods.sendBounty(account.address, 2000)

const fromOwner = (methodName, ...args) => {
  const method = contract.methods[methodName](...args);
  return method
    .estimateGas()
    .then(
      gas =>
        account
          .signTransaction({
            to: address,
            gasLimit: gas,
            data: method.encodeABI()
          })
    )
    .then(
      ({rawTransaction}) =>
        ethereum
          .eth
          .sendSignedTransaction(rawTransaction)
    )
}

Object.assign(exports, {
  address,
  account,
  contract,

  balanceOf(addr){
    return contract.methods.balanceOf(addr).call();
  },

  verified(addr){
    return contract.methods.verified(addr).call();
  },

  verify(addr){
    return fromOwner('verify', addr);
  },

  setLimit(ethLimit){
    return fromOwner('setLimit', ethLimit);
  },

  funding(to, eth){
    return fromOwner('funding', to, eth);
  }
});