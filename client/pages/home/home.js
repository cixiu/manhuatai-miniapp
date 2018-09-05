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
        id: 0,
        name: '排行',
        urlid: 'rank'
      },
      {
        id: 132,
        name: '推荐',
        urlid: 'recommend'
      },
      {
        id: 137,
        name: '日更',
        urlid: 'rigeng'
      },
      {
        id: 59,
        name: '漫改',
        urlid: 'mangai'
      },
      {
        id: 42,
        name: '社会',
        urlid: 'shehui'
      },
      {
        id: 72,
        name: '生活',
        urlid: 'shenghuo'
      }
    ],
    swiperData: {
      rank: [],
      recommend: [],
      rigeng: [],
      mangai: [],
      shehui: [],
      shenghuo: []
    }
  },
  onLoad: function() {
    this.setLineBottomStyle(this.data.currentIndex)
  },
  onReady: function() {
    wx.getSystemInfo({
      success: (info) => {
        console.log(info)
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
