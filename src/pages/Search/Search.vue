<template>
  <section class="search">
    <HeaderTop title="搜索"></HeaderTop>
<!--    submit默认行为是提交表单，这里不需要它提交表单，只需要执行search方法-->
    <form class="search_form" @submit.prevent="search">
      <input type="search" placeholder="请输入商家名称" class="search_input" v-model="keyword">
      <input type="submit" class="search_submit">
    </form>

<!--   -->
<!--    1.初始没有搜索时，遍历列表，2.有搜索结果，就显示列表-->
    <section class="list" v-if="searchShopsShow">
      <ul class="list_container">
<!--        tag="li"：生成列表效果，专门用于形成一个带列表的路由路径-->
<!--        router-link默认状态生成一a标签，但是tag：li,现在生成了一个li标签，query参数，带动态参数的-->
<!--        点击以后跳转到shop页面-->
<!--        这里将to包装成了一个对象，也可以使用字符串来写：to="'/shop?id='+item.id"-->
        <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li"
                     v-for="item in searchShops" :key="item.id" class="list_li">
          <section class="item_left">
            <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p><span>{{ item.name }}</span></p>
              <p>月售 {{ item.month_sales || item.recent_order_num }} 单</p>
              <p>{{ item.delivery_fee || item.float_minimum_order_amount }} 元起送 / 距离 {{ item.distance }}</p></div>
          </section>
        </router-link>
      </ul>
      <ul class="list_container">
        <li class="list_li" v-for="(searchShop, index) in searchShops" :key="index">
          <section class="item_left">
            <img :src="searchShop.image_path" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p><span>{{searchShop.name}}</span></p>
              <p>月售 {{searchShop.recent_order_num}} 单</p>
              <p>{{searchShop.float_minimum_order_amount}} 元起送 / 距离 {{searchShop.distance}} 公里</p>
            </div>
          </section>
        </li>

      </ul>
    </section>
<!--    没有搜索结果，才显示该内容-->
    <div class="search_none" v-else>很抱歉！无搜索结果</div>

  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        keyword: '',  // 动态数据，存入data，div数据的来源：1.data  2.computed  3.props
        imgBaseUrl: 'http://cangdu.org:8001/img/',
        searchShopsShow: true  // 此时使用一个标识来标识到底有没有搜索到商品
        // 为true的两种情况
        // 1.页面刚开始时，没有进行任何操作，但是也不能显示没有搜索到商品，应该让他进行if里面，遍历空列表
        // 2.搜索到了结果

      }
    },
    components: {HeaderTop},
    computed: {
      ...mapState(['searchShops']) // 读取searchShops，显示在页面中
    },
    methods: {
      search () {
        // 得到搜索关键字
        const keyword = this.keyword.trim() // 去掉空格
        // 进行搜索
        if(keyword) { // 有数据进行搜索，无数据什么也不做
          this.$store.dispatch('searchShops', keyword)
          // 点击提交就会触发该函数，进行搜索，搜索之后更新searchShops，然后组件进行读取
        }
      }
   },
    watch: { // 监视searchShops的变化：searchShops首先是一个空数组，当输入内容之后，点击提交按钮，异步从后台获取数据
            // 如果searchShops里面有内容：noSearchShops: false ，如果没有搜索到，将其置为true，标识没有搜索到结果
      searchShops (value) { // 对该数据进行监视，开始时没有数据，如果有变化了，监视到了
        if(!value.length) { // 此时传来的数组内依然没有数据
          this.searchShopsShow = false  // false没有搜索到结果
        } else { // 有数据了，显示数据
          this.searchShopsShow = true // 不是空的
        }
      }
    }
  }


</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    height 100%
    overflow hidden
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

    .list
      .list_container
        background-color: #fff;
        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;
          .item_left
            margin-right: 10px
            .restaurant_img
              width 50px
              height 50px
              display block
          .item_right
            font-size 12px
            flex 1
            .item_right_text
              p
                line-height 12px
                margin-bottom 6px
                &:last-child
                  margin-bottom 0
    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem
</style>
