const loginApi = require('../../api/login');

Component({
  data: {
    imgCode: '',
    content: '',
    loading: false,
  },
  properties: {
    phoneNumber: {
      type: Number,
      value: 0,
      observer: function(newVal) {
        if (newVal) {
          this.imgCodeData = {
            appId: 2,
            fontPoints: [],
            userIdentifier: newVal,
            verificaType: 2,
          };
        }
      },
    },
    imgCode: {
      type: String,
      value: '',
      observer: function(newVal) {
        if (newVal) {
          this.setData({
            imgCode: newVal,
          });
        }
      },
    },
    content: {
      type: String,
      value: '',
      observer: function(newVal) {
        if (newVal) {
          this.setData({
            content: newVal,
          });
        }
      },
    },
  },
  ready: function() {
    this.imgTapTimes = 0;
    // 获取图片验证码的位置
    this.createSelectorQuery()
      .select('.img-code-wrapper')
      .boundingClientRect((rect) => {
        // 图片验证码的距离left的距离
        this.imgCodeClientX = rect.left;
        // 图片验证码的距离top边的距离
        this.imgCodeClientY = rect.top;
      })
      .exec();
  },
  methods: {
    // 点击正确的示例文字
    tapImage: function(e) {
      this.imgTapTimes++;
      if (this.imgTapTimes === 3) {
        return;
      }
      const x = e.detail.x - this.imgCodeClientX;
      const y = e.detail.y - this.imgCodeClientY;
      this.imgCodeData.fontPoints.push({
        x: x * 2,
        y: y * 2,
      });
      if (this.imgTapTimes === 1) {
        this.setData({
          showFirst: true,
          firstWidth: x,
          firstHeight: y,
        });
      }
      if (this.imgTapTimes === 2) {
        this.setData({
          showSecond: true,
          secondWidth: x,
          secondHeight: y,
        });
      }
    },
    // 验证点击的图片验证码
    sendSms: function() {
      const requestData = {
        mobile: this.properties.phoneNumber,
        imgCode: JSON.stringify(this.imgCodeData),
        refresh: 0,
      };
      this.setData({
        loading: true,
      });
      loginApi.sendsms(requestData, (res) => {
        this.setData({
          loading: false,
        });
        this._setData(res);
      });
    },
    // 刷新图片验证码
    refreshImgCode: function() {
      loginApi.sendsms({ mobile: this.properties.phoneNumber }, (res) => {
        this._setData(res);
      });
    },
    // 隐藏图片验证组件
    hideValidateModal: function() {
      this.triggerEvent('cancel');
    },
    _setData: function(res) {
      if (res.data.data.Image) {
        this.imgTapTimes = 0;
        this.imgCodeData.fontPoints = [];
        const imgCodeBase64 = 'data:image/jpg;base64,' + res.data.data.Image;
        this.setData({
          imgCode: imgCodeBase64,
          content: res.data.data.Content,
          showFirst: false,
          showSecond: false,
        });
      }
      if (res.data.status === 0) {
        this.triggerEvent('success');
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        });
      }
    },
  },
});
