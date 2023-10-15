const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
    users: require('../../model/userMaster.json'),
    setUsers: function (data) { this.users = data }
}

module.exports.findUser = async (params, conn) => {
    try {
        let result = usersDB.users.find(person => person.useremail === params.user)
        return result
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.findUserRefreshToken = async (params, conn) => {
    try {
        let result = usersDB.users.find(person => person.refreshToken === params.refreshToken)
        return result
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.RefreshUserToken = async (params, conn) => {
    try {
        const otherUsers = usersDB.users.filter(person => person.useremail !== params.user);
        const currentUser = params.currentUser;

        usersDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', '..', 'model', 'userMaster.json'),
            JSON.stringify(usersDB.users)
        );

    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports.registerUser = async (params, conn) => {
    try {
        usersDB.setUsers([...usersDB.users, params.newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', '..', 'model', 'userMaster.json'),
            JSON.stringify(usersDB.users)
        );
    } catch (e) {
        throw new Error(e.message)
    }
}