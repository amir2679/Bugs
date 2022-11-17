import { userService } from '../services/user-service.js'

export default {
  props: ['user'],
  template: `<article className="user-preview">
                  <h4 :class="isAdmin">{{user.fullname}}</h4>
                  <!-- <h4 v-if="user.isAdmin">Admin</h4> -->
                  <img src="../pics/img_avatar.png" alt="" />
                  <button @click="onRemove(user._id)">X</button>
                </article>`,

  computed: {
    isAdmin() {
      return { success: this.user.isAdmin }
    }
  },
  methods: {
    onRemove(userId){
      this.$emit('remove', userId)
    }
  },
}