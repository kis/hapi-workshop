
const Joi = require('joi');

const responseSchemes = require('../../libs/responseSchemes');

async function response(request) {

  const messages = request.getModel(request.server.config.db.database, 'messages');

  let data = await messages.findAll();
  let count = await messages.count();
  let result = [];
  for (let item of data) {
    result.push(item.get({ plain: true }));
  }
  
  return {
    meta: {
      total: count
    },
    data: result
  };
}

// Схема ответа
const responseScheme = Joi.object({
  meta: responseSchemes.meta,
  data: Joi.array().items(responseSchemes.message)
});

module.exports = {
  method: 'GET',
  path: '/messages',
  options: {
    handler: response,
    tags: ['api'], // Necessary tag for swagger
    response: { schema: responseScheme }
  }
};