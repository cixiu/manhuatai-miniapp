# manhuatai-miniapp

漫画台小程序

## 遇到的问题

- background-image 属性不能使用本地资源
- Pages 里的 onLoad 生命周期钩子函数可能  会比 app.js 中的 onLaunch 生命周期钩子函数里的异步请求要早执行，可能会导致 Pages 里使用 globalData 数据报错
- text 组件的 line-height 无效，需要在 text 组件外层的 view 组件中设置 line-height
- 自定义组件 slot 插槽渲染的位置不正确[#bug](https://developers.weixin.qq.com/community/develop/doc/000666173f0e483f4d078bf9651000?highLine=slot)
