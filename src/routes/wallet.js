'use strict';

const contract = require('../rpc/contract');

const {
  RpcError,
  UserNotFound,
  InternalError
} = require('../models/Error');

/**
 * @swagger
 * /balance/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       wallet
 *     operationId:
 *       balance
 *     tags:
 *       - Wallet
 *     description: Возвращает балансы токенов
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Адрес ETH-кошелька
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Возвращает балансы
 *         schema:
 *          type: object
 *          properties:
 *            balance:
 *              type: integer
 *              description: Текущий баланс
 *            frozen:
 *              type: integer
 *              description: Замороженный баланс
 *            decimals:
 *              type: integer
 *              description: Делитель
 *       500:
 *         description: При появлении внутренней ошибки
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function balance(req, res){
  const address = req.swagger.params.address.value;

  Promise.all([
    contract.decimals(),
    contract.balanceOf(address),
    contract.frozenBalanceOf(address)
  ]).then(
    (decimals, balance, frozen) =>
      res
        .status(200)
        .json({ balance, frozen, decimals})
  ).catch(
    () =>
      res
        .status(500)
        .json(new InternalError())
  )
}

/**
 * @swagger
 * /verified/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       wallet
 *     operationId:
 *       verified
 *     tags:
 *       - Wallet
 *     description: Возвращает состояние верифицированности пользователя
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Адрес ETH-кошелька
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Состояние верифицированности запрашиваемого кошелька
 *         schema:
 *          type: object
 *          properties:
 *            address:
 *              type: string
 *            verified:
 *              type: boolean
 *       500:
 *         description: При появлении внутренней ошибки
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function verified(req, res){
  const address = req.swagger.params.address.value;

  contract
    .verified(address)
    .then(
      verified =>
        res
          .status(200)
          .json({ address, verified })
    )
    .catch(
      () =>
        res
          .status(500)
          .json(new InternalError())
    )
  
}

/**
 * @swagger
 * /verify/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       wallet
 *     operationId:
 *       verify
 *     tags:
 *       - Wallet
 *     description: Верифицирует ETH-кошелек пользователя
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Адрес ETH-кошелька
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Информация о транзакции, которая верифицирует пользователя
 *         schema:
 *          type: object
 *          properties:
 *            address:
 *              type: string
 *            tx:
 *              type: object
 *       500:
 *         description: При появлении внутренней ошибки
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function verify(req, res){
  const address = req.swagger.params.address.value;
  
  contract
    .verify(address)
    .then(
      tx =>
        res
          .status(200)
          .json({ address, tx })
    )
    .catch(
      () =>
        res
          .status(500)
          .json(new InternalError())
    )
}

/**
 * @swagger
 * /unverify/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       wallet
 *     operationId:
 *       unverify
 *     tags:
 *       - Wallet
 *     description: Убирает состояние верифицированности ETH-кошелека пользователя
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Адрес ETH-кошелька
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Информация о транзакции, которая деверифицирует пользователя
 *         schema:
 *          type: object
 *          properties:
 *            address:
 *              type: string
 *            tx:
 *              type: object
 *       500:
 *         description: При появлении внутренней ошибки
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function unverify(req, res){
  const address = req.swagger.params.address.value;
  
  contract
    .verify(address)
    .then(
      tx =>
        res
          .status(200)
          .json({ address, tx })
    )
    .catch(
      () =>
        res
          .status(500)
          .json(new InternalError())
    )
}

/**
 * @swagger
 * /txs/{type}/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       wallet
 *     operationId:
 *       tx
 *     tags:
 *       - Wallet
 *     description: Возвращает историю транзакций
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: Тип кошелька
 *         in: path
 *         required: true
 *         type: string
 *         enum: [eth, btc]
 *       - name: address
 *         description: Адрес кошелька
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Информация о транзакции, которая деверифицирует пользователя
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Tx'
 *       500:
 *         description: При появлении внутренней ошибки
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function tx(req, res){
  const address = req.swagger.params.address.value;
  
  contract
    .verify(address)
    .then(
      tx =>
        res
          .status(200)
          .json({ address, tx })
    )
    .catch(
      () =>
        res
          .status(500)
          .json(new InternalError())
    )
}



module.exports = { balance, verified, verify, unverify, tx };