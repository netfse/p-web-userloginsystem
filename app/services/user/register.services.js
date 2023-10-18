const requestHandler = require('../../utils/requestHandler')
const userMasterModel = require('../../model/user/userMaster.model')

const bcrypt = require('bcrypt');

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

module.exports.registerUser = async (req, res) => {
    let params = { user, pwd } = req.body;

    try {
        if (!user || !pwd) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Register error',
                'Useremail or password is invalid.'
            )
        }

        if (!validateEmail(user)) {
            requestHandler.throwError(
                global.http.status.unauthorized,
                'Register error',
                'Useremail is invalid.'
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