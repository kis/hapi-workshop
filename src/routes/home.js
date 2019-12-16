
const Boom = require('boom');

async function response(request) {
  
  throw Boom.badRequest();
  
  // Логгер
  request.server.logger.error('request error', 'something went wrong');
  
  // Конфиг
  console.log(request.server.config);
  
  // База данных
  // const messages = request.getModel(request.server.config.db.database, 'имя_таблицы');
  
  return {
    result: 'ok',
    message: 'Hello World!'
  };
}

module.exports = {
  method: 'GET', // Метод
  path: '/', // Путь
  options: { 
    handler: response // Функция, обработчик запроса, для hapi > 17 должна возвращать промис
  }
};