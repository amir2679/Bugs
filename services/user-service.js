const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-puk-1234')

const users = require('../data/user.json')

module.exports = {
    query,
    getById,
    remove,
    save,
    checkLogin,
    getLoginToken,
    validateToken,
    getUsers
}

function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('Unknown user')
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx < 0) return Promise.reject('Unknown user')
    users.splice(idx, 1)

    return _saveUsersToFile()
}

function save(user) {
    if (user._id) {
        const idx = user.find(currUser => user._id === currUser._id)
        users[idx] = user
    }
    else {
        user._id = _makeId()
        users.push(user)
    }
    return _saveUsersToFile().then(() => ({ _id: user._id, fullname: user.fullname }))
}

function checkLogin({ username, password }) {
    let user = users.find(user => user.username === username && user.password === password)
    if (!user) return Promise.reject('Unknown User')
    else {
        user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
        return Promise.resolve(user)
    }
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function getUsers() {
    return Promise.resolve(users.map(({ _id, fullname, isAdmin }) => {
        return { _id, fullname, isAdmin }
    }))
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    users.splice(idx, 1)
    return _saveUsersToFile()
}



function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function _saveUsersToFile() {
    console.log('hi');
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)

        fs.writeFile('data/user.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}