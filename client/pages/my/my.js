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
  // 监听用户点击页面内转发按钮
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: '漫画杂志阅读神器',
      path: '/pages/home/home',
      imageUrl: '../../img/share.jpg',
    };
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
