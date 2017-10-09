'use strict';

const mongoose = require('mongoose');
const promisify = require('../lib/utils').promisify;

const Wallet = require('./Wallet');

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - token
 *     properties:
 *       token:
 *         type: string
 *         description: Токен пользователя
 */
const UserSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true 
  }
});

UserSchema.pre('save', function(next){
  this.wasNew = this.isNew;
  next();
});

/**
 * Wallet generator middleware
 */
function WalletGenerator(user, next){
  !!!this.wasNew && next();
  
  Promise.all(
    Object
      .keys(Wallet.types)
      .map(
        type =>
          new Wallet({ type, owner: user })
            .save()
      )
  )
  .catch(next);

  next();
}
UserSchema.post('save', WalletGenerator);


/**
 * Methods
 */
UserSchema.method({

  toJSON(){
    const { token } = this;
    return { token }
  },

  wallets(){
    const owner = this;
    return Wallet
      .find({ owner })
      .populate('owner')
      .exec();
  }

});

/**
 * Statics
 */
UserSchema.static({

  byToken(token, nullable = true){
    const findOne = promisify(this.findOne.bind(this));
    return findOne({ token })
      .then(
        user =>
          (nullable!==true && !!!user)
            ? Promise.reject(new nullable())
            : Promise.resolve(user)
      );
  }

});

/**
 * Register
 */
module.exports = mongoose.model('User', UserSchema);