const logLVLS = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  off: 5
};

class CustomLogger {

  constructor(logLVL='info', appname='') {
    this.logLVL = logLVLS[ logLVL ] || logLVLS[ 'info' ];
    this.appname = appname;
  }

  serverError(tags, msg, channel) {
    this.log(tags[ 0 ] || 'info', channel, msg);
  }

  sqlLog(msg) {
    this.log('debug', 'SQL', msg);
  }

  log(severity='info', log_type='app', message='', extra='') {
    let curLVL = logLVLS[ severity ] || logLVLS[ 'info' ];

    if ( curLVL >= this.logLVL ) {
      // eslint-disable-next-line
      console.log(JSON.stringify({
        timestamp: new Date(),
        app_name: this.appname,
        log_type: log_type.toUpperCase(),
        severity: severity.toUpperCase(),
        message: message,
        extra: extra
      }, null, ' '));
    }
  }

  debug(log_type='app', message='', extra='') {
    this.log('debug', log_type, message, extra);
  }

  info(log_type='app', message='', extra='') {
    this.log('info', log_type, message, extra);
  }

  warn(log_type='app', message='', extra='') {
    this.log('warn', log_type, message, extra);
  }

  error(log_type='app', message='', extra='') {
    this.log('error', log_type, message, extra);
  }
}

module.exports = CustomLogger;