# manhuatai-miniapp
漫画台小程序

## 遇到的问题
* background-image属性不能使用本地资源
* Pages里的onLoad生命周期钩子函数可能会比app.js 中的onLaunch生命周期钩子函数里的异步请求要早执行，可能会导致Pages里使用globalData数据报错
* text组件的line-height无效，需要在text组件外层的view组件中设置line-height
