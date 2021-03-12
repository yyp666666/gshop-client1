<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop :title=address.name>
      <router-link class="header_search" slot="left" to="/search">
            <i class="iconfont iconsousuo"></i>
      </router-link>
<!--      根据id去判断是否登录,没有登录的时候点击进入login，登录完成就进入userinfo-->
      <router-link class="header_login" slot="right" :to="userInfo._id ? '/userinfo':'/login'">
<!--        没有登录，即id的值为空时，显示登录/注册-->
            <span class="header_login_text" v-if="!userInfo._id">
              登录|注册
            </span>
            <span class="header_login_text" v-else>
              <i class="iconfont iconicon_person"></i>
            </span>

      </router-link>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
<!--      容器里面包含两个部分：每一页的轮播和点分页器-->

      <!--        只有当数组中有数据时才会显示，没有数据时，显示svg-->
      <div class="swiper-container" v-if="categorys.length>0">

        <div class="swiper-wrapper">

<!--          对所有页数（二维数组）进行遍历，遍历得到的是每一页（每一个数组），即有多少页-->
          <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">

<!--            对每一页（每一个数组）进行遍历,遍历得到的是每一页里面的8个食品分类-->
            <a href="javascript:" class="link_to_food" v-for="(category, index) in categorys" :key="index">
              <div class="food_container">
<!--          该处的图片是变化的，基础地址已经存入data，然后去查看ajax请求返回的浏览器显示的变量-->

                <img :src="baseImageUrl + category.image_url">
              </div>
              <span>甜品饮品</span>
            </a>
          </div>

        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>

<!--      没有数据时，显示svg-->
      <img src="./images/msite_back.svg" alt="back" v-else>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList/>
    </div>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import ShopList from '../../components/ShopList/ShopList'
  export default {
    data () {  // 图片的地址是动态的，所以我们从最终写好的文档中去出查看图片的基础地址，将其存放data中，模板div就可以查看到
      return {
        baseImageUrl: 'http://fuss10.elemecdn.com'
      }

    },
    mounted () {

      // 触发action，获取食品列表数据
      this.$store.dispatch('getCategorys')
      this.$store.dispatch('getShops')
      // 触发完成之后从state中读取数据(有两种方式可以读取)

    },
    computed: {
      ...mapState(['address', 'categorys', 'shops', 'userInfo']),

      // 目前我们有一维数组categorys（一页为1个小数组，最大个数是8），
      // 而我们需要的是存放每一页的二维数组categorysArr,需要计算生成
      categorysArr () {    // 最终需要得到的二维数组
        const {categorys} = this // 先将一维数组取出

        // 准备空的2维数组
        const arr = []   // 先准备空的，然后想办法将所有的一维数组封装进去

        // 先准备空的小数组，将遍历到的每一个食品分类放进这些小数组里面，最多放8个
        let minArr = []
        // 遍历我们拥有的categorys（查看API文档可以发现，每一个categorys里面可能拥有n个食品分类），得到每一个食品分类
        categorys.forEach(c => {  // c表示每一个食品分类

          if (minArr.length === 8) {  // 当每一个小数组里面的食品分类达到8个时，就创建一个新的小数组，用于继续存放后续的
            minArr = []
          }
          // 如果minArr是空的，将小数组保存到大数组中
          if (minArr.length === 0) {
            arr.push(minArr)
          }
          minArr.push(c)  // 将c放进小数组时，需要保证该小数组已经与大数组arr建立关联，即已经放入大数组
        })

        return arr  // 最终返回大数组
      }
    },

    // 只有
    // 此时需要深度监视categorys，只有categorys中有数据时，轮播图才能够被创建
    watch: {   // 监视图片的更新，在图片更新之后就立即创建swiper
      categorys (value) {  // 回调函数，categorys数组中有数据了，在异步更新界面之前执行

        // 监视数据更新之后就会导致界面更新，界面更新之后立即创建Swiper对象
        this.$nextTick(() => {  // 一旦完成界面更新，立即调用  ，此条语句必须写在数据更新之后
          // 创建一个swiper实例对象，来实现轮播
          // 传递参数：1.传递容器 2.传递配置对象:需要什么属性就添加什么属性
          new Swiper('.swiper-container', {
            loop: true,   // 可以循环轮播
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
          })
        })
      }
    },
    components: {HeaderTop, ShopList}

  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
