'use strict';

const User = require('../models/User');
const Wallet = require('../models/Wallet');

const {
  InternalError,
  NotFound,
  TokenDefined
} = require('../models/Error');

/**
 * @swagger
 * /user/{token}:
 *   post:
 *     x-swagger-router-controller:
 *       user
 *     operationId:
 *       create
 *     tags:
 *       - User
 *     description: Создает пользователя по заданному токену
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: Токен пользователя
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Создает пользователя с заданным id и возвращает его данные
 *         schema:
 *           $ref: '#/definitions/User'
 *       200:
 *         description: Создает пользователя с заданным id и возвращает его данные
 *         schema:
 *           $ref: '#/definitions/User'
 *       400:
 *         description: Создает пользователя с заданным id и возвращает его данные
 *         schema:
 *           $ref: '#/definitions/TokenDefined'
 *       500:
 *         description: Что-то пошло не так
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function create(req, res){
  const token = req.swagger.params.token.value;
  User
    .create({ token })
    .then(
      user =>
        res
          .status(200)
          .json(user)
    )
    .catch(
      error =>
        (error.code===11000)
          ? res
            .status(400)
            .json(new TokenDefined())
          : res
            .status(500)
            .json(new InternalError())
    );
}

/**
 * @swagger
 * /user/{token}:
 *   get:
 *     x-swagger-router-controller:
 *       user
 *     operationId:
 *       read
 *     tags:
 *       - User
 *     description: Возвращает данные пользователя c заданным токеном
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: id пользователя
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       default:
 *         description: Возвращает данные по пользователю по заданному токену
 *         schema:
 *           $ref: '#/definitions/User'
 *       200:
 *         description: Возвращает данные по пользователю по заданному токену
 *         schema:
 *           $ref: '#/definitions/User'
 *       404:
 *         description: Пользователь не найден
 *         schema:
 *           $ref: '#/definitions/NotFound'
 *       500:
 *         description: Что-то пошло не так
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
function read(req, res){
  const token = req.swagger.params.token.value;

  User
    .byToken(token, NotFound)
    .then(
      user =>
        res
          .status(200)
          .json(user)
    )
    .catch(
      error =>
        (error instanceof NotFound)
          ? res
              .status(404)
              .json(error)
          : res
              .status(500)
              .json(new InternalError())
    );
}


module.exports = { create, read };