/*
vuex最核心的管理对象store:管理所有从后台获取的数据
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)
// 向外暴露一个store对象
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})
