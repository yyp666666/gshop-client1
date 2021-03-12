/*
包含多个基于state的getter计算属性的对象
 */
export default {

  // 统计操作，将food，前一个累加结果作为参数传递，做累加计算，从0开始计算，最后返回一个count
  totalCount (state) {
    return state.cartFoods.reduce((preTotal, food) => preTotal + food.count, 0)
  },

  totalPrice (state) {
  return state.cartFoods.reduce((preTotal, food) => preTotal + food.count*food.price, 0)
},
  // 计算满意评价的数量
  positiveSize (state) {
    return state.ratings.reduce((preTotal, rating) => preTotal + (rating.rateType===0 ? 1:0), 0)
    }

}


