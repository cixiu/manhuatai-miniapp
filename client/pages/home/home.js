const apiHome = require('../../api/home.js');

// 导航栏的高度 42px
const tagListHeight = 42;

Page({
  data: {
    currentIndex: 1,
    // currentIndex: 0, // 显示排行
    // currentIndex: 2, // 显示日更
    lineStyle: 'left: 20rpx',
    swiperHeight: 0,
    tagList: [
      {
        id: 0,
        name: '排行',
        urlid: 'rank',
      },
      {
        id: 132,
        name: '推荐',
        urlid: '',
      },
      {
        id: 137,
        name: '日更',
        urlid: 'rigeng',
      },
      {
        id: 59,
        name: '漫改',
        urlid: 'mangai',
      },
      {
        id: 42,
        name: '社会',
        urlid: 'shehui',
      },
      {
        id: 72,
        name: '生活',
        urlid: 'shenghuo',
      },
    ],
    rankData: [],
    recommendData: {},
    rigengData: {},
    mangaiData: {},
    shehuiData: {},
    shenghuoData: {},
  },
  onLoad: function() {
    this.setLineBottomStyle(this.data.currentIndex);
    wx.getSystemInfo({
      success: (info) => {
        this.setData({
          swiperHeight: info.windowHeight - tagListHeight,
        });
        // this.getBookList('', 132, 'recommendData');
        // this.getRankList(); // 获取排行数据
        // this.getBookList('rigeng', 137, 'rigengData'); // 获取日更数据
      },
    });
  },
  // 监听用户点击页面内转发按钮
  onShareAppMessage: function() {
    return {
      title: '漫画杂志阅读神器',
      path: '/pages/home/home',
    };
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
    if (currentIndex === 0 && !this.data.rankData.length) {
      this.getRankList();
    }
    if (currentIndex === 1 && !this.data.recommendData.name) {
      this.getBookList(tag.urlid, tag.id, 'recommendData');
    }
    if (currentIndex === 2 && !this.data.rigengData.name) {
      this.getBookList(tag.urlid, tag.id, 'rigengData');
    }
    if (currentIndex === 3 && !this.data.mangaiData.name) {
      this.getBookList(tag.urlid, tag.id, 'mangaiData');
    }
    if (currentIndex === 4 && !this.data.shehuiData.name) {
      this.getBookList(tag.urlid, tag.id, 'shehuiData');
    }
    if (currentIndex === 5 && !this.data.shenghuoData.name) {
      this.getBookList(tag.urlid, tag.id, 'shenghuoData');
    }
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
  // 获取首页的书籍列表 (推荐， 日更， 漫改， 社会，生活))
  getBookList: function(
    pytype = '',
    booktype = 132,
    datakey = 'recommendData',
  ) {
    apiHome.getBookList(pytype, booktype, (res) => {
      this.setData({
        [datakey]: res.data.data,
      });
    });
  },
  // 获取首页的排行列表
  getRankList: function() {
    apiHome.getRankList((res) => {
      this.setData({
        rankData: res.data.data,
      });
    });
  },
});
