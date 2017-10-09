'use strict';

const Bitcore = require('bitcore-lib');
const fetch = require('./utils.js').fetch;
const config = require('../config');

module.exports = class Blockexplorer{

  /**
   * oprions.network - (testnet||livenet)
   * options.host - rpc url
   * @param {Object} options 
   */
  constructor(options = {}){
    Object.assign(this, Bitcore);
    Object.assign(this, options);
  }

  addr(addr){
    return fetch(`${this.host}/addr/${addr}`)
  }

  balance(addr){
    return fetch(`${this.host}/addr/${addr}/balance`)
  }

  utxo(addr){
    return fetch(`${this.host}/addr/${addr}/utxo?noCache=1`)
  }

  txByAddr(addr){
    return fetch(`${this.host}/txs/?address=${addr}`)
  }

  txSend(rawtx){
    return fetch(`${this.host}/tx/send`, {
      method: 'POST',
      body: `rawtx=${rawtx}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then(res => res.json())
  }

}