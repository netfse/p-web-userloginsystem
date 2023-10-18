const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

module.exports.logoutUser = async (req, res) => {
    let params = {
        refreshToken: req.cookies.jwt,
    }

    try {
        if (!params.refreshToken) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'Refresh token is invlid.'
            )
        }

        const foundUser = await userMasterModel.findUserRefreshToken(params);

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'User is not found'
            )
        }

        const currentUser = { ...foundUser, refreshToken: '' };

        params.currentUser = currentUser;

        await userMasterModel.deleteUserRefreshToken(params);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        return { 'success': `The user[${foundUser.useremail}] is logged out!` }

    } catch (err) {
        throw err
    }
}