/*
通过motations间接更新state的多个方法的对象
异步：需要与后台交互
同步：不需要与后台交互
 */
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  RECEIVE_GOODS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation-types'
// 引入3个API接口
import {
  reqAddress,
  reqCategorys,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings,
  reqSearchShop
} from '../api'
export default {

  // 哪一个组件里面需要这些数据，只需要使用$store调用这些action就可以了，可以在App中完成测试

  // 有3个能够跟后台交互的异步action
  // 异步获取地址
  async getAddress ({commit, state}) {
    // 发送异步ajax请求

    const geohash = state.latitude + ',' + state.longitude
    // 调用reqAddress接口时，它需要参数，所以此时将经纬度最初的数据传递给接口，此时的经纬度在state中

    const result = await reqAddress(geohash)   // 现在已经可以发送请求了
    // 发送请求之后，得到返回的数据，即获取promise对象，可以使用promise.then来接收，也可以使用async.await

    // 得到一个结果，结果的形态可以查看API接口文档，根据结果提交一个mutation
    if (result.code === 0) {
      const address = result.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },

  // 异步获取食品分类列表
  async getCategorys ({commit}) {
    // 发送异步ajax请求

    // 调用reqCategorys接口时
    const result = await reqCategorys()   // 现在已经可以发送请求了
    // 发送请求之后，得到返回的数据，即获取promise对象，可以使用promise.then来接收，也可以使用async.await

    // 得到一个结果，结果的形态可以查看API接口文档，根据结果提交一个mutation
    if (result.code === 0) {
      const categorys = result.data
      commit(RECEIVE_CATEGORYS, {categorys})
    }
  },
  // 异步获取商家列表
  async getShops ({commit, state}) {
    // 发送异步ajax请求

    const {longitude, latitude} = state
    // 调用reqShops接口时，它需要参数，所以此时将经纬度传递给接口，此时的经纬度在state中

    const result = await reqShops(longitude, latitude)   // 现在已经可以发送请求了
    // 发送请求之后，得到返回的数据，即获取promise对象，可以使用promise.then来接收，也可以使用async.await

    // 得到一个结果，结果的形态可以查看API接口文档，根据结果提交一个mutation
    if (result.code === 0) {
      const shops = result.data
      commit(RECEIVE_SHOPS, {shops})
    }
  },

  // 异步获取搜索到的商家列表
  async searchShops ({commit, state}, keyword) {
    // 发送异步ajax请求
    const geohash = state.latitude + ',' + state.longitude
    // 调用reqSearchShop接口时，它需要参数，所以此时将经纬度传递给接口，此时的经纬度在state中

    // 而keyword确是最初是在组件里面获取的，所以需要从组件中传递过来
    const result = await reqSearchShop(geohash, keyword)   // 现在已经可以发送请求了
    // 发送请求之后，得到返回的数据，即获取promise对象，可以使用promise.then来接收，也可以使用async.await

    // 得到一个结果，结果的形态可以查看API接口文档，根据结果提交一个mutation
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS, {searchShops})
    }
  },

  // 同步记录用户信息
  recordUser ({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
  },

  // 该函数需要在应用一打开就开始调用，所以在App中进行触发
  // 已经登录之后，在一段时间内免登录，异步获取用户信息
  async getUserInfo ({commit}) {
    const result = await reqUserInfo()   // 调用接口函数，获取用户信息,一天内登录过的，都可以获取
    if(result.code===0) {  // 如果获取成功，则已经登录完成，就可以获取到上次登录时的用户信息，存入userInfo
      const userInfo = result.data  // 从里面将data取出
      commit(RECEIVE_USER_INFO, {userInfo})
    }
  },

  // 异步请求退出登录
  async logout ({commit}) {
    const result = await reqLogout()   // 调用接口函数，退出登录
    if(result.code===0) {
      commit(RESET_USER_INFO)
    }
  },

// 异步获取商家信息
  async getShopInfo ({commit}) {
    const result = await reqShopInfo()   // 调用接口函数
    if(result.code===0) {
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  },

  // 异步获取商家评价列表
  async getShopRatings ({commit}, callback) {
    const result = await reqShopRatings()   // 调用接口函数
    if(result.code===0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})

      callback && callback()
    }
  },

  // 异步获取商家列表
  async getShopGoods ({commit}, callback) {  // 接收箭头函数，接收之后，通知该函数数据更新了，可以执行了
    const result = await reqShopGoods()   // 调用接口函数
    if(result.code===0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods}) // 在此处数据已经更新了

      // 数据更新了，这个地方想自己去通知一下组件
      callback && callback()   // 可传可不传
      // &&如果前面为假就不会执行后面的函数了，即前面有值时，才执行后面的函数
      // 也有可能不会传递函数，因为如果需要知道接收通知，就会传递，如果不需要（使用watch），就不会传递
    }
  },

  // 同步更新食品的count属性：不需要与后台进行交互，同步操作
  // 接收两个参数，需要接收一个对象
  updateFoodCount ({commit}, {isAdd, food}) {
    // 该函数最终需要做的就是去mutation中去更新count的一个操作，增加或者减少，所以mutation中需要有两个接收方法
    if(isAdd) {
      commit(INCREMENT_FOOD_COUNT, {food})
    } else {
      commit(DECREMENT_FOOD_COUNT, {food})
    }

  },

  // 同步（不需要与后台交互）请求清空购物车列表
  clearCart ({commit}) {
    commit(CLEAR_CART)
  }
}
