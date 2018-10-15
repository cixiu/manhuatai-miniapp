const userCenterApi = require('../../../api/user-center');
const cache = require('../../../utils/cache');

const app = getApp();

const date = new Date();
const years = [];
const months = [];
const days = [];

for (let i = 1979; i <= date.getFullYear(); i++) {
  years.push(i);
}

for (let i = 1; i <= 12; i++) {
  months.push(i);
}

for (let i = 1; i <= 31; i++) {
  days.push(i);
}

Component({
  data: {
    userInfo: {},
    years,
    months,
    days,
    value: [1, 2, 1],
  },
  ready: function() {
    // TODO:暂时不考虑闰年和大小月
    const Ubirthday = app.globalData.comicUserInfo.Ubirthday; // 时间戳
    this.newBirthday = Ubirthday;
    const birthday = new Date(Ubirthday);

    const birthYear = birthday.getFullYear();
    const birthMonth = birthday.getMonth() + 1;
    const birthDay = birthday.getDate();

    const indexYear = this.data.years.findIndex((item) => {
      return item === birthYear;
    });
    const indexMonth = this.data.months.findIndex((item) => {
      return item === birthMonth;
    });
    const indexDay = this.data.days.findIndex((item) => {
      return item === birthDay;
    });

    this.setData({
      userInfo: app.globalData.comicUserInfo,
      value: [indexYear, indexMonth, indexDay],
    });

    this.modal = this.selectComponent('#modal');
    this.animationContent = wx.createAnimation();

    this.animationContent
      .translate3d(0, 0, 0)
      .step({ duration: 200, timingFunction: 'ease-in-out' });

    this._setAnimation();
  },
  methods: {
    bindChange: function(e) {
      const val = e.detail.value;
      const year = this.data.years[val[0]];
      const month = this.data.months[val[1]];
      const day = this.data.days[val[2]];
      const newBirthday = +new Date(`${year}-${month}-${day}`);
      this.newBirthday = newBirthday;
    },
    // 修改年龄
    changeAge: function() {
      const userInfo = this.data.userInfo;
      const newBirthdayStr = this.newBirthday + ''; // 将数字转成字符串
      const requestData = {
        openid: userInfo.openid,
        myuid: userInfo.Uid,
        action: 'birthday',
        // 后台api接受的修改的时间戳是删除了最后3位的时间戳
        value: newBirthdayStr.substring(0, newBirthdayStr.length - 3),
      };

      wx.showLoading({
        title: '正在接入...',
        mask: true,
      });

      // 发送请求，修改年龄
      userCenterApi.setComicUserInfo(
        requestData,
        (res) => {
          this.setData({
            'userInfo.Ubirthday': this.newBirthday,
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
    // 取消修改
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
