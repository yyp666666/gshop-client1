<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
<!--        进行前台验证时，点击button按钮需为提交表单:增加阻止事件的默认行为操作-->
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">

<!--              v-model：根据手机号去判断button按钮的颜色-->
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
<!--              当手机号正确的时候为button添加一个类名,类名确定，只是确定有没有，使用对象语法-->
<!--              button按钮的disable属性表示禁用该按钮:当手机号为false时，button无法点击
                  手机号正确时，添加点击监听事件，可以点击获取验证码进行倒计时-->
              <button :disabled="!rightPhone" class="get_verification"
                      :class="{right_phone: rightPhone}" @click.prevent="getCode">
                {{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
<!--                showPwd为true时可以不写，默认为true，即显示密码为true，在data中的定义不是默认值-->
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
<!--                添加点击监听事件切换两种显示方式-->
                <div class="switch_button" :class="showPwd? 'on':'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class="{right:showPwd}"></div>
                  <span class="switch_text">{{showPwd?'abc':''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha"
                  @click="getCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>

<!--    该部分变化的内容包含2个：提示文本，显示隐藏-->
    <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip"/>
  </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
// 将需要使用的接口函数首先进行引入 发送短信验证码/用户名密码登录/手机号验证码登陆
import {reqSendcode, reqPwdLogin, reqSmsLogin} from '../../api'
export default {
  components: {AlertTip},
  data () {

    // pwd和phone的命名应与API中的命名相同
    return {
      loginWay: true,  // 短信登录方式为true
      computeTime: 0, // 为0时，表示计时停止，计时：用于存储不断变化的时间
      phone:'',  // 手机号初始化，使用v-model去收集数据
      pwd: '',  // 密码
      code: '', // 短信验证码
      name: '', // 用户名
      captcha: '', // 图形验证码
      showPwd: false, // false:隐藏，true：显示是否显示密码
      alertText: '',  // 警告提示文本
      alertShow: false // true:显示警告框，false：隐藏
    }
  },

  // 当根据data里面的内容就可以计算得到的属性，属于计算属性
  computed: {
    // 判断手机号是否正确，来判定类名是否出现
    rightPhone () {  // 返回值类型为布尔值：true：手机号正确/false：
      const {phone} = this

      return /^1\d{10}$/.test(this.phone)  // 验证手机号，使用正则表达式
    }
  },
  methods: {
    // 该方法用于异步获取短信验证码
    async getCode () {
     // alert('---可以点击')

      // 什么时候开始出现计时，不能出现两次点击都开始计时的情况
      // 所以当前没有计时时（即当时为0时），才开始进行新的一轮计时
      // if(！this.computeTime)
      // 1.启动倒计时
      if(this.computeTime===0) {
        this.computeTime = 30 // 给定倒计时开始的时间
        // 循环定时器
        // intervalId:返回的值setInterval函数的ID标识，每次调用setInterval函数都会产生一个唯一的ID，
        // 可以传递给 Window.clearInterval() 从而取消对 code 的周期性执行。
        // 初次定义intervalId，本来使用const，但由于发送ajax请求时还可以，所以将其赋值给组件
        this.intervalId = setInterval(() => {
          // 执行--操作，从30开始，直到减为0结束
          this.computeTime--
          if(this.computeTime<=0) {
            // 当intervalId=0时停止计时
            clearInterval(this.intervalId)
          }
        }, 1000)



      }
      // 2.发送ajax请求（向指定手机号发送验证码短信）
      const result = await reqSendcode(this.phone)
      // 发送失败
      if(result.code===1){
        // 显示提示，信息发送失败
        this.showAlert(result.msg) // msg：API接口
        // 停止倒计时时，
        // 首先就需要确认它是否目前还在倒计时
        if(this.computeTime>0) {
          this.computeTime = 0  // 首先将计时数据变为0，然后停止计时
          clearInterval(this.intervalId) // // 当停止计时时，需要一个intervalId，所以将计时时的intervalId赋值给this，当前函数即可看到
        }
      }

    },
    // 调用该方法即可使警告提示信息(AlertTip组件)显示出来
    showAlert(alertText) {
      this.alertShow = true
      this.alertText = alertText
    },
   // 实现异步登录
    async login () {

      let result
      // 前台表单验证：两种登录方式的不同，需要检查的data里面的数据就不相同
      if(this.loginWay) { // loginWay为true：短信登录

        // 对手机号进行检查时，不仅是要查看手机号，还是要正确形式的手机号，但是phone最终也是要提交的，所有也需要取出
        const {rightPhone, phone, code} = this
        if(!this.rightPhone) {
          // 如果手机号不正确（即手机号为false，也可以简写为！）
          this.showAlert('手机号不正确')
          return
          // 对验证码进行监测(正则：6位数字结尾)
        } else if(!/^\d{6}$/.test(this.code)) {
          //验证码不正确：验证码必须为6位数字
          this.showAlert('验证码必须为6位数字')
          return
        }

        // 发送ajax请求短信登录：点击登录按钮，成功
         result = await reqSmsLogin(phone, code)

      } else {
        // loginWay为false：密码登录
        const {name, pwd, captcha} = this

        if(!this.name) {
          // 用户名必须输入
          this.showAlert('用户名必须输入')
          return
        } else if(!this.pwd) {
          // 密码必须输入
          this.showAlert('密码必须输入')
          return
        } else if(!this.captcha) {
          // 验证码必须输入
          this.showAlert('验证码必须输入')
          return
        }

        // 发送ajax请求密码登录：点击登录按钮，成功
        result = await reqPwdLogin({name, pwd, captcha})

      }

      // 发送ajax请求之后立即停止计时器
      // 停止倒计时时，
      // 首先就需要确认它是否目前还在倒计时
      if(this.computeTime>0) {
        this.computeTime = 0  // 首先将计时数据变为0，然后停止计时
        clearInterval(this.intervalId) // // 当停止计时时，需要一个intervalId，所以将计时时的intervalId赋值给this，当前函数即可看到
      }

      // 短信登录和密码登录发送ajax请求之后，产生了两种结果
      // 根据结果数据处理,处理之前我们应该先把定时器关闭
      if(result.code===0) {
        // 登录成功
        const user = result.data
        // 登录成功之后需要将user保存至vuex中的state中，保存的过程也是需要写vuex的一套的，写完之后这里只需触发action
        // 登录成功的用户名后续需要使用
        this.$store.dispatch('recordUser', user)
        // 然后跳转页面到个人中心,然后需要显示登录时的用户名
        this.$router.replace('/profile')  // 使用replace，登录成功之后不需要再次返回该页面

      } else {
        // 登录失败
        // 显示警告提示
        const msg = result.msg
        this.showAlert(msg)

        // 当登录失败给出原因之后，我们需要更新验证码
        this.getCaptcha()
      }
    },
    // 确认关闭警告框
    closeTip() {
      this.alertShow = false  // 提示框隐藏
      this.alertText = ''
    },
    // 为一次性图片验证码添加点击监听事件：点击验证码从而获取一个新的图片验证码
    // event：默认事件形参  event.target:返回触发该事件的元素，即得到img里面src的元素
    // getCaptcha (event) {
    getCaptcha () {
      // 每一次点击都要获取新的验证码：即要保证地址正确，又要保证保证路径有变化，才会从新发送请求，获取新的验证码
      // 路径正确，并且每一次的点击都会产生一个新的日期时间值，路径不断变化就会不断发送请求
      // event.target.src = 'http://localhost:4000/captcha?time='+Date.now()
      // 使用event是该事件的默认形参，但是在后面写代码的过程中，需要调用该函数，更新验证码，无法找到event，所以需要为该事件image
      // 添加唯一标识ref，只有就可以精确的找到了
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
      // 跨域一般是发送ajax请求，该位置不是ajax请求，不存在跨域问题
    }
  }
}


</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone  // &指向父选择器
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
