const userCenterApi = require('../../../api/user-center');
const cache = require('../../../utils/cache');

const app = getApp();

Component({
  data: {
    userInfo: {},
  },
  ready: function() {
    this.setData({
      userInfo: app.globalData.comicUserInfo,
    });

    this.modal = this.selectComponent('#modal');
    this.animationContent = wx.createAnimation();

    this.animationContent
      .translate3d(0, 0, 0)
      .step({ duration: 200, timingFunction: 'ease-in-out' });

    this._setAnimation();
  },
  methods: {
    // 修改性别
    changeGender: function(e) {
      const genderValue = e.currentTarget.dataset.value;
      const userInfo = this.data.userInfo;
      const requestData = {
        openid: userInfo.openid,
        myuid: userInfo.Uid,
        action: 'sex',
        value: genderValue,
      };

      wx.showLoading({
        title: '正在接入...',
        mask: true,
      });

      // 发送请求，修改性别
      userCenterApi.setComicUserInfo(
        requestData,
        (res) => {
          this.setData({
            'userInfo.Usex': Number(genderValue),
          });

          app.globalData.comicUserInfo = this.data.userInfo;
          app.globalData.isModifyUserInfo = true;

          cache.saveUserInfo(this.data.userInfo);
          this.triggerEvent('ok');

          wx.showToast({
            title: '修改成功',
          });
        },
        () => {
          wx.showToast({
            title: '数据请求失败，请重试',
            icon: 'none',
          });
        },
      );
    },
    // 取消头像修改
    cancelMask: function() {
      clearTimeout(this.timer);

      this.animationContent
        .translate3d(0, '100%', 0)
        .step({ duration: 200, timingFunction: 'ease-in-out' });

      this._setAnimation();

      this.timer = setTimeout(() => {
        this.triggerEvent('cancel');
      }, 200);
    },
    // 取消
    cancel: function() {
      this.modal.cancelMask();
    },
    _setAnimation: function() {
      this.setData({
        animationContent: this.animationContent.export(),
      });
    },
  },
});
