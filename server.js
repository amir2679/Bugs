const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('../missBug/services/bug-service')
const userService = require('../missBug/services/user-service')

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello!'))
// app.get('/test', (req, res) => res.send('Test Works'))

//GET BUGS
app.get('/api/bug', (req, res) => {
    const { title, page } = req.query
    const filterBy = {
        title: title || '',
        page: +page || 0
    }
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })

})
//GET BUG
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then((bug) => {
            var visitedBugs = req.cookies.visitedBugs || []
            if (!visitedBugs.includes(bug._id)) visitedBugs.push(bug._id)
            res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
            if (visitedBugs.length <= 3) res.send(bug)
            else return res.status(401).send('Wait for a bit')
        })
})

app.get('/api/bug/download/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.createPdf(bugId)
    // .then((answer) => {
    // console.log(answer)
    res.end()
    // })
})

//ADD
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const { title, severity } = req.body
    const createdAt = Date.now()
    const bug = {
        title,
        severity,
        createdAt,
        description: 'New bug',
        owner: loggedinUser
    }
    bugService.save(bug)
        .then((savedBug) => {
            res.send(savedBug)
        })
})
//UPDATE
app.put('/api/bug/:bugId', (req, res) => {
    const { title, severity, _id, createdAt, description, owner } = req.body
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    userService.getById(loggedinUser._id).then(({ isAdmin }) => {
        if (isAdmin || owner._id === loggedinUser._id) {
            const bug = {
                title,
                severity,
                _id,
                description,
                createdAt,
                owner
            }
            bugService.save(bug)
                .then((savedBug) => {
                    res.send(savedBug)
                })
        }
        else return res.status(401).send('Not your bug')
    })
})

//DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    bugService.getById(bugId).then(({ owner }) => {
        userService.getById(loggedinUser._id).then(({ isAdmin }) => {
            if (isAdmin || owner._id === loggedinUser._id) {
                bugService.remove(bugId)
                    .then(() => {
                        res.send('Removed!')
                    })
            }
            else return res.status(401).send('Not your bug')
        })
    })
})

//LOGIN
app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => {
            res.status(401).send('Invalid login')
        })
})

//SIGNUP
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

app.get('/api/bug/user/:userId', (req, res) => {
    const { userId } = req.params
    // console.log(req.params);
    bugService.getUserBugs(userId)
        .then(bugs => {
            res.send(bugs)
        })
})
//GET USERS
app.get('/api/user', (req, res) => {
    userService.getUsers()
        .then(users => {
            res.send(users)
        })
})
//DELETE USER
app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
            bugService.getUserBugs(userId)
                .then(bugs => {
                    const loggedinUser = userService.validateToken(req.cookies.loginToken)
                    if(bugs.length || !loggedinUser.isAdmin) res.status(401).send('Unauthorized')
                    else {
                        userService.remove(userId)
                        .then(() => {
                            res.send('user deleted!')
                        })
                    }
                })
})
// const PORT = 3031

// app.listen(PORT, '127.0.0.1')
// console.log(`Server running at: /http://127.0.0.1:${PORT}`)

const PORT = process.env.PORT || 3031
app.listen(PORT, () => console.log(`Server running at: /http://127.0.0.1:${PORT}`))
