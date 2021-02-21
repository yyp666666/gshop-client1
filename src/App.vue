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
export default {
  components: {FooterGuide}
}


</script >

<style lang="stylus" rel="stylesheet/stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
