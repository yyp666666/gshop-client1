<template>
<!--  对象语法：类名确定，只是不确定是否需要，显然该位置不适合使用对象语法进行强制绑定，所有使用字符串进行-->
  <div class="star" :class="'star-'+size">

<!--  用来表示积分的5个类名是有顺序的，此时假设有一个数组starClasses,
  用来表示星星的类名，遍历该数组，即可得到每一个星星的类名，即每一颗星星的状态sc：on,off,half-->
    <span class="star-item" v-for="(sc, index) in starClasses" :class="sc" :key="index"></span>
  </div>
</template>

<script>
// 将这些固定的类名定义为常量，不定义也是可以的
  const CLASS_ON = 'on'
  const CLASS_HALF = 'half'
  const CLASS_OFF = 'off'
export default {
  // 该组件被单独抽取出来，需要接收参数，去父组件中传递
  props: {
    score: Number, // 当前图片是用来显示评分效果的，接收评分
    size: Number   // 尺寸大小也是不同的（24,36,48）
  },

  // 使用计算属性生成该数组,
  computed: {

    /*
    3.2：3 + 0 + 2
    3.5：3 + 1 + 1
     */
    starClasses () {
      const {score} = this   // 取出score，根据score生成数组
      const scs = []  // 准备一个空数组，最终返回该数组，该数组中最多存放5个
      // 向scs中添加n个‘on’：on的个数取决于score的整数
      const scoreInteger = Math.floor(score)  // 取出score的整数部分
      // 使用for循环产生scoreInteger个on
      for (let i = 0; i<scoreInteger; i++) {
        scs.push(CLASS_ON)  // 依次将产生的on放进数组scs中
      }

      // 向scs中添加1/0个‘CLASS_HALF’（是否添加off是有条件的）
      // 小数的计算并不是那么准确的，所以将它扩大十倍之后再进行计算
      if(score*10-scoreInteger*10>=5) {
        scs.push(CLASS_HALF)  // 将half放进数组
      }

      // 向scs中添加n个‘CLASS_OFF’
      while(scs.length<5) {
        scs.push(CLASS_OFF)
      }
      return scs
    }

  }
}


</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star //2x图 3x图:不同手机的屏幕密度不同，同一个图片制作了2X和3X两幅图片
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>
