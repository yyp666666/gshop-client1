<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="iconfont icon-remove_circle_outline" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-if="food.count">{{food.count}}</div>
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
export default {
  props: {
    // count: Number,  // 当前食品要点多少分，count是存在于food里面的，只有点击add的时候，让count的值为1
    food: Object  // 当点击add或者remove时是更新某一个food里面的count，count在food里面
  },
 methods: {
    // 该方法用于更新food里面的count属性，而更新count就是更新foods，更新每一个foods就相当于更新goods，而更新goods是在vuex里面写的
   updateFoodCount (isAdd) { // 传递参数是都增加count
     // 此时需要传递两个参数，第一个是判断是否增加，进行判断的时候还需要food，
     // 因为需要知道是增加哪一个food，传递两个参数时将其包裹为对象的方式进行传递
    this.$store.dispatch('updateFoodCount', {isAdd, food:this.food})
   }
 }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

    .icon-remove_circle_outline
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
      &.move-enter-active, &.move-leave-active
        transition all .3s  // 动画效果，所有属性都完成过渡效果，0.3s完成
      &.move-enter, &.move-leave-to
        opacity 0   // 透明度：完全透明
        transform translateX(15px) rotate(180deg)  // 向右平移15px,旋转180
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color $green
</style>
