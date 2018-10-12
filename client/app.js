//app.js
const configData = require('./data/configData');
const apiUser = require('./api/user');
const cache = require('./utils/cache');

App({
  onLaunch: function() {
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      },
    });

    const userInfo = cache.loadUserInfo();
    if (!userInfo.Uname) {
      // 此为漫画台测试的用户信息，目的是获取一些api接口需要的authcode
      apiUser.getComicUserInfo((res) => {
        this.globalData.comicUserInfo = res.data;
        //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.comicUserInfoCallback) {
          this.comicUserInfoCallback(res.data);
        }
      });
    } else {
      this.globalData.comicUserInfo = userInfo;
    }


    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.guessUserInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    systemInfo: null,
    comicUserInfo: null,
    config: configData,
    imgHost: 'https://image.samanlehua.com',
    comicChapterList: [],
    fatherComment: {},
  },
});
