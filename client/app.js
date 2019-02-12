//app.js
const configData = require('./data/configData');
const apiUser = require('./api/user');
const apiLogin = require('./api/login');
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
    if (!userInfo.Uid) {
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
      // 如果用户信息的auth_code时间已经过期了，则需要重新更新一下auth_code
      if (userInfo.auth_data.expiry < +new Date()) {
        return this.refreshComicUserInfo(userInfo);
      }

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
  // 更新登录用户信息，主要用于更新过期的auth_code
  refreshComicUserInfo: function(userInfo) {
    const requestData = {
      openid: userInfo.openid,
      myuid: userInfo.Uid,
      autologo: 1,
    };
    const filter = require('./utils/filter');
    // 获取登录用户的信息
    apiLogin.getComicUserInfo(requestData, (res) => {
      const userInfo = res.data;

      this.globalData.comicUserInfo = userInfo;
      cache.saveUserInfo(userInfo);
    });
  },
  globalData: {
    systemInfo: null,
    comicUserInfo: null,
    isNavigateBack: false, // 是否是路由回退 用于在登录后使用
    isModifyUserInfo: false, // 是否修改了用户资料 用于在用户资料修改后使用
    config: configData,
    imgHost: 'https://image.samanlehua.com',
    comic_share_url: '', // 漫画的来源和分享地址 在漫画评论和回复中需要使用
    comicChapterList: [], // 漫画的章节列表
    fatherComment: {}, // 父级评论
    replyComment: {}, // 要回复的评论
  },
});
