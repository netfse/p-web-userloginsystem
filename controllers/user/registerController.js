const requestHandler = require('../../utils/requestHandler')
const registerServices = require('../../services/user/register.services')

module.exports.registerUser = async (req, res) => {
    try {
        const result = await registerServices.registerUser(req)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}