'use strict'
import { bugService } from '../services/bug-service.js'


export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link :to="'/bug/edit/' + bug._id"> Edit</router-link>
                  <a @click="createPdf" href="#" class="download" download>Download</a>
                  <!-- <a @click="createPdf" :href="getPdfUrl" download>Download</a> -->
                  <!-- <button @click="createPdf">Download</button> -->
                </div>
                <button @click="onRemove(bug._id)">X</button>
              </article>`,
  data() {
    return {
      isReady: false,
      pdfUrl: ''
    }
  },
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
    createPdf() {
      bugService.createPdf(this.bug._id)
      .then(() => {
        const elA = document.querySelector('.download')
        elA.href = '../bug.pdf'
        // this.isReady = true
        // this.pdfUrl = '../bug.pdf'
      })
    }
  },
  computed: {
    getPdfUrl() {
      return this.pdfUrl
    }
  }
}
