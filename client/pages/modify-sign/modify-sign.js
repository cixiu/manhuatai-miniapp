const userCenterApi = require('../../api/user-center');
const cache = require('../../utils/cache');
const app = getApp();

Page({
  data: {
    userInfo: {},
    sign: '',
  },
  onLoad: function() {
    this.setData({
      userInfo: app.globalData.comicUserInfo,
      sign: app.globalData.comicUserInfo.Usign,
    });
  },
  // 输入时触发
  inputChange: function(e) {
    this.setData({
      sign: e.detail.value,
    });
  },
  // 确定修改
  confirmModify: function() {
    if (!this.data.sign) {
      return;
    }

    const userInfo = this.data.userInfo;
    const requestData = {
      openid: userInfo.openid,
      myuid: userInfo.Uid,
      action: 'signature',
      value: this.data.sign,
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
            'userInfo.Usign': this.data.sign,
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
