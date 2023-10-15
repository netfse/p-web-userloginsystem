var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config({
    path:
        process.env.APP_ROOT_PATH +
        '/config/properties/system_config_properties_' +
        process.env.SERVER_ENV +
        '.env',
})

dotenvExpand.expand(myEnv)