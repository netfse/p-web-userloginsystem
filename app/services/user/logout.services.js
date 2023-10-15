const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

module.exports.logoutUser = async (req, res) => {
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
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Refresh error',
                'User is not found'
            )
        }

        const deleteUserRefreshToken = await userMasterModel.deleteUserRefreshToken(params);

        const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
        const currentUser = { ...foundUser, refreshToken: '' };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        return { 'success': `The user logout!` }

    } catch (err) {
        throw err
    }
}