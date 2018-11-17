# 漫画台微信小程序

一个基于[漫画台App](https://sj.qq.com/myapp/detail.htm?apkName=com.comic.manhuatai)应用的漫画阅读的[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/api/)


> 项目地址：[github源码](https://github.com/cixiu/manhuatai-miniapp)

> API接口文档：[API](api.md)

## 前言📻

在学习一门新的语言或者框架时，做好的方法应该是做一个完整的项目吧。在写项目的过程，我们可以熟练的掌握新框架或者语言的API和特性。所以学习微信小程序也是一样的。

写这个漫画类的小程序是因为个人平常也在追更一些漫画，而现在各大漫画平台基本都是收费的，所以就想写一个可以免费看各种漫画的小程序。当然，资源肯定到抓的其他漫画平台的。由于很久之前就一直在使用这个[漫画台App](https://sj.qq.com/myapp/detail.htm?apkName=com.comic.manhuatai)和[腾讯动漫](https://sj.qq.com/myapp/search.htm?kw=腾讯动漫)，而且这2个漫画平台的资源比较多，各种热门的漫画基本都有。对比之下，漫画台的界面更清爽，最重要的是接口更好获取(手动滑稽😂)，所以选择了漫画台😀😀。

该项目现在一共完成了**22个页面**，涉及了登录，评论，回复，点赞，还有最核心的漫画的阅读，漫画的搜索等等，对比原生的漫画台App应用的功能大部分都已经实现了，剩下的也只是一些无关紧要的功能了。常用的微信小程序有关的API也基本有使用到，也算是一个不大不小的学习项目吧。

**此外，由于漫画类小程序不属于个人上线的范围，而且这可能会造成侵权，所以该小程序没有上线的。如果想阅读更多漫画，请前往各[手机应用商城](https://sj.qq.com/myapp/detail.htm?apkName=com.comic.manhuatai)搜索漫画台进行下载使用，或者前往[漫画台官网](http://www.manhuatai.com/)阅读**

**最后，该项目的所有API接口通过Charles工具抓取，图标来自[漫画台](http://www.manhuatai.com/)APP安卓包。该项目旨在通过编码来学习和熟悉微信小程序的开发，不作为商业目的，纯属个人瞎搞，正常的漫画阅读请使用官方的APP**


## 项目说明💻

### 微信小程序图片懒加载封装
该小程序是漫画图片类型，因此会使用到大量的图片，那么图片的懒加载是必不可少的需求。由于微信小程序官方的`image`组件的`lazy-load`属性过于鸡肋，所以为了更好的体验，需要重新封装一个懒加载组件。
这个懒加载组件的原理是使用`wx.createIntersectionObserver()` 创建并返回一个 `IntersectionObserver` 对象实例，这个`IntersectionObserver` 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。具体实现见下方

```html
<!-- lazy-load.wxml -->
<view class="lazy-load-wrapper border-radius">
  <image
    class="lazy-load border-radius"
    style="width: 100%; height: {{ height }}rpx"
    data-src="{{ src }}"
    mode="{{ mode }}"
    src="{{ url }}"
    bindload="imageLoad"
    bindtap="handleTap"
    binderror="handleError"
  ></image>
</view>
```

```css
/* lazy-load.wxss  */
.lazy-load-wrapper {
  width: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
}

.lazy-load {
  vertical-align: top;
}
```

```javascript
// lazy-load.js
Component({
  externalClasses: ['border-radius'], // 用于在组件外部控制图片的圆角的class
  data: {
    url: '',
  },
  properties: {
    // 图片显示模式
    mode: {
      type: String,
      value: 'widthFix',
    },
    // 图片的真实url
    src: {
      type: String,
      value: '',
    },
    // 图片的占位高度，单位rpx
    height: {
      type: Number,
      value: 200,
    },
    // 节点布局区域的下边界的距离
    bottom: {
      type: Number,
      value: 300,
    },
  },
  ready: function() {
    this.alreadyShow = false; // 用于标记图片是否已经出现在屏幕中

    // observer的元素必须有高度 不然不会触发回调
    this.createIntersectionObserver()
      .relativeToViewport({ bottom: this.properties.bottom })
      .observe('.lazy-load', (rect) => {
        // 如果图片进入可见区域，但还是第一次出现
        if (!this.alreadyShow) {
          this.alreadyShow = true;
          this.setData({
            url: rect.dataset.src,
          });
        }
      });
  },
  methods: {
    imageLoad: function(e) {
      // 触发lazy-load的load事件
      this.triggerEvent('load', e);
    },
    handleTap: function(e) {
      // 触发bindlazytap自定义事件
      this.triggerEvent('lazytap', e);
    },
    // 图片加载失败后，显示一张默认的图片
    handleError: function(e) {
      this.setData({
        url: './pic_cache.png',
      });
      this.triggerEvent('error', e);
    },
  },
});
```
> 有关图片懒加载的效果见下方的效果图，该小程序中使用到的图片懒加载到处都是。


### 启动
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

#### 漫画搜索

![漫画搜索](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/comic-search.gif)

#### 漫画评论和点赞

![漫画评论和点赞](https://blog.image.tzpcc.cn/mini/manhuatai/screenshot/comic-comment.gif)

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
