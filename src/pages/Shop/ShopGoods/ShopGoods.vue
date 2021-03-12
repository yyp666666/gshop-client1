<template>
  <div>
    <div class="goods">
<!--      整体为左右结构：左边菜单列表-->
      <div class="menu-wrapper" >
        <ul>
<!--          左边菜单栏为上下结构:点击监听时，将目前点击的index传递下去-->
          <li class="menu-item" v-for="(good, index) in goods" :key="index"
              :class="{current: index===currentIndex}" @click="clickMenuItem(index)">
<!--            当目前遍历得到的good的索引值等于计算属性返回的索引值时，就会出现current类-->
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>

<!--      右边食物列表-->
      <div class="foods-wrapper">
        <ul ref="foodsUl">
<!--          右边首先遍历goods：得到每一个good-->
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>

<!--            遍历得到good之后再次遍历foods，得到里面的每一个food-->
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods"
                :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售 {{food.sellCount}} 份</span>
                    <span>好评率 {{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"></CartControl>
                  </div>
                </div>
              </li>

            </ul>
          </li>
        </ul>
      </div>
      <ShopCart/>
    </div>

<!--    此时的food是变化的food，初始值为空，即点击哪一个的时候就显示哪一个food，food在不断变化-->
<!--    指定唯一标识, vue 对象通过$ref 属性访问这个元素对象-->
    <Food :food="food" ref="food"></Food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {mapState} from 'vuex'
import CartControl from '../../../components/CartControl/CartControl'
import Food from '../../../components/Food/Food'
import ShopCart from '../../../components/ShopCart/ShopCart'

export default {
  data () {
    return {
      scrollY: 0, // 右侧滑动的Y轴坐标（滑动过程中实时变化） _initScroll ()用于记录
      tops: [],   // 所有右侧分类li的top组成的数组（列表第一次显示后就不再变化：统计一次就够了
      // _initTop函数用于同于统计每一个top的值，返回tops

      // 需要显示的food，即点击的food，即点击哪一个的时候就显示哪一个food，food在不断变化
      // 开始的时候，只有点击的时候才显示点击的那个food
      food: {} // 不用写为null，因为这样的话写表达式时会受到限制
    }
  },
  components: {CartControl, Food, ShopCart},
  mounted () {
    // 异步获取数据，触发action
    this.$store.dispatch('getShopGoods', () => { // 数据更新后执行

      // 向getShopGoods传递过去一个箭头函数：即数据更新后才执行的函数
      this.$nextTick(() => { // 列表数据更新显示后执行

        this._initScroll() // 列表显示之后再去调用函数，即列表有数据了才能去创建BScroll，收集scrollY
        this._initTop()
      })
    })
  },
  computed: {
    ...mapState(['goods']),

    // 计算得到当前分类的下标:每一个li的下标index
    currentIndex () { // 初始和相关数据发生变化时执行该计算属性
    // 得到条件数据
      const {scrollY, tops} = this
     // 根据条件计算产生一个结果
      // findIndex方法为数组中的每一个元素执行一次符合箭头
      // 并返回第一个符合箭头函数条件的数值的索引值
      const index = tops.findIndex((top, index) => {
        // 得到的是当前top值所在范围的索引值：根据scrollY的值进行判断它所在的索引值
        // scrollY>=当前top && scrollY<下一个top
        return scrollY>=top && scrollY<tops[index+1] // 返回在该范围内的数值的索引值
      })
     // 返回结果
      return index
    },
  },

  methods: {  // methos中放的是事件回调函数，而initScroll和initTop不是事件回调函数,加上_表示专用函数
    // 初始化滚动条，收集scrollY
    _initScroll () {
      // 列表显示之后，即列表有数据了才能去创建
      // 引入之后创建一个BScroll对象去关联需要进行滚动的包裹的div名称
      new BScroll('.menu-wrapper', { // better-scroll:支持很多配置选项
        click: true // BScroll默认会阻止浏览器的原生click事件，需要改为true
      })
      // 该对象是控制右侧列表滑动的，该对象被创建之后就可以滑动
      this.foodsScroll = new BScroll('.foods-wrapper', {
        probeType: 2, // 因为惯性的滑动不会触发
        // 1：不频繁触发  2：比1频繁 3： 比1,2都频繁
        click: true
      })

      // 给右侧列表绑定scroll监听,绑定监听使用on
      // scroll :监听的事件名，监测的是右侧滚动的实时坐标,将坐标作为参数传递给回调函数
      this.foodsScroll.on('scroll', ({x, y}) => {
        // console.log(x, y) 打印输出测试一些能否监视
        this.scrollY = Math.abs(y)  // 使用监视的目的是实时统计滑动的Y轴坐标绝对值
        // Math.abs()该函数返回参数的绝对值
      })

      // 给右侧列表绑定scroll结束时监听,绑定监听使用on,current更新到结束时的状态
      // scroll :监听的事件名，监测的是右侧滚动的实时坐标,将坐标作为参数传递给回调函数
      this.foodsScroll.on('scrollEnd', ({x, y}) => {
        // console.log(x, y) 打印输出测试一些能否监视
        this.scrollY = Math.abs(y)  // 使用监视的目的是实时统计滑动的Y轴坐标绝对值
        // Math.abs()该函数返回参数的绝对值
      })
    },

    // 初始化initTop()，收集右侧的tops，即每一个li
    _initTop () {

      // 1.初始化tops
      const tops = [] // 定义一个数组，用于存放每一个li的top
      let top = 0  // 定义一个变量，初始值为0
      tops.push(top)  // 先将第一个li的top值放入空数组中

      // 2.收集所有li的top
      // 找到所有分类的li:根据类名进行找
      // const lis = document.getElementsByClassName('food-list-hook') 整个页面找
      // 为其中的ul添加唯一标识
      // 将所有收集到的li放入lis伪数组,放入之后遍历每一个li
      const lis = this.$refs.foodsUl.getElementsByClassName('food-list-hook')
      // Array.prototype.slice.call(lis)：得到的是一个真数组，然后遍历真数组
      Array.prototype.slice.call(lis).forEach(li => {
        top+=li.clientHeight   // 每一个li的padding的高度
        tops.push(top)  // 每一个累加的top都需要放入tops
      })
      // 3.更新数据
      this.tops = tops
      // console.log(tops)
    },

    // 点击左侧滑动右侧列表
    clickMenuItem (index) {
      // console.log(index)
     // 当点击左侧对应index时，使右侧列表滑动到对应的位置

      // 得到目标位置的scrollY,即点击的index对应的scrollY
      const scrollY = this.tops[index]

      // 立即更新scrollY，更新scrollY就会更新current（让点击的分类项变为当前分类）
      this.scrollY = scrollY // 一点击左侧对应的，先更新scrollY,就会调用函数更新为当前current

      // 然后再滑动右侧列表
      // 一点击左右就会变为指定坐标的位置
      // 平滑滑动右侧列表 this.foodsScroll：右侧滑动是靠该对象的，一旦创建就可滑动
      // 对象调用scrollTo方法根据坐标滑动到指定的位置，滚动的坐标Y值为负的，所以这里取反
      this.foodsScroll.scrollTo(0, -scrollY, 300)
    },

    // 显示点击的food
    showFood (food) {
      // 设置food
      this.food = food // 当触发点击监听时，将点到的food传递过来，让它成为当前组件的food
      // 显示food组件（点击之前是隐藏的）
      // 在父组件中调用子组件对象的方法，即需要得到子组件对象，子组件对象就是引用在该组件中的标签，
      // 那如何得到该组件中的一个标签呢
      // : 指定唯一标识, vue 对象通过$ref 属性访问这个元素对象
// 先标识这个组件标签，通过子组件标签就能调它的方法了
      this.$refs.food.toggleShow()
    }
  }
}


</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
