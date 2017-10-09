'use strict';

const User = require('../models/User');
const Wallet = require('../models/Wallet');

const {
  RpcError,
  UserNotFound,
  InternalError
} = require('../models/Error');

/**
 * @swagger
 * /user/{token}/wallets:
 *   get:
 *     x-swagger-router-controller:
 *       wallet
 *     operationId:
 *       wallets
 *     tags:
 *       - Wallet
 *     description: Возвращает список кошельков для пользователя с заданным токеном
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: Токен пользователя, уникально для каждого пользователя
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Массив кошельков пользователя
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Wallet'
 *       200:
 *         description: Массив кошельков пользователя
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Wallet'
 *       404:
 *         description: Возвращается если пользователь не найден
 *         schema:
 *           $ref: '#/definitions/UserNotFound'
 *       500:
 *         description: При появлении внутренней ошибки
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function wallets(req, res){
  const token = req.swagger.params.token.value;
  User
    .byToken(token, UserNotFound)
    .then(
      user =>
        Wallet
          .byOwner(user)
    )
    .then(
      wallets =>
        res
          .status(200)
          .json(wallets)
    )
    .catch(
      error =>
        (error instanceof UserNotFound)
          ? res.status(404).json(error)
          : res.status(500).json(new InternalError())
    );
}

module.exports = { wallets };