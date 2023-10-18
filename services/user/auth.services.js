const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports.authUser = async (req, res) => {
    let params = { user, pwd } = req.body;

    try {
        if (!user || !pwd) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Login error',
                'Username and password are required.'
            )
        }

        const foundUser = await userMasterModel.findUser(params);

        if (!foundUser) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Login error',
                'User is not found'
            )
        }

        const match = await bcrypt.compare(pwd, foundUser.password);

        if (match) {
            const accessToken = jwt.sign(
                { "useremail": foundUser.useremail },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "useremail": foundUser.useremail },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            const currentUser = { ...foundUser, refreshToken };

            params.currentUser = currentUser;

            await userMasterModel.refreshUserToken(params);

            res.cookie('jwt',
                refreshToken,
                {
                    httpOnly: true, sameSite: 'None',
                    secure: true, maxAge: 24 * 60 * 60 * 1000
                }
            );
            return { accessToken: accessToken }

        }
        else {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Login error',
                'User password is invaild'
            )
        }
    } catch (err) {
        throw err
    }
}