<template>
  <div>
    <div class="shopcart">
<!--      分为两部分：下面的内容-->
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount}">
              <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount}"></i>
            </div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalCount}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}} 元</div>
        </div>
        <div class="content-right">
<!--          模板来源data，props，computed，所以将其定义在计算属性中-->
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>

      <transition name="move">
        <!--      food列表-->
        <!--      此处的显示隐藏除了使用v-show还需要考虑当总数量大于0时，也要隐藏-->
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
<!--          需要滚动的是列表-->
          <div class="list-content">
            <ul>
              <li class="food" v-for="(food, index) in cartFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>

    </div>
    <transition name="fade">
      <!--    遮罩-->
      <div class="list-mask" v-show=
        "listShow" @click="toggleShow">
      </div>
    </transition>

  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import BScroll from 'better-scroll'
  import CartControl from '../CartControl/CartControl'
  import {MessageBox, Toast} from 'mint-ui' // 清空列表的提示信息
  export default {
    data () {
      return {
        isShow: false
      }
    },
    components: {CartControl},
    computed: {
      // 根据页面首先判断：需要对购物车里面的food进行更新操作（添加，减少实时跟新），所以可以将其定义在vuex里面，该页面直接获取
      // 需要读取哪些数据，根据页面显示的内容去判断：1.购物车里的食物 2.商家里面的信息：起送价，配送费
      ...mapState(['cartFoods', 'info']),
      // 总数量和总价格是基于cartFoods进行计算的：基于state里面的数据就可以完成计算的，写在计算属性里面
      ...mapGetters(['totalCount', 'totalPrice']),

      // 判断显示哪个类名
      payClass () {
        const {totalPrice} = this // 当前总价格
        const {minPrice} = this.info
        return totalPrice >= minPrice ? 'enough': 'no-enough'
      },

      // 判断显示哪一个文本
      payText () {
        const {totalPrice} = this // 当前总价格
        const {minPrice} = this.info
        if(totalPrice===0) { // 即购物车里面没有food
          return `￥${minPrice}元起送`
        } else if(totalPrice<minPrice) {
          return `还差${minPrice-totalPrice}元起送`
        } else {
          return '结算'
        }
      },

      // 打开列表有2个条件：
      // isShow为true的同时，总数量也大于0
      listShow () {
        // 如果总数量为0，直接不显示  v-show:只有为true时，才显示
        if(this.totalCount===0) {
          this.isShow = false // 一旦总数量为0，isShow就必须变为false，否则就会出错

          // 当两个条件同时满足时，才不显示列表
          return false // 不显示
        }

        // 列表显示的时候才创建BScroll
        if(this.isShow) {  // 此时总数量大于0，如果isShow的值为true的话，那列表就会显示
          this.$nextTick(() => {

            // BScroll对象为一个单例
            // 创建之前判断是否已经创建过
            if(!this.scroll) {  // 如果没有创建过，就创建
              // 需要滚动的列表是list-content

              // 创建之后保存起来
              this.scroll = new BScroll('.list-content', {
                click: true // 添加可以点击的配置
                // 创建BScroll对象之后分发click，即创建BScroll之后，点击添加按钮的回调函数是BScroll控制的，不是原生的click
                // BScroll触发了点击函数调用
              })

              // else说明BScroll对象已经存在了：即没有达到滑动的高度就显示了列表时，BSCroll对象被创建
              // 通知BScroll对象，每次显示列表的时候，刷新滚动条，看能否达到高度
            } else {
              this.scroll.refresh() // 让滚动条刷新一次：重新统计一下内容的高度，可以形成滚动的时候就可以拉动了
            }

          })
        }
        // 当两个条件同时满足时，才显示列表
        // 总数量大于0时，返回isShow此时的状态，true就显示，false就不显示
        return this.isShow
      }
    },
    methods: {
      // 切换显示隐藏
      toggleShow () {
        // 只有当总数量大于0时，才去切换显示隐藏购物列表
        // 总数量=0时，不能触发点击监听
        if(this.totalCount>0) {
          this.isShow = !this.isShow
        }

      },
      // 清空列表
      clearCart () {
        MessageBox.confirm('确认清空购物车吗？').then(
          // then里面有两个函数：1.点击确认退出，2.取消
          action => {
            //  请求清空
            // 触发action里面的函数，请求清空购物车列表，是在action中写的
            this.$store.dispatch('clearCart')
          },
          // 失败了什么也不用处理
          () => {});
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background $green
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 5px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          color #fff
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align bottom
          margin-bottom 15px
          margin-left -45px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color #fff
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background $green
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translateY(-100%) // 列表向上移动整个高度的距离，隐藏的时候回到了原始布局的位置，是0
      &.move-enter-active, &.move-leave-active
        transition transform .3s
      &.move-enter, &.move-leave-to
        transform translateY(0) // 动画最终离开的位置是0
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
