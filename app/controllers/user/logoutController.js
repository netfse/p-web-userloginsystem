const requestHandler = require('../../utils/requestHandler')
const logoutServices = require('../../services/user/logout.services')

module.exports.logoutUser = async (req, res) => {
    try {
        const result = await logoutServices.logoutUser(req, res)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}