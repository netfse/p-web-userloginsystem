const requestHandler = require('../../utils/requestHandler')
const refreshServices = require('../../services/user/refresh.services')

module.exports.refreshUser = async (req, res) => {
    try {
        const result = await refreshServices.refreshUser(req, res)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}