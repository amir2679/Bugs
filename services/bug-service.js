const fs = require('fs')
const bugs = require('../data/bugs.json')
const request = require('request')
const PDFDocument = require('pdfkit');

module.exports = {
    query,
    save,
    getById,
    remove,
    createPdf,
    getUserBugs
}
const itemsPerPage = 2

function query(filterBy) {
    const { title, page } = filterBy
    const regex = new RegExp(title, 'i')
    let filteredBugs = bugs.filter(bug => regex.test(bug.title))
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    return Promise.resolve({ filteredBugs, totalPages })
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[idx] = bugToSave
    }
    else {
        bugToSave._id = _makeId()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function getUserBugs(userId) {
    const userBugs = bugs.filter(({owner}) => owner._id === userId)
    return Promise.resolve(userBugs)
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)

        fs.writeFile('./data/bugs.json', data, (err) => {
            if (err) return reject(err, 'No data file found')
            resolve()
        })
    })
}

function createPdf(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    const doc = new PDFDocument()
        doc.pipe(fs.createWriteStream('./public/bug.pdf'))
        doc
            .font('./public/fonts/lato/lato-Bold.ttf')
            .fontSize(30)
            .text(bug.title, 100, 100)
    
    
        doc
            .font('./public/fonts/lato/lato-italic.ttf')
            .fontSize(20)
            .text(bug.description, 100, 200)
        doc.end()
    // return Promise.resolve('download..')
}

// function buildBugPDF(bug, filename = 'bug.pdf') {
//     const doc = new PDFDocument()
//     doc.pipe(fs.createWriteStream(filename))
//     doc
//         .font('./public/fonts/lato/lato-Bold.ttf')
//         .fontSize(30)
//         .text(bug.title, 100, 100)


//     doc
//         .font('./public/fonts/lato/lato-italic.ttf')
//         .fontSize(20)
//         .text(bug.description, 100, 200)
//     doc.end()
// }