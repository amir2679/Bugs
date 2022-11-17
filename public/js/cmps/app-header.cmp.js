'use strict'
import loginSignup from "./login-signup.cmp.js"
import { userService } from "../services/user-service.js"

export default {
    template: `
        <header>
            <h1>Miss Bug</h1>
            <section v-if="user">
                <h2 v-if="user.isAdmin">Welcome Admin</h2>
                <h2 v-else>Welcome {{user.fullname}}!</h2>
                <div class="user-actions">
                    <router-link v-if="!isDetails" :to="'/bug/user/' + user._id" @click="isDetails=true">User Details</router-link>
                    <router-link v-else :to="'/bug/'" @click="isDetails=false">Back</router-link>
                    <router-link v-if="user.isAdmin" :to="'/user/'">Users</router-link>
                </div>
                <button @click="logout">Logout</button>
            </section>
            <section v-else>
                <button @click="isLoginSignup = !isLoginSignup">Login/Sign up</button>
                <login-signup v-if="isLoginSignup" @onChangeLoginStatus="onChangeLoginStatus"/>
            </section>
        </header>
    `,
    data() {
        return {
            isLoginSignup: false,
            user: userService.getLoggedInUser(),
            isDetails: false
        }
    },
    methods: {
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                    this.$router.push('/')
                })
        },
        onChangeLoginStatus() {
            this.user = userService.getLoggedInUser()
            this.isLoginSignup = false
        }
    },
    components: {
        loginSignup
    }
}
