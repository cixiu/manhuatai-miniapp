const loginApi = require('../../api/login');
const cache = require('../../utils/cache');

const app = getApp();

Page({
  data: {
    imgCode: '',
    content: '',
    showValidateModal: false,
    phoneNumber: 0,
    validateCode: 0,
    loading: false,
  },
  onLoad: function() {
    // 设置图片点击的次数 默认没有点击
    this.imgTapTimes = 0;
  },
  // 获取验证码
  getValidateCode: function() {
    if (String(this.data.phoneNumber).length !== 11) {
      wx.showToast({
        title: '无效的手机号',
        icon: 'none',
      });
      return;
    }
    const requestData = {
      mobile: this.data.phoneNumber,
      refresh: 0,
    };
    this.setData({
      loading: true,
    });
    loginApi.sendsms(requestData, (res) => {
      this.setData({
        loading: false,
      });
      if (res.data.data.Content) {
        // 拼凑出图形验证码的base64格式的url
        const imgCodeBase64 = 'data:image/jpg;base64,' + res.data.data.Image;
        this.setData({
          showValidateModal: true,
          imgCode: imgCodeBase64,
          content: res.data.data.Content,
        });
      }
      if (res.data.status === 0) {
        wx.showToast({
          title: '短信发送成功',
        });
      }
      // 操作过于频繁时，提示我们
      if (res.data.status === 1021) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        });
      }
    });
  },
  // 输入手机号码
  inputPhoneNumber: function(e) {
    this.setData({
      phoneNumber: e.detail.value,
    });
  },
  // 输入验证码
  inputValidateCode: function(e) {
    this.setData({
      validateCode: e.detail.value,
    });
  },
  // 图形验证成功
  validateSuccess: function() {
    this.setData({
      showValidateModal: false,
      imgCode: '',
      content: '',
    });
    wx.showToast({
      title: '短信发送成功',
    });
  },
  // 取消图形验证
  validateCancel: function() {
    this.setData({
      showValidateModal: false,
      imgCode: '',
      content: '',
    });
  },
  // 登录
  login: function() {
    if (String(this.data.phoneNumber).length !== 11) {
      wx.showToast({
        title: '无效的手机号',
        icon: 'none',
      });
      return;
    }
    if (!this.data.validateCode) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
      });
      return;
    }
    wx.showLoading({
      title: '登录中...',
    });
    const requestData = {
      mobile: this.data.phoneNumber,
      vcode: this.data.validateCode,
    };
    loginApi.mobilebind(requestData, (res) => {
      if (res.data.status === 0) {
        const token = res.data.data.appToken;
        loginApi.getComicUserInfo(token, (resp) => {
          app.globalData.comicUserInfo = resp.data;
          cache.saveUserInfo(resp.data);
          wx.hideLoading({
            success: () => {
              wx.navigateBack({
                delta: 1,
              });
            },
          });
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        });
      }
    });
  },
});
