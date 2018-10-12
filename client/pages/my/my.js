const cache = require('../../utils/cache');

Page({
  data: {
    userInfo: {},
  },
  onLoad: function() {},
  onShow: function() {
    this.initSet();
    console.log('show');
  },
  initSet: function() {
    const userInfo = cache.loadUserInfo();
    if (userInfo.Uname) {
      this.setData({
        userInfo,
      });
    }
  },
  goToLogin: function() {
    if (this.data.userInfo.Uname) {
      wx.showToast({
        title: '前往个人资料',
        icon: 'none',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
});
