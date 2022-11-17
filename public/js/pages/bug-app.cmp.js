'use strict'
import { bugService } from '../services/bug-service.js'
import { eventBus } from '../services/eventBus-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link>
        </div>
        <h3>Total Pages: {{totalPages}}</h3>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <span>Page: {{this.filterBy.page}}</span>
        <div class="pagination">
          <button :disabled="isFirstPage || isSinglePage" @click="setPage(-1)">&#8592;</button>
          <button :disabled="isLastPage || isSinglePage" @click="setPage(1)">&#8594;</button>
        </div>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0
      },
      totalPages: 0,
      isSinglePage: false
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ filteredBugs, totalPages }) => {
        this.bugs = filteredBugs
        this.totalPages = totalPages
        console.log(totalPages)
        totalPages > 0 ? this.isSinglePage = false : this.isSinglePage = true
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      console.log(this.filterBy)
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId)
        .then(() => this.loadBugs())
        .catch(({response:{data}}) => {
          eventBus.emit('show-msg', { txt: data, type: 'error' })
        })
    },
    setPage(dif) {
      this.filterBy.page += dif
      this.loadBugs()
    }
  },
  computed: {
    bugsToDisplay() {
      if (!this.filterBy?.title.trim()) return this.bugs
      const regex = new RegExp(this.filterBy.title, 'i')
      return this.bugs.filter(bug => regex.test(bug.title))
    },
    isFirstPage() {
      return (this.filterBy.page === 0) ? true : false
    },
    isLastPage() {
      return (this.filterBy.page === this.totalPages - 1) ? true : false
    },
    // getSinglePage() {
    //   return {false : this.isSinglePage}
    // }
  },
  components: {
    bugList,
    bugFilter,
  },
}
