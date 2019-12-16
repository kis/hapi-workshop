
const Joi = require('joi');
const Boom = require('boom');

const responseSchemes = require('../../libs/responseSchemes');

async function response(request) {
  
  // Подключаем модельки
  const accessTokens = request.getModel(request.server.config.db.database, 'access_tokens');
  const users = request.getModel(request.server.config.db.database, 'users');

  // Ищем пользователя по мылу
  let userRecord = await users.findOne({ where: { email: request.query.login } });

  // если не нашли, говорим что не авторизованы
  if ( !userRecord ) {
    throw Boom.unauthorized();
  }
  
  // Проверяем совподают ли пароли
  if ( !userRecord.verifyPassword(request.query.password) ) {
    throw Boom.unauthorized();// если нет, то опять ж говорим, что не авторизованы
  }
  
  // Иначе, создаём новый токен
  let token = await accessTokens.createAccessToken(userRecord);
  
  // и возвращаем его
  return {
    meta: {
      total: 1
    },
    data: [ token.dataValues ]
  };
}

// Схема ответа
const responseScheme = Joi.object({
  meta: responseSchemes.meta,
  data: Joi.array().items(responseSchemes.token)
});

// Схема запроса
const requestScheme =Joi.object({
  login: Joi.string().email().required().example('pupkin@gmail.com'),
  password: Joi.string().required().example('12345')
});

module.exports = {
  method: 'GET',
  path: '/auth',
  options: {
    handler: response,
    tags: [ 'api' ],
    validate: {
      query: requestScheme
    },
    response: { sample: 50, schema: responseScheme }
  }
};
