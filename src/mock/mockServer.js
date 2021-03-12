/*
模拟的服务器，专门来提供mock数据的
 */
/*
使用mockjs提供mock数据接口
 */
import Mock from 'mockjs'  // 最终是向外返回需要的数据的
import data from './data.json' // 数据是存储data.json中的

// 需要向外暴露3个接口,并指定每一个的路径，通过路径访问，为其创建3个接口函数
// 1.返回goods的接口 为接口指定一个路径  然后生成随机数据返回（我们将价格修改为随机数据的格式，具体可参考mockjs示例）
  // 根据模板生成数据
Mock.mock('/goods', {code:0, data:data.goods})
// 2.返回ratings的接口
Mock.mock('/ratings', {code:0, data:data.ratings})
// 3.返回info的接口
Mock.mock('/info', {code:0, data:data.info})

// 该模块不需要使用explore default向外暴露，只需要保证能够执行即可
// webpack打包时根据入口文件main.js加载所有相关的模块，所有如果需要关联某个模块就需要在入口main处进行关联
// 才能够保证执行
