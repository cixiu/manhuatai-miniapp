const userCenterApi = require('../../api/user-center');
const cache = require('../../utils/cache');
const app = getApp();

Page({
  data: {
    userInfo: {},
    nickname: '',
  },
  onLoad: function() {
    console.log('load');
    this.setData({
      userInfo: app.globalData.comicUserInfo,
      nickname: app.globalData.comicUserInfo.Uname,
    });
  },
  // 输入时触发
  inputChange: function(e) {
    this.setData({
      nickname: e.detail.value,
    });
  },
  // 确定修改
  confirmModify: function() {
    if (!this.data.nickname) {
      return;
    }

    const userInfo = this.data.userInfo;
    const requestData = {
      openid: userInfo.openid,
      myuid: userInfo.Uid,
      action: 'nickname',
      value: this.data.nickname,
    };

    wx.showLoading({
      title: '正在接入...',
      mask: true,
    });

    // 发送请求，修改昵称
    userCenterApi.setComicUserInfo(
      requestData,
      (res) => {
        if (res.data.status) {
          this.setData({
            'userInfo.Uname': this.data.nickname,
          });

          app.globalData.comicUserInfo = this.data.userInfo;
          app.globalData.isModifyUserInfo = true;

          cache.saveUserInfo(this.data.userInfo);

          wx.showToast({
            title: '修改成功',
            success: () => {
              wx.navigateBack({
                delta: 1,
              });
            },
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          });
        }
      },
      () => {
        wx.showToast({
          title: '数据请求失败，请重试',
          icon: 'none',
        });
      },
    );
  },
});
