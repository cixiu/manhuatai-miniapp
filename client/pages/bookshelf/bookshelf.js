const cache = require('../../utils/cache');

// 导航栏的高度 42px
const tagListHeight = 42;

Page({
  data: {
    currentIndex: 0,
    lineStyle: 'left: 20rpx',
    swiperHeight: 0,
    tagList: [
      {
        id: 0,
        name: '收藏',
      },
      {
        id: 1,
        name: '历史',
      },
    ],
    collectionList: [],
    readList: [],
  },
  onShow: function() {
    this.setLineBottomStyle(this.data.currentIndex);
    wx.getSystemInfo({
      success: (info) => {
        this.setData({
          swiperHeight: info.windowHeight - tagListHeight,
        });
        this.loadCollections();
      },
    });
  },
  // 控制tag-item的border-bottom的left值
  setLineBottomStyle: function(currentIndex) {
    wx.createSelectorQuery()
      .selectAll('.tag-item')
      .boundingClientRect((rects) => {
        const left = rects[currentIndex].left;
        this.setData({
          currentIndex: currentIndex,
          lineStyle: `left: ${left}px`,
        });
      })
      .exec();
  },
  // 点击顶部tag栏
  switchTag: function(e) {
    const currentIndex = e.currentTarget.dataset.index;
    this.setLineBottomStyle(currentIndex);
  },
  // 滑动swiper，current 改变时会触发 change 事件
  swiperChange: function(e) {
    const currentIndex = e.detail.current;
    const tag = this.data.tagList[currentIndex];
    this.setLineBottomStyle(currentIndex);
    if (currentIndex === 0 && !this.data.collectionList.length) {
      this.loadCollections();
    }
    if (currentIndex === 1 && !this.data.readList.length) {
      this.loadHistoryRead();
    }
  },
  // 删除一个收藏
  deleteCollection: function(e) {
    const comic = e.currentTarget.dataset.comic;
    const collections = cache.deleteCollection(comic);
    this.setData({
      collectionList: collections,
    });
  },
  // 删除一个阅读历史
  deleteRead: function(e) {
    const comic = e.currentTarget.dataset.comic;
    const reads = cache.deleteHistoryRead(comic);
    this.setData({
      readList: reads,
    });
  },
  // 读取本地缓存中的漫画收藏列表
  loadCollections: function() {
    const collections = cache.loadCollections();
    this.setData({
      collectionList: collections,
    });
  },
  // 读取本地缓存中的阅读历史
  loadHistoryRead: function() {
    const reads = cache.loadHistoryRead();
    this.setData({
      readList: reads,
    });
  },
});
