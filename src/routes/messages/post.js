
const Joi = require('joi');

const responseSchemes = require('../../libs/responseSchemes');

async function response(request) {

  const messages = request.getModel(request.server.config.db.database, 'messages');
  let newMessage = await messages.create(request.payload);

  let count = await messages.count();

  return {
    meta: {
      total: count
    },
    data: [ newMessage.dataValues ]
  };
}

// Схема ответа
const responseScheme = Joi.object({
  meta: responseSchemes.meta,
  data: Joi.array().items(responseSchemes.message)
});

module.exports = {
  method: 'POST',
  path: '/messages',
  options: {
    handler: response,
    tags: ['api'], // Necessary tag for swagger
    auth: 'token',
    validate: {
      payload: {
        user_id: Joi.number().integer().required().example(1),
        message: Joi.string().min(1).max(100).required().example('Lorem ipsum')
      }
    },
    response: { schema: responseScheme }
  }
};