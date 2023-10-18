const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports.refreshUser = async (req, res) => {
    let params = {
        refreshToken: req.cookies.jwt,
    }

    try {
        if (!params.refreshToken) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'Refresh token is invlid'
            )
        }

        const refreshToken = params.refreshToken;

        const foundUser = await userMasterModel.findUserRefreshToken(params);

        if (!foundUser) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'User is not found'
            )
        }

        let accessToken = "";

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.useremail !== decoded.useremail) {
                    requestHandler.throwError(
                        global.http.status.unauthorized,
                        'Refresh error',
                        'Useremail is invaild'
                    )
                }

                accessToken = jwt.sign(
                    { "useremail": decoded.useremail },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
            }
        );

        return { accessToken: accessToken }

    } catch (err) {
        throw err
    }
}