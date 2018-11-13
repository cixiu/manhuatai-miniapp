# 漫画台微信小程序

一个基于[漫画台App](https://sj.qq.com/myapp/detail.htm?apkName=com.comic.manhuatai)应用的漫画阅读的[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/api/)


> 项目地址：[点击这里](https://github.com/cixiu/manhuatai-miniapp)

## 前言📻

在学习一门新的语言或者框架时，做好的方法应该是做一个完整的项目吧。在写项目的过程，我们可以熟练的掌握新框架或者语言的API和特性。所以学习微信小程序也是一样的。

写这个漫画类的小程序是因为个人平常也在追更一些漫画，而现在各大漫画平台基本都是收费的，所以就想写一个可以免费看各种漫画的小程序。当然，资源肯定到抓的其他漫画平台的。由于很久之前就一直在使用这个[漫画台App](https://sj.qq.com/myapp/detail.htm?apkName=com.comic.manhuatai)和[腾讯动漫](https://sj.qq.com/myapp/search.htm?kw=腾讯动漫)，而且这2个漫画平台的资源比较多，各种热门的漫画基本都有。对比之下，漫画台的界面更清爽，最重要的是接口更好获取(手动滑稽😂)，所以选择了漫画台😀😀。

该项目现在一共完成了**22个页面**，涉及了登录，评论，回复，点赞，还有最核心的漫画的阅读，漫画的搜索等等，对比原生的漫画台App应用的功能大部分都已经实现了，剩下的也只是一些无关紧要的功能了。常用的微信小程序有关的API也基本有使用到，也算是一个不大不小的学习项目吧。

**此外，由于漫画类小程序不属于个人上线的范围，而且这可能会造成侵权，所以该小程序没有上线的。如果想阅读更多漫画，请前往各[手机应用商城](https://sj.qq.com/myapp/detail.htm?apkName=com.comic.manhuatai)搜索漫画台进行下载使用，或者前往[漫画台官网](http://www.manhuatai.com/)阅读**

**最后，该项目的所有API接口通过Charles工具抓取，图标来自[漫画台](http://www.manhuatai.com/)APP安卓包。该项目旨在通过编码来学习和熟悉微信小程序的开发，不作为商业目的，纯属个人瞎搞，正常的漫画阅读请使用官方的APP**


## 项目运行💻
```
git clone https://github.com/cixiu/manhuatai-miniapp.git

通过微信开发者工具打开client文件夹

记得在project.config.json中换上自己的appid

如果数据请求出错了，记得检查是否开启https的校验
```


## 小程序功能✨
- [x] 漫画推荐
- [x] 漫画详情
- [x] 漫画阅读(所有漫画都可免费阅读)
- [x] 漫画收藏与评论
- [x] 漫画评论的点赞和发布
- [x] 漫画和作者的搜索
- [x] 漫画每日更新
- [x] 热门帖子(支持评论和点赞)
- [x] 收藏列表和阅读历史
- [x] 登录(只限手机号登录与APP应用数据同步)
- [x] 个人资料的修改
- [ ] 还有一些小功能暂未开放

## 部分效果图🔥

#### 首页

![首页](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/home.gif)

#### 漫画详情页

![漫画详情页](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/detail.gif)

#### 漫画阅读

![漫画阅读](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/comic-read.gif)

#### 更新页

![更新页](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/update.gif)

#### 漫画台热门帖子

![漫画台热门帖子](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/manhuatai.gif)

#### 书架

![书架](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/bookshelf.gif)

#### 我的

![我的](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/my.gif)

## 遇到的一些问题🐛

- background-image 属性不能使用本地资源
- Pages 里的 onLoad 生命周期钩子函数可能会比 app.js 中的 onLaunch 生命周期钩子函数里的异步请求要早执行，可能会导致 Pages 里使用 globalData 数据报错
- text 组件的 line-height 无效，需要在 text 组件外层的 view 组件中设置 line-height
- 自定义组件 slot 插槽渲染的位置不正确[#bug](https://developers.weixin.qq.com/community/develop/doc/000666173f0e483f4d078bf9651000?highLine=slot)
