<template>
  <div id="app">
<!--    App的主页显示分为两层：上面的路由和下面的导航-->
<!--    用于渲染当前点击到的组件，点击哪一个，哪一个就在App中进行显示-->
    <router-view></router-view>
<!--    在需要显示的路由配置中添加配置属性meta，当为true时显示-->
    <FooterGuide v-show="$route.meta.showFooter"/>
  </div>
</template>

<script>
import FooterGuide from './components/FooterGuide/FooterGuide'
import {mapActions} from 'vuex'
import {reqFoodTypes} from './api'  // 引入接口进行测试

export default {

  // 测试接口能否获取数据，需要引入接口
  /*async mounted () {
    const result = await reqFoodTypes()
    console.log(result)
  },*/

  // 测试vuex中action与后台发送请求是否成功
  mounted () {
    this.$store.dispatch('getAddress')  // 触发action中的函数
      // 更新函数,更新函数之后address就是我们需要的数据，然后在每一个组件里面都可以看到address
    // 而在Msite中只需要显示address.name

    this.getUserInfo()  // 使用map时进行函数调用
  },
  methods: {
    ...mapActions(['getUserInfo'])
  },
  components: {FooterGuide}
}



</script >

<style lang="stylus" rel="stylesheet/stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
