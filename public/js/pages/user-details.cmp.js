import { userService } from "../services/user-service.js"
import { bugService } from "../services/bug-service.js"

import bugList from "../cmps/bug-list.cmp.js"

export default {
    template:`
        <section>
            <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        </section>
    `,
    data() {
        return {
            user: userService.getLoggedInUser(),
            bugs: null
        }
    },
    created() {
        bugService.getUserBugs(this.user._id)
            .then(bugs => {
                this.bugs = bugs
            })
    },
    methods: {
        removeBug(bugId) {
            this.$emit('removeBug', bugId)
        }
    },
    components: {
        bugList
    }
}