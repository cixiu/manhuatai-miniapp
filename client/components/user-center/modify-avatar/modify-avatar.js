Component({
  ready: function() {
    this.modal = this.selectComponent('#modal');
    this.animationContent = wx.createAnimation();

    this.animationContent
      .translate3d(0, 0, 0)
      .step({ duration: 200, timingFunction: 'ease-in-out' });

    this._setAnimation();
  },
  methods: {
    chooseImg: function() {
      // 漫画台后台api不支持小程序的图片上传
      wx.showToast({
        title: '头像修改不支持，请使用漫画台app应用进行修改',
        icon: 'none',
      });
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
