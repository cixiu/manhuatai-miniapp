const cache = require('../../utils/cache');
const apiBookshelf = require('../../api/bookshelf');

const app = getApp();

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
    userInfo: {},
  },
  onShow: function() {
    this.setData({
      userInfo: cache.loadUserInfo(),
    });

    wx.getSystemInfo({
      success: (info) => {
        this.setData({
          swiperHeight: info.windowHeight - tagListHeight,
        });
      },
    });

    this.setLineBottomStyle(this.data.currentIndex);

    const userInfo = this.data.userInfo;

    // 登录后，使用线上的收藏和历史记录
    if (userInfo.Uname) {
      const requestData = {
        type: 'mkxq',
        openid: userInfo.openid,
        myuid: userInfo.Uid,
      };

      wx.showLoading({
        title: '数据加载中...',
        mask: true,
      });

      apiBookshelf.getUserRecord(
        requestData,
        (res) => {
          this._setBookshelfData(res);

          wx.hideLoading();
        },
        () => {
          wx.showToast({
            title: '数据加载失败',
            image: '../../img/icon_message_error.png',
          });
        },
      );
    } else {
      // 未登录时，去本地缓存
      this.loadBookCache();
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
  // 点击顶部tag栏
  switchTag: function(e) {
    const currentIndex = e.currentTarget.dataset.index;
    this.setLineBottomStyle(currentIndex);
  },
  // 滑动swiper，current 改变时会触发 change 事件
  swiperChange: function(e) {
    const currentIndex = e.detail.current;
    this.setLineBottomStyle(currentIndex);
  },
  // 删除一个收藏
  deleteCollection: function(e) {
    const comic = e.currentTarget.dataset.comic;
    const userInfo = this.data.userInfo;
    // 登录后，操作线上的收藏列表
    if (userInfo.Uname) {
      wx.showLoading({
        title: '删除中，请稍候...',
        mask: true,
      });

      const requestData = {
        type: 'mkxq',
        openid: userInfo.openid,
        myuid: userInfo.Uid,
        comic_id_list: `${comic.comic_id}`,
        action: 'dels',
      };

      apiBookshelf.setUserCollect(requestData, (res) => {
        const index = this.data.collectionList.findIndex((item) => {
          return item.comic_id === comic.comic_id;
        });

        if (index > -1) {
          const deleteComic = this.data.collectionList.splice(index, 1);
          cache.deleteCollection(deleteComic[0]);
          this.setData({
            collectionList: this.data.collectionList,
          });
        }

        wx.hideLoading();
      });
    } else {
      const collectionList = cache.deleteCollection(comic);
      this.setData({
        collectionList,
      });
    }
  },
  // 删除一个阅读历史
  deleteRead: function(e) {
    const comic = e.currentTarget.dataset.comic;
    const userInfo = this.data.userInfo;
    // 登录后，操作线上的阅读历史记录
    if (userInfo.Uname) {
      wx.showLoading({
        title: '删除中，请稍候...',
        mask: true,
      });

      const requestData = {
        type: 'mkxq',
        openid: userInfo.openid,
        myuid: userInfo.Uid,
        comic_id: comic.comic_id,
      };

      apiBookshelf.deleteUserRead(requestData, (res) => {
        const index = this.data.readList.findIndex((item) => {
          return item.comic_id === comic.comic_id;
        });

        if (index > -1) {
          const deleteComic = this.data.readList.splice(index, 1);
          this.setData({
            readList: this.data.readList,
          });
        }

        wx.hideLoading();
      });
    } else {
      const readList = cache.deleteHistoryRead(comic);
      this.setData({
        readList,
      });
    }
  },
  // 读取本地缓存中的收藏列表和阅读历史列表
  loadBookCache: function() {
    const collections = cache.loadCollections();
    const reads = cache.loadHistoryRead();

    this.setData({
      collectionList: collections,
      readList: reads,
    });
  },
  // 处理线上获取到的数据数据
  filterBookshelfList: function(list, sortBy = 'update_time') {
    const img_url = 'https://image.samanlehua.com/mh/{0}.jpg-480x640.jpg';

    list = list.map((item) => {
      item.comic_img = img_url.replace('{0}', item.comic_id);
      item.disable = undefined;
      return item;
    });

    list.sort((a, b) => {
      return b[sortBy] - a[sortBy];
    });

    return list;
  },
  _setBookshelfData: function(res) {
    const collectionList = this.filterBookshelfList(res.data.user_collect);
    const readList = this.filterBookshelfList(res.data.user_read, 'read_time');

    cache.saveComic(collectionList);

    this.setData({
      collectionList,
      readList,
    });
  },
});
