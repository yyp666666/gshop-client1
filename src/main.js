/*
入口JS
 */
/*
当路由器配置完成之后多个两个方面：
1.组件标签
router-link：相当于a标签，跳转页面
router-view
keep-alive:缓存路由组件
2.多了两个属性可以访问
所有的组件都可以这两个属性
$route：当前路由
$router：路由器对象
 */
import Vue from 'vue'
import { Button } from 'mint-ui'  // Button:在入口js中进行引入，可以注册为全局组件
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload' // 图片懒加载

// import 后面写的对象是其他的组件向外暴露的对象，而mockjs并没有向外暴露任何东西
import './mock/mockServer'  // 加载mockjs即可
import './filters' // 日期过滤器也是只需要进行加载即可 加载之后过滤器dateFormat就可以被使用了

import loading from './common/imgs/loading.gif'  // 图片加载显示的图片
// 注册全局组件标签
Vue.component(Button.name, Button)  // 此时Button标签就可以使用了：<mt-button>

// 图片懒加载
Vue.use(VueLazyload, { // 声明使用之后：内部自定义一个指令lazy，使用的时候将需要的地方换为v-lazy：food中使用
  loading  // 加载中显示一个什么效果的图片，
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,  // 使用上vue-router
  store  // 使用上vuex，每个组件都产生了$store
})
