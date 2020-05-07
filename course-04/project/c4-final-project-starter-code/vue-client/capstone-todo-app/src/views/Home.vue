<template>
  <v-layout justify-center mt-4>
    <!-- Card Login -->
    <v-card
      v-if="!hasToken"
      dark
      elevation="0"
      width="90%"
      class="primary lighten-1"
    >
      <v-card-title>
        Welcome to <b class="mx-1 headline">Toduetify</b>
      </v-card-title>
      <v-card-subtitle>
        Login so we can start the party!
      </v-card-subtitle>
      <v-card-text>
        <v-btn class="white primary--text" @click="$auth.loginWithRedirect()">Log in</v-btn>
      </v-card-text>
    </v-card>
    <!-- end Card Login -->

    <!-- Card List -->
    <v-card
      v-else
      dark
      elevation="0"
      width="90%"
      class="primary lighten-1"
    >
      <v-card-title>
        Items
        <v-spacer></v-spacer>
        <v-btn icon dark @click="refreshList">
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
        <v-btn icon dark @click="toggleFormDialog">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-skeleton-loader
        :loading="loading"
        transition="fade-transition"
        height="90"
        light
        class="mx-auto pa-2 mb-0"
        type="list-item-two-line"
      >
        <div>
          <v-alert v-if="todues.length == 0"
            icon="mdi-plus-circle-outline"
            dark
            class="blue lighten-2 mb-0"
          >
            Create some todues!
            <v-btn
              class="ml-2"
              small
              outlined
              @click="toggleFormDialog"
            >Lets go!</v-btn>
          </v-alert>
          <template v-else>
            <v-list-item v-for="(item, idx) in todues" :key="idx">
              <v-list-item-avatar>
                <v-img
                  v-if="item.attachmentUrl"
                  :src="item.attachmentUrl + `?${Date.now()}`"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-icon v-else class="white primary--text">mdi-image-off</v-icon>
              </v-list-item-avatar>
              <v-checkbox v-model="item.done" @click="handleCheck(item)" dark readonly></v-checkbox>
              <span class="white--text pl-2">{{ item.name }}</span>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="handleEdit(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon dark @click="handleDelete(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </template>
        </div>
      </v-skeleton-loader>
    </v-card>
    <!-- end Card List -->

    <!-- Dialog -->
    <v-dialog v-model="dialog" @click:outside="resetFileState">
      <v-card>
        <v-card-title>
          Todue Form
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field v-model="form.name" label="Title" required prepend-icon="mdi-page-layout-header"></v-text-field>
            <template v-if="editing">
              <v-file-input v-model="file" accept="image/*" label="Add or update an image">
              </v-file-input>
              <div v-if="fileUrl" class="mx-0 mt-4 mb-6">
                <v-img :src="fileUrl + `?${Date.now()}`" height="100%" max-height="200" max-width="200"
                  :lazy-src="require('../assets/logo.svg')"
                  transition="fade-transition"
                >
                </v-img>
              </div>
            </template>
          </v-form>
          <v-btn
            class="primary"
            :disabled="!valid"
            @click="saveTodue"
            :loading="loading"
          >Save</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- end Dialog -->
  </v-layout>
</template>

<script>
import moment from 'moment'

window.moment = moment

export default {
  name: 'Home',
  created () {
    if (this.hasToken) {
      this.$store.dispatch('listTodues')
    }
  },
  data () {
    return {
      dialog: false,
      valid: false,
      form: {
        name: ''
      },
      file: null,
      editing: false,
      fileUrl: '',
      loading: false
    }
  },
  computed: {
    hasToken () {
      return !!this.$store.state.token
    },
    todues () {
      return this.$store.state.items || [
        {
          userId: 'dev-test',
          todueId: '123123',
          name: 'My Late Task',
          dueDate: '2020-05-03T16:34:26-03:00',
          createdAt: '2020-05-03T16:34:26-03:00',
          done: true
        },
        {
          userId: 'dev-test',
          todueId: '123123',
          name: 'My Late Task',
          dueDate: '2020-05-03T16:34:26-03:00',
          createdAt: '2020-05-03T16:34:26-03:00',
          done: true
        },
        {
          userId: 'dev-test',
          todueId: '123123',
          name: 'My Late Task',
          dueDate: '2020-05-03T16:34:26-03:00',
          createdAt: '2020-05-03T16:34:26-03:00',
          done: true
        }
      ]
    }
  },
  methods: {
    handleEdit (todue) {
      this.editing = true
      this.toggleFormDialog(todue)
    },
    async saveTodue () {
      let action = 'createTodue'
      let payload = this.form
      this.loading = true

      if (this.form && this.form.createdAt) {
        action = 'updateTodue'
        payload = { ...this.form, file: this.file }
        console.log('update payload >>', payload)
      }
      await this.$store.dispatch(action, payload)

      this.loading = false
      this.editing = false
      this.dialog = false
      this.resetFileState()
      return
    },
    resetFileState () {
      this.file = null
      this.fileUrl = null
      this.form = {}
    },
    async refreshList () {
      this.loading = true
      await this.$store.dispatch('listTodues')
      this.loading = false
    },
    async handleDelete (todue) {
      await this.$store.dispatch('deleteTodue', todue)
    },
    async handleCheck (todue) {
      await this.$store.dispatch('checkTodue', {
        ...todue,
        done: !todue.done
      })
    },
    toggleFormDialog (todue) {
      if (todue && todue.createdAt) {
        this.form = { ...todue }
      }
      else this.form = {}

      this.dialog = !this.dialog
    }
  },
   watch: {
     'form.attachmentUrl' () {
       console.log("watching >>", this.form)
       if (this.form && this.form.attachmentUrl) {
         this.fileUrl = this.form.attachmentUrl
       }
     }
   }
}
</script>
