
const KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

const BASE_URL = '/api/auth/'

export const userService = {
    getLoggedInUser,
    login,
    logout,
    signup,
    getUsers,
    remove
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}


function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password })
        .then((res) => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}


function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

function getUsers() {
    return axios.get('/api/user')
        .then(res => res.data)
        .then(users => {
            return users
        })
}

function remove(userId) {
    return axios.delete('/api/user/' + userId).then(res => res.data)
}