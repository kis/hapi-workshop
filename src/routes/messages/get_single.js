
const Joi = require('joi');
const Boom = require('boom');

const responseSchemes = require('../../libs/responseSchemes');

async function response(request) {

  const messages = request.getModel(request.server.config.db.database, 'messages');
  let data = await messages.findOne({ where: { id: request.params.id } });

  if ( !data ) {
    throw Boom.notFound();
  }

  let count = await messages.count();

  return {
    meta: {
      total: count
    },
    data: [ data.get({ plain: true }) ]
  };
}

// Схема ответа
const responseScheme = Joi.object({
  meta: responseSchemes.meta,
  data: Joi.array().items(responseSchemes.message)
});

module.exports = {
  method: 'GET',
  path: '/messages/{id}',
  options: {
    handler: response,
    tags: ['api'], // Necessary tag for swagger
    validate: {
      params: {
        id: Joi.number().integer().required()
      }
    },
    response: { schema: responseScheme }
  }
};