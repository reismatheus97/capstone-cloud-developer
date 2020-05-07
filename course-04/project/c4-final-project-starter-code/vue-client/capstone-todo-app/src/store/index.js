import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import * as repository from '../api/todues-api'

import { getInstance } from "../auth";

const authService = getInstance;

Vue.use(Vuex)

const state = {
  items: [],
  loading: false,
  token: null
}

const actions = {
  async createTodue ({ state, commit, dispatch }, todue) {
    let userToken = state.token
    try {
      commit('SET_LOADING', true)
      await repository.createTodue(userToken, {
        name: todue.name,
        dueDate: moment().format("YYYY-MM-DD HH:mm")
      })
    } catch (error) {
      console.log(error)
    } finally {
      commit('SET_LOADING', false)
      dispatch('listTodues')
    }
  },
  async listTodues ({ state, commit }) {
    let userToken = state.token
    let items = []
    try {
      commit('SET_LOADING', true)
      items = await repository.getTodues(userToken)
    } catch (error) {
      console.log(error)
      items = []
    } finally {
      commit('SET_LOADING', false)
    }

    commit('SET_TODUES', items)
  },
  async checkTodue ({ state, commit, dispatch }, todue) {
    let userToken = state.token
    try {
      commit('SET_LOADING', true)
      await repository.patchTodue(userToken, todue)
    } catch (error) {
      console.log(error)
    } finally {
      commit('SET_LOADING', false)
      dispatch('listTodues')
    }
  },
  async deleteTodue ({ state, commit, dispatch }, todue) {
    let userToken = state.token
    try {
      commit('SET_LOADING', true)
      await repository.deleteTodue(userToken, todue.todueId)
    } catch (error) {
      console.log(error)
    } finally {
      commit('SET_LOADING', false)
      dispatch('listTodues')
    }
  },
  async updateTodue ({ state, commit, dispatch }, todue) {
    let userToken = state.token
    try {
      commit('SET_LOADING', true)
      let file = todue.file

      if (file) {
        // Add image to S3 and trigger notification lambda that uploads DyDB
        let uploadUrl = await repository.getUploadUrl(userToken, todue.todueId)
        await repository.uploadFile(uploadUrl, file)
        delete todue.file
      }

      // Upload Todue, without image
      await repository.patchTodue(userToken, todue)
    } catch (error) {
      console.log(error)
    } finally {
      commit('SET_LOADING', false)
      dispatch('listTodues')
    }
  },
  async getUploadUrl ({ state }, todueId) {
    let userToken = state.token
    let uploadUrl = ''

    try {
      uploadUrl = await repository.getUploadUrl(userToken, todueId)
      await repository.uploadFile(uploadUrl, this.state.file)
    } catch (error) {
      console.log(error)
      uploadUrl = ''
    }

    return uploadUrl
  },
  async setToken ({ commit }) {
    console.log('Trying to get token...')
    let userToken = await authService().getTokenSilently();
    commit('SET_TOKEN', userToken)
  }
}

const mutations = {
  SET_TODUES (state, items) {
    state.items = items
  },
  SET_LOADING (state, value) {
    state.loading = value
  },
  SET_TOKEN (state, value) {
    state.token = value
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
