const requestHandler = require('../../utils/requestHandler')
//const userAvatarServices = require('../../services/userdata/useravatar.services')

module.exports.getUserAvatar = async (req, res) => {
    try {
        const result = {} //await userAvatarServices.authUser(req, res)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}

module.exports.updateUserAvatar = async (req, res) => {
    try {
        const result = {} //await userAvatarServices.authUser(req, res)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}

module.exports.deleteUseravatar = async (req, res) => {
    try {
        const result = {} //await userAvatarServices.authUser(req, res)
        return requestHandler.sendSuccess(req, res)(result)
    } catch (err) {
        logger.error(err)
        return requestHandler.sendError(req, res, err)
    }
}