Component({
  ready: function() {
    this.maskTaped = false;
    this.animationMask = wx.createAnimation();

    this.animationMask
      .opacity(1)
      .step({ duration: 200, timingFunction: 'ease-in-out' });

    this.setData({
      animationMask: this.animationMask.export(),
    });
  },
  methods: {
    // 取消头像修改
    cancelMask: function() {
      if (this.maskTaped) {
        return;
      }
      this.maskTaped = true;

      this.animationMask
        .opacity(0)
        .step({ duration: 200, timingFunction: 'ease-in-out' });

      this.setData({
        animationMask: this.animationMask.export(),
      });

      this.triggerEvent('cancel');
    },
  },
});
