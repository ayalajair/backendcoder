const { createLogger, transports, format } = require('winston')


// Se definen los niveles de prioridad
const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  }

// Se definen los colores para cada nivel de prioridad (opcional, solo para consola en modo desarrollo)
const consoleColors = {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
  }

// Se crea el formato del mensaje
const logFormat = format.combine(
    format.colorize({ all: true }), // Colorea los mensajes para consola en modo desarrollo
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Agrega el timestamp al mensaje
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  )

// Configuración del logger para desarrollo
const developmentLogger = createLogger({
    levels,
    format: logFormat,
    transports: [
      new transports.Console({
        level: 'debug', // Loggea a partir del nivel debug en modo desarrollo
        format: format.combine(
          format.colorize({ all: true }),
          format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          })
        ),
      }),
    ],
  })

  // Configuración del logger para producción
const productionLogger = createLogger({
    levels,
    format: logFormat,
    transports: [
      new transports.Console({ level: 'info' }), // Loggea a partir del nivel info en modo producción
      new transports.File({ filename: 'errors.log', level: 'error' }), // Envía los logs de error a un archivo
    ],
  })

// Determina qué logger usar según el entorno (desarrollo o producción)
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger



exports.module = {logger}