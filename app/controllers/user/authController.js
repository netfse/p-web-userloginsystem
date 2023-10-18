const requestHandler = require('../../utils/requestHandler')
const authServices = require('../../services/user/auth.services')

module.exports.authUser = async (req, res) => {
    try {
        const result = await authServices.authUser(req, res)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}