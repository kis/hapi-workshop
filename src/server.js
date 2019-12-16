'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const filepaths = require('filepaths');
const Sequelize = require('sequelize');
const HapiSwagger = require('hapi-swagger');
const AuthBearer = require('hapi-auth-bearer-token');
const hapiBoomDecorators = require('hapi-boom-decorators');

const Package = require('../package');
const config = require('../config');
const Logger = require('./libs/Logger');
const bearerValidation = require('./libs/bearerValidation');

const swaggerOptions = {
  info: {
    title: Package.name + ' API Documentation',
    description: Package.description
  },
  jsonPath: '/documentation.json',
  documentationPath: '/documentation',
  schemes: ['https', 'http'],
  host: config.swaggerHost,
  debug: true
};

async function createServer(logLVL=config.logLVL) {
  // Инициализируем сервер
  const server = await new Hapi.Server(config.server);
  const logger = new Logger(logLVL, 'my-hapi-app');

  // Регистрируем расширение
  await server.register([
    AuthBearer,
    hapiBoomDecorators,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    {
      plugin: require('hapi-sequelizejs'),
      options: [
        {
          name: config.db.database, // identifier
          models: [__dirname + '/models/*.js'], // Путь к модельками 
          //ignoredModels: [__dirname + '/server/models/**/*.js'], // Если какие-то из моделек нужно заигнорить
          sequelize: new Sequelize(config.db), // Инициализация
          sync: true, // default false
          forceSync: false, // force sync (drops tables) - default false
        },
      ]
    }
  ]);
  
  
  server.ext({
    type: 'onRequest',
    method: async function (request, h) {
      request.server.config = Object.assign({}, config);
      request.server.logger = logger;
      return h.continue;
    }
  });
  
  server.auth.strategy('token', 'bearer-access-token', {
    allowQueryToken: false,
    unauthorized: bearerValidation.unauthorized,
    validate: bearerValidation.validate
  });
  
  server.ext('onPreResponse', function (request, h) {
    // Если ответ прилетел не от Boom, то ничего не делаем
    if ( !request.response.isBoom ) {
      return h.continue;
    }
    
    // Создаём какое-то своё сообщение об ошибке
    let responseObj = {
      message: request.response.output.statusCode === 401 ? 'AuthError' : 'ServerError',
      status: request.response.message
    };
    
    // Не забудем про лог
    logger.error('code: ' + request.response.output.statusCode, request.response.message);
    
    return h.response(responseObj).code(request.response.output.statusCode);
  });

  // Загружаем все руты из папки ./src/routes/
  let routes = filepaths.getSync(__dirname + '/routes/');
  for (let route of routes) {
    server.route( require(route) );
  }
  
  // Запускаем сервер
  try {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) { // если не смогли стартовать, выводим ошибку
    console.log(JSON.stringify(err));
  }

  // Функция должна возвращать созданый сервер, зачем оно нужно, расскажу далее
  return server;
}

module.exports = createServer; 
