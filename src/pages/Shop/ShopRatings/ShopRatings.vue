<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{info.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家 {{info.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :score="info.serviceScore" :size="36"/>
            <span class="score">{{info.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :score="info.foodScore" :size="36"/>
            <span class="score">{{info.foodScore}}</span></div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{info.deliveryTime}} 分钟</span>
          </div>
        </div>
      </div>
      <div class="split">
      </div>
      <div class="ratingselect">
        <div class="rating-type border-1px">
          <span class="block positive" :class="{active: selectType===2}" @click="setSelectType(2)">
            全部
            <span class="count">{{ratings.length}}</span>
          </span>
          <span class="block positive" :class="{active: selectType===0}" @click="setSelectType(0)">
            满意
<!--            此方法是根据ratings计算的，所以可以将其写在getter中-->
            <span class="count">{{positiveSize}}</span>
          </span>
          <span class="block negative" :class="{active: selectType===1}" @click="setSelectType(1)">
            不满意
            <span class="count">{{ratings.length-positiveSize}}</span>
          </span>
        </div>
<!--        onlyShowText为true时，才会有on-->
        <div class="switch" :class="{on: onlyShowText}" @click="toggleOnlyShowText">
          <span class="iconfont icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
        </div>
      </div>
      <div class="rating-wrapper">
        <ul>
<!--          该处遍历的是根据3个不同的按钮过滤ratings之后产生的新的数组
              根据rating产生的这个新的数据定义在computed中-->
          <li class="rating-item" v-for="(rating, index) in filterRatings" :key="index">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <Star :score="rating.score" :size="24"/>
                <span class="delivery">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span class="iconfont" :class="rating.rateType===0 ? 'icon-thumb_up':'icon-thumb_down'"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | dateFormat}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Star from '../../../components/Star/Star'
import {mapState, mapGetters} from 'vuex'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      onlyShowText: true, // 只显示带有文本的评价
      selectType: 2 // 2：代表全部评价都看  选择的评价类型 0 ：满意   1：不满意
    }
  },
  mounted () {
    // 触发函数之后就会异步获取数据，同时给action传递一个回调函数，当他获取数据完成之后通知组件
    this.$store.dispatch('getShopRatings', () => {
      // 数据更新了，就执行
      this.$nextTick(() => { // 有数据了，即页面更新之后才调用该函数
        new BScroll(this.$refs.ratings,{ // 对整个页面进行滑动，可以使用唯一标识
          click: true
        })
      })
    })
  },
  components: {Star},
  computed: {
    ...mapState(['info', 'ratings']),
    ...mapGetters(['positiveSize']),

// 过滤器并没有改变原来的数据，产生了新的对应的数据
    filterRatings () { // 产生新的数组
      // 先写条件，将影响该数组产生的数据取出
      const {ratings, onlyShowText, selectType} = this

      // 产生一个过滤新数组
      return ratings.filter(rating => {
        const {rateType, text} = rating
        // 可能性特别多：两个条件同时满足才可以：
        // 可能性特别多：一种一种的去看
        /*
     条件1：
       selectType： 0/1/2
       rateType: 0/1
       selectType===2 || selectType===rateType
       条件2：
       onlyShowText：true/false
       text: 有值/无值
       !onlyShowText || text.length>0
      */

        // 条件1和条件2为true都分别有两种情况，条件1和条件2必须同时满足
        // 选中全部有2种情况
       /* if(selectType===2) {
          return (选中全部)
            if(!onlyShowText){
              return (所有评价都看)
            } else { //  text.length>0
              return (只看有内容的)
            }
        //  不选中全部有2种情况
        } else { // selectType===rateType
          return (选中满意/不满意)
          if(!onlyShowText){
            return (所有评价都看)
          } else { //  text.length>0
            return (只看有内容的)
          }
        }*/
      return (selectType===2 || selectType===rateType) && (!onlyShowText || text.length>0)
      })
    }
  },
    methods: {
      // 选择3个不同的按钮
      setSelectType (selectType) {
        this.selectType = selectType // 参数传过来之后立即修改selectType的值
      },
      // 切换显示文本
      toggleOnlyShowText () {
        this.onlyShowText = !this.onlyShowText
      }
    }

  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"

  .ratings
    position: absolute
    top: 195px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    background: #fff
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .split
      width: 100%
      height: 16px
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      background: #f3f5f7
    .ratingselect
      .rating-type
        padding: 18px 0
        margin: 0 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .block
          display: inline-block
          padding: 8px 12px
          margin-right: 8px
          line-height: 16px
          border-radius: 1px
          font-size: 12px
          color: rgb(77, 85, 93)
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: $green
            color: #fff
          .count
            margin-left: 2px
            font-size: 8px
      .switch
        padding: 12px 18px
        line-height: 24px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        color: rgb(147, 153, 159)
        font-size: 0
        &.on
          .icon-check_circle
            color: $green
        .icon-check_circle
          display: inline-block
          vertical-align: top
          margin-right: 4px
          font-size: 24px
        .text
          display: inline-block
          vertical-align: top
          font-size: 12px
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .icon-thumb_down, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: $yellow
            .icon-thumb_down
              color: rgb(147, 153, 159)

            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
