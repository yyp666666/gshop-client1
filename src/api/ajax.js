/*
* ajax请求函数模块，最后得到的结果就是response.data
*
* 返回值promise对象：用于接收异步操作的消息，response.data
*
* 原来：const response=await.ajax  客户端发送请求，服务器端处理后返回：response代表响应的结果
*      const result=response.data  ajax只会获取刚刚请求的数据
* 现在：const result=await.ajax   new promise调用该函数直接异步获取结果
* */
// 当前需使用axios发送ajax请求，首先下载
// 当前默认向外暴露一个函数，异步函数ajax，需要三个条件，URL，请求参数以对象的方式传递，并给出默认值
import axios from 'axios'
export default function ajax (url, data={}, type='GET') {

  // 该函数最终向外层函数返回一个promise对象
  return new Promise(function (resolve, reject){
    // 执行异步操作
    let promise  // 首先声明一个promise，获取response

    // 如果为get请求，将data里面的数据拼到URL里面去   URL以？分割，多个参数之间使用&分割
    // post：不需要拼，data直接接收一个对象
    if (type === 'GET') {
      // 准备 url query 参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // axios发送 get 请求,promise得到的就是response：获取响应的数据  promise=response
      promise = axios.get(url)
    } else {
      // 发送 post 请求
      promise = axios.post(url, data)
  }

    // promise.then传的是成功的回调函数，catch传的是失败的回调函数
  promise.then(function (response) {  // 变量promise得到的就是response
// 成功了调用resolve,向ajax返回最终需要的data
    resolve(response.data)
  }).catch(function (error) {
    // 失败了调用reject
    reject(error)
    })

  })
}
