import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import userDetails from '../pages/user-details.cmp.js'
import userList from '../pages/user-list.cmp.js'

const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
  {path: '/bug/user/:userId' , component:userDetails},
  { path: '/user', component: userList },
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
