//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    currentIndex: 1,
    lineStyle: 'left: 20rpx',
    swiperHeight: 0,
    tagList: [
      {
        id: 1,
        text: '排行',
      },
      {
        id: 2,
        text: '推荐'
      },
      {
        id: 3,
        text: '日更'
      }
    ],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
    ],
  },
  onLoad: function() {
    this.setLineBottomStyle(this.data.currentIndex)
  },
  onReady: function() {
    // wx.createSelectorQuery().selectAll('.scroll-view').boundingClientRect((rects) => {
    //   const rect = rects[this.data.currentIndex]
    //   this.setData({
    //     swiperHeight: rect.height
    //   })
    // }).exec()
    wx.getSystemInfo({
      success: (info) => {
        this.setData({
          swiperHeight: info.windowHeight - 42
        })
      }
    })
  },
  // 点击顶部tag栏
  switchTag: function(e) {
    const currentIndex = e.currentTarget.dataset.index
    this.setLineBottomStyle(currentIndex)
  },
  // 滑动swiper，current 改变时会触发 change 事件
  swiperChange: function(e) {
    const currentIndex = e.detail.current
    this.setLineBottomStyle(currentIndex)
    if (currentIndex === 1) {
      wx.request({
        method: 'GET',
        url: 'https://kanmanapi-main.321mh.com/v1/book/getBookByType/',
        data: {
          pagesize: 40,
          page: 1,
          booktype: 132,
          platform: 8,
          platformname: 'android',
          productname: 'mht'
        },
        success: (res) => {
          console.log(res)
        }
      })
    }
  },
  // 控制tag-item的border-bottom的left值
  setLineBottomStyle: function(currentIndex) {
    wx.createSelectorQuery().selectAll('.tag-item').boundingClientRect((rects) => {
      const left = rects[currentIndex].left
      this.setData({
        currentIndex: currentIndex,
        lineStyle: `left: ${left}px`
      })
    }).exec()
  }
});
