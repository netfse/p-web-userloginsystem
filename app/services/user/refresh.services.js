const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports.refreshUser = async (req, res) => {

    console.log("===========")
    console.log(req.cookies)
    console.log("===========")

    let params = { cookies } = req.cookies;

    try {

        if (!params.cookies?.jwt) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'Token is invlid.'
            )
        }

        const refreshToken = params.cookies.jwt;

        const foundUser = await userMasterModel.findUserRefreshToken(params);

        if (!foundUser) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'User is not found'
            )
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.useremail !== decoded.useremail) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    { "useremail": decoded.useremail },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
                res.json({ accessToken })
            }
        );

        return { accessToken: accessToken }

    } catch (err) {
        throw err
    }
}