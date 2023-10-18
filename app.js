require('./config/system.config')
require('./public/global') //global variable setting

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(require('./routes'))

let PORT = process.env.SYSTEM_SERVER_PORT || 3666

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));