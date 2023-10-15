const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

const bcrypt = require('bcrypt');

module.exports.registerUser = async (req, res) => {
    let params = { user, pwd } = req.body;

    try {
        if (!user || !pwd) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Register error',
                'Username or password is invalid.'
            )
        }

        const duplicate = await userMasterModel.findUser(params);

        if (duplicate) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Register error',
                'Username is duplicated'
            )
        }

        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { "useremail": user, "password": hashedPwd };

        params.newUser = newUser;

        await userMasterModel.registerUser(params)
        return { 'success': `New user ${user} created!` }

    } catch (err) {
        throw err
    }
}