<template>
  <div>
    <v-toolbar prominent :src="require('../assets/logo.svg')">
      <v-toolbar-title class="primary--text display-1">Toduetify</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="!$auth.loading">
        <v-btn class="primary--text" text v-if="!$auth.isAuthenticated" @click="login">Log in</v-btn>
        <v-btn class="primary--text" text v-if="$auth.isAuthenticated" @click="logout">Log out</v-btn>
      </v-toolbar-title>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="primary accent-3"
      ></v-progress-linear>
    </v-toolbar>
    <v-container>
      <router-view />
    </v-container>
  </div>
</template>

<script>
export default {
  created () {
    console.log('Auth >>', this.$auth)
  },
  computed: {
    loading () {
      return this.$store.state.loading
    }
  },
  methods: {
    login () {
      let loginData = this.$auth.loginWithRedirect();
      console.log('loginData >>', loginData)
    },
    logout () {
      this.$auth.logout();
    }
  }
}
</script>
