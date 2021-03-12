/*
包含n个接口请求函数的模块：向外暴露n个函数
函数的返回值：promise对象

所有的接口请求函数的名称开头都带有req
 */
import ajax from './ajax'
const BASE_URL = '/api'  // 发送ajax请求时配置代理，解决跨域问题，使用api需要代理的匹配拦截
// [1、根据经纬度获取位置详情] :需要传参，经纬度在发生变化,
// 参数类型为param，使用$,此时需使用``,如果不是param参数，使用单引号
export const reqAddress = (geohash) => ajax(`${BASE_URL}/position/${geohash}`)

// [2、获取食品分类列表]  无需传参
export const reqCategorys = () => ajax(BASE_URL+'index_category')

// [3、根据经纬度获取商铺列表]
export const reqShops = (longitude, latitude) => ajax(BASE_URL+'/shops', {longitude, latitude})

// [4、根据经纬度和关键字搜索商铺列表]
export const reqSearchShop = (geohash, keyword) => ajax(BASE_URL+'search_shops', {geohash, keyword})

// [5、获取一次性验证码]
export const reqCaptcha = () => ajax(BASE_URL+'/captcha')

// [6、用户名密码登陆]          当参数的数量比较多时，顺序的不同可能会有影响，将其写为对象形式
export const reqPwdLogin = ({name, pwd, captcha}) => ajax(BASE_URL+'/login_pwd', {name, pwd, captcha}, 'POST')

// [7、发送短信验证码]
export const reqSendcode = (phone) => ajax(BASE_URL+'/sendcode', {phone})

// [8、手机号验证码登陆]
export const reqSmsLogin = (phone, code) => ajax(BASE_URL+'/login_sms', {phone, code}, 'POST')

// [9、根据会话获取用户信息]  会话：session，关闭浏览器，会话关闭，会话的依赖是cookie：可以写保持会话的时间
export const reqUserInfo = () => ajax(BASE_URL+'/userinfo')

// [10、用户登出]
export const reqLogout = () => ajax(BASE_URL+'/logout')

/*
下面三个接口函数是mock数据，不用api
 */
// 获取商家信息
export const reqShopInfo = () => ajax('/info')

// 获取商家评价数组
export const reqShopRatings = () => ajax('/ratings')

// 获取商家信息
export const reqShopGoods = () => ajax('/goods')
