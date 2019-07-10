const loginApi = require('../../api/login');
const cache = require('../../utils/cache');
const filter = require('../../utils/filter');

const app = getApp();

Page({
  data: {
    userInfo: {},
    Uavatar: '',
  },
  onLoad: function() {
    this.initSet();
  },
  onShow: function() {
    // 如何是登录后的返回，则初始化数据
    if (app.globalData.isNavigateBack) {
      app.globalData.isNavigateBack = false;
      this.initSet();
    }
    // 如何使修改了个人资料后，也需要更新数据
    if (app.globalData.isModifyUserInfo) {
      app.globalData.isModifyUserInfo = false;
      this.initSet();
    }
  },
  // 监听用户点击页面内转发按钮
  onShareAppMessage: function() {
    return {
      title: '漫画杂志阅读神器',
      path: '/pages/home/home',
      imageUrl: '../../img/share.jpg',
    };
  },
  onPullDownRefresh: function() {
    const cacheUserInfo = cache.loadUserInfo();
    if (cacheUserInfo.Uname) {
      // 获取登录用户信息需要发送的数据
      const requestData = {
        openid: cacheUserInfo.openid,
        myuid: cacheUserInfo.Uid,
        autologo: 1,
      };
      // 获取登录用户的信息
      loginApi.getComicUserInfo(requestData, (res) => {
        const userInfo = res.data;
        const id = userInfo.Uid;
        const imgHost = `${app.globalData.imgHost}/file/kanmanhua_images/head/`;
        // 生成用户的头像的url
        const Uavatar = filter.makeImgUrlById(id, imgHost, 'l1x1');

        userInfo.Uavatar = Uavatar;

        app.globalData.comicUserInfo = userInfo;
        cache.saveUserInfo(userInfo);

        this.setData({
          Uavatar: this.data.Uavatar.replace(/\?\d+/g, `?${+new Date()}`),
          userInfo,
        });
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  },
  initSet: function() {
    const cacheUserInfo = cache.loadUserInfo();
    if (cacheUserInfo.Uname) {
      const id = cacheUserInfo.Uid;
      const imgHost = `${app.globalData.imgHost}/file/kanmanhua_images/head/`;
      // 生成用户的头像的url
      const Uavatar =
        filter.makeImgUrlById(id, imgHost, 'l1x1') + `?${+new Date()}`;

      this.setData({
        Uavatar,
        userInfo: cacheUserInfo,
      });
    }
  },
  goToLogin: function() {
    // 如果用户登录了，则前往个人资料
    if (this.data.userInfo.Uname) {
      wx.navigateTo({
        url: '/pages/user-center/user-center',
      });
    } else {
      // 否则前往登录
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
  },
  // 退出登录
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '退出时将清除本地的收藏与历史记录，确定退出？',
      success: (res) => {
        if (res.confirm) {
          cache.clearUserInfo();
          cache.clearCollection();
          app.globalData.comicUserInfo = {};

          this.setData({
            Uavatar: '',
            userInfo: {},
          });
        }
      },
    });
  },
});
