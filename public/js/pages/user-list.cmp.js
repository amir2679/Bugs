import userPreview from '../cmps/user-preview.cmp.js'

import { userService } from '../services/user-service.js'
import { eventBus } from '../services/eventBus-service.js'

export default {
  template: `
      <section v-if="users" className="user-list">                    
        <user-preview v-for="user in users" :user="user" :key="user._id" @remove="remove"/>
      </section>
      `,
  data() {
    return {
      users: null
    }
  },
  created() {
    userService.getUsers().then(users => {
      this.users = users
    })
  },
  methods: {
    remove(userId) {
      userService.remove(userId)
        .then((res) => {
          userService.getUsers()
            .then(users => {
              this.users = users
              eventBus.emit('show-msg', { txt: res, type: 'success' })
            })
        })
        .catch(({ response: { data } }) => {
          eventBus.emit('show-msg', { txt: data, type: 'error' })
        })
    }
  },
  components: {
    userPreview,
  },
}