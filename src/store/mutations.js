/*
直接更新state的多个方法的对象
 */
import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART
} from './mutation-types'
export default {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address   // 对address进行更新
  },
  [RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },
  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  },
  [RECEIVE_USER_INFO] (state, {userInfo}) {
    state.userInfo = userInfo
  },
  [RESET_USER_INFO] (state) {
    state.userInfo = {}
  },

  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_INFO](state, {info})
    {
      state.info = info
    },

  // 同步更新食品的count属性
  [INCREMENT_FOOD_COUNT](state, {food}) {
    // food里面开始的时候是没有count存在的，即当第一次添加该食物的count时，需要判断
    if(!food.count) { // 当点击add，第一次增加，food里面没有count值时，就将其初始值置为1
      // 使用此方法只是更新了goods中的count，但是页面并没有显示，即没有数据绑定：将后台内存中的数据显示在页面中
      // food.count = 1 // 新增属性没有值时，将其初始值置为1

      /*
      对象：为哪一个对象添加属性
      属性名： 添加什么属性,属性名为字符串类型
      属性值：属性的初始值为多少
       */
      // 该方法能够保证让新增的属性也有数据绑定
      Vue.set(food, 'count', 1) // set用于给有数据绑定的对象添加属性的

      // 第一次点击添加按钮的时候，才会将food增加到cartFoods中，之后就直接更改count
      // 两个引用变量，指向同一个对象，通过一个变量（count）改变对象（food）内部的数据，其他的引用变量也能看见
      // 两个引用变量指向同一个对象，让一个引用变量指向另一个对象，另一个引用变量还是指向原来的对象
      state.cartFoods.push(food) // 当以后再次点击增加的时候，food里面的count就会改变
    } else {          // 后面count已经有值了，就执行+1
      food.count++  // 当该处food里面的count+1，那么cartFoods里面的food也会变化，是同一个food
    }
  },

// 执行减少操作：只有当count有值时，减少按钮才会出现，所以此时，只需要执行减减操作，不需要判断
  [DECREMENT_FOOD_COUNT](state, {food}) {
    if(food.count>0) {  // 保证count的值不是负数
      food.count--

      // 当执行减少操作时，直接--就可以了，cartFoods是可以知道count的变化的
      // 但是当count为0时，需要将该food购物车里面删除

      if(food.count===0) { // 当前food的count值为0时，使用indexOf遍历到当前food的索引值，再使用splice将其删除
        // splice添加或删除数组中的元素，参数必须为索引值
        // indexOf该方法用于返回某个字符串值(food)在cartFoods数组中的索引值
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    }
  },

  // 清空购物车
  [CLEAR_CART](state) {

    // 首先清除被清空的food中的count，
    // 如何将所有的food里面的count都置为0？没有加入购物车的food里面根本是没有count属性的
    // 所以只需遍历购物车里面的food将count置为0就可以了，
    // cartFoods里面存放的是count大于0的food
    state.cartFoods.forEach((food) => food.count = 0)
    // 将其置为0之后，cartFoods里面存放的就是count为0的food
    // 只要count为0了，就需要将其从购物车里面移除

    // 移除购物车中所有购物项
    // 这样写之后购物车里面的列表没有了，但是food（里面的count）还存在
    state.cartFoods = [] // 这样写是让cartFoods直接指向一个新的数组，购物列表消失
    // 但是数组里面的对象food并没有消失，它还被其他的对象所引用着，如果消失了，goods里面的列表也无法显示，现在只是让cartFoods指向新的
    // 数组，跟food对象没有任何关系，所以需要首先将food处理一下
    // 这样写之后虽然列表被清空了，但是food（里面的count）还存在，food对象被好多个数组引用
    // 即food被foods引用，被cartFoods引用
  }

  }
