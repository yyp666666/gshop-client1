/*
入口JS
 */
/*
当路由器配置完成之后多个两个方面：
1.组件标签
router-link
router-view
keep-alive:缓存路由组件
2.多了两个属性可以访问
$route
$router
 */
import Vue from 'vue'
import App from './App'
import router from "./router"

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
