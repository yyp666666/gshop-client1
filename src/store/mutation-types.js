/*
包含多个mutation的type名称常量
Ctrl + Shift + U：光标所在位置大小写转换
 */
// 这3个数据就是用于从后台接收返回的数据
export const RECEIVE_ADDRESS = 'receive_address' // 接收地址
export const RECEIVE_CATEGORYS = 'receive_categorys' // 接收食品分类数组
export const RECEIVE_SHOPS = 'receive_shops' // 接收商家数组
export const RECEIVE_USER_INFO = 'receive_user_info' // 接收用户信息
export const RESET_USER_INFO = 'reset_user_info' // 重置用户信息
// 模拟数据
export const RECEIVE_GOODS = 'receive_goods' // 接收商家列表
export const RECEIVE_RATINGS = 'receive_ratings' // 接收商家评价列表
export const RECEIVE_INFO = 'receive_info' // 接收商家信息

// 更新count
export const INCREMENT_FOOD_COUNT = 'increment_food_count' // 增加food中的count
export const DECREMENT_FOOD_COUNT = 'decrement_food_count' // 减少food中的count

// 清空购物车
export const CLEAR_CART = 'clear_cart' // 清空购物车

// 用于接收从后台返回的搜索商家列表
export const RECEIVE_SEARCH_SHOPS = 'receive_search_shops' // 接收地址
