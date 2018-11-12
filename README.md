# manhuatai-miniapp

漫画台小程序

## 效果图

#### 首页

![首页](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/home.gif)

#### 漫画详情页

![漫画详情页](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/detail.gif)

#### 更新页

![更新页](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/update.gif)

#### 漫画台热门帖子

![漫画台热门帖子](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/manhuatai.gif)

#### 书架

![书架](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/bookshelf.gif)

#### 我的

![我的](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/my.gif)

## 遇到的问题

- background-image 属性不能使用本地资源
- Pages 里的 onLoad 生命周期钩子函数可能会比 app.js 中的 onLaunch 生命周期钩子函数里的异步请求要早执行，可能会导致 Pages 里使用 globalData 数据报错
- text 组件的 line-height 无效，需要在 text 组件外层的 view 组件中设置 line-height
- 自定义组件 slot 插槽渲染的位置不正确[#bug](https://developers.weixin.qq.com/community/develop/doc/000666173f0e483f4d078bf9651000?highLine=slot)
