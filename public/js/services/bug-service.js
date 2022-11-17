export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    createPdf,
    getUserBugs
}

const BASE_URL = `/api/bug/`
// http://127.0.0.1:3031/api/bug


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => {
        return res.data
    })
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}
function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    // console.log(userId)
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
    }
    else {
        return axios.post(BASE_URL, bug).then((res) => res.data)
    }
}

function getUserBugs(userId) {
    return axios.get(BASE_URL + `user/${userId}`, { params: userId }).then(res => {
        return res.data
    })
}

function getEmptyBug() {
    return {
        _id: '',
        title: '',
        description: '',
        severity: 3,
        createdAt: 1542107359454
    }
}

function createPdf(bugId) {
    return axios.get(BASE_URL + 'download/' + bugId).then(res => {
        return res.data
    })
}