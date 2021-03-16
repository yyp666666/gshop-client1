
/*
该模块也不需要向外暴露什么，只需在入口js处加载一些就可以了
通过vue来自定义过滤器
使用日期过滤器时我们需要一个库，moment,moment占有空间比较大，我们进行优化使用date-fns就可以了
*/
import Vue from 'vue'
 // import moment from 'moment'

import format from 'date-fns/format'

// id:为过滤器名字
// format：你传递过来格式，就要你的，不传就用默认格式
Vue.filter('dateFormat', function (value, formatStr='yyyy-MM-dd HH:mm:ss') {
  // 处理函数，接收一个需要格式化处理的数据
  // 最终返回一个新的数据，需要显示的数据
  // 接收需要处理的数据，写出需要格式化成什么样子的
  // return moment(value).format(format || 'YYYY-MM-DD HH:mm:ss')

  // 使用date-fns
  return format(value, formatStr)
})
