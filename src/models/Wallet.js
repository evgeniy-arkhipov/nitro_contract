'use strict';

const mongoose = require('mongoose');
const Hidden = require('mongoose-hidden')();
const {
  toSatoshi,
  toBitcoin
} = require('satoshi-bitcoin');

const config = require('../config');

const User = require('./User');

const promisify = require('../lib/utils').promisify;
const Ethereum = require('../rpc/ethereum');
const Bitcoin = require('../rpc/bitcoin');

const { Schema } = mongoose;


/**
 * Ethereum wallet type
 */
const TYPE_ETHEREUM = 'ethereum';

/**
 * Bitcoin wallet type
 */
const TYPE_BITCOIN  = 'bitcoin';

/**
 * @swagger
 * definitions:
 *   Wallet:
 *     type: object
 *     required:
 *       - type
 *       - owner
 *     properties:
 *       address:
 *         type: string
 *       type:
 *         type: string
 *         enum: [ethereum, bitcoin]
 *       balance:
 *         type: number
 *       frozen:
 *         type: number
 *       owner:
 *         type: string
 */
const WalletSchema = new Schema({
  address: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: [ TYPE_ETHEREUM, TYPE_BITCOIN ],
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  frozen: {
    type: Number,
    default: 0
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User' , 
    required: true, 
    index: true 
  },
  privatekey: {
    type: String,
    hide: true, 
    unique: true
  }
});

/**
 * Address generator middleware
 */
function KeysGenerator(){
  switch(this.type){
    case TYPE_BITCOIN:{
      const pkey = Bitcoin.PrivateKey.fromRandom(Bitcoin.network);
      this.privatekey = pkey.toWIF();
      this.address = pkey.toAddress();
      return;
    }break;
    case TYPE_ETHEREUM:{
      const pkey = Ethereum.utils.randomHex(32);
      const account = Ethereum.eth.accounts.privateKeyToAccount(pkey);
      this.privatekey = pkey;
      this.address = account.address;
      return;
    }
    default:
      throw new Error('Wallet type is invalid');
  }
}
WalletSchema.pre('save', function(next){
  this.isNew && KeysGenerator.call(this);
  next();
});

/**
 * Plugins
 */
WalletSchema.plugin(Hidden);

/**
 * Methods
 */
WalletSchema.method({

  toJSON(){
    const { address, type, balance, frozen, owner } = this;
    return { address, type, balance, frozen, owner: owner.token }
  },
  
  /**
   * Send from "this.address" to "to" "value" coin
   * @param {String} to 
   * @param {String} amount
   * @param {String} message
   */
  send(to, amount, message = null){
    return Promise.resolve({txId: 'sended'})
  },

  /**
   * Update and return balance for current wallet
   */
  getBalance(){
    const EthBalance = () =>
      Ethereum.eth
        .getBalance(this.address)
        .then(balance => {
          balance = Ethereum.utils.fromWei(balance);
          this.balance = balance;
          return Promise.all([
            balance,
            this.save()
          ]);
        })
        .then(([balance]) => balance);

    const BtcBalance = () =>
      Bitcoin
        .balance(this.address)
        .then(balance => {
          balance = toBitcoin(balance);
          this.balance = balance;
          return Promise.all([
            balance,
            this.save()
          ]);
        })
        .then(([balance]) => balance);

    switch(this.type){
      case TYPE_ETHEREUM:
        return EthBalance();
      case TYPE_BITCOIN:
        return BtcBalance();
      default:
        return Promise.reject(new Error('type is not defined'));
    }
  }

});

/**
 * Statics
 */
WalletSchema.static({
  
  byOwner(owner){
    const find = promisify(this.find.bind(this));
    return find({ owner })
      .then(
        wallets => 
          Promise.all(wallets.map(
            w => w.getBalance()
          ))
          .then(balances => wallets)
      );
  },

  get types(){
    return {
      [TYPE_BITCOIN]: TYPE_BITCOIN,
      [TYPE_ETHEREUM]: TYPE_ETHEREUM
    }
  }

});

/**
 * Register
 */
module.exports = mongoose.model('Wallet', WalletSchema);