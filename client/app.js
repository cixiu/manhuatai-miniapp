//app.js
const configData = require('./data/configData');
const apiUser = require('./api/user');

App({
  onLaunch: function() {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      },
    });

    // 此为漫画台测试的用户信息，目的是获取一些api接口需要的authcode
    apiUser.getComicUserInfo((res) => {
      this.globalData.comicUserInfo = res.data;
      //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.comicUserInfoCallback) {
        this.comicUserInfoCallback(res.data);
      }
    });
    // 异步请求可能在Page的onLoad之后
    // 获取漫画台主要的全局数据
    // wx.request({
    //   method: 'GET',
    //   url: 'https://main-globalapi.yyhao.com/app_api/v5/getconfig/',
    //   data: {
    //     platformname: 'android',
    //     productname: 'mht'
    //   },
    //   success: (res) => {
    //     this.globalData.config = res.data
    //   }
    // })
  },
  globalData: {
    systemInfo: null,
    comicUserInfo: null,
    config: configData,
    imgHost: 'https://image.samanlehua.com',
    comicChapterList: []
  },
});
