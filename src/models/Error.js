'use strict';

/**
 * @swagger
 * definitions:
 *   Error:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *       message:
 *         type: string
 */
class RpcError extends Error{
  constructor(message = '', code = 500){
    super(message);
    Object.assign(this, { code, message });
  }
  toJSON(){
    const { code, message } = this;
    return { code, message };
  }
}

/**
 * @swagger
 * definitions:
 *   InternalError:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 500
 *       message:
 *         type: string
 *         example: Internal error
 */
class InternalError extends RpcError{
  constructor(){
    super('Internal error', 500);
  }
}

/**
 * @swagger
 * definitions:
 *   NotFound:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 404
 *       message:
 *         type: string
 *         example: Not found
 */
class NotFound extends RpcError{
  constructor(){
    super('Not found', 404);
  }
}

/**
 * @swagger
 * definitions:
 *   UserNotFound:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 404
 *       message:
 *         type: string
 *         example: User not found
 */
class UserNotFound extends RpcError{
  constructor(){
    super('User not found', 404);
  }
}

/**
 * @swagger
 * definitions:
 *   TokenDefined:
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *         example: 400
 *       message:
 *         type: string
 *         example: Token already defined
 */
class TokenDefined extends RpcError{
  constructor(){
    super('Token already defined', 400)
  }
}

Object.assign(exports, {
  RpcError,
  InternalError,
  NotFound,
  UserNotFound,
  TokenDefined
});