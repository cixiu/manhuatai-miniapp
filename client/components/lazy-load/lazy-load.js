Component({
  externalClasses: ['border-radius'], // 用于在组件外部控制图片的圆角的class
  data: {
    alreadyShow: false,
    url: '',
  },
  properties: {
    mode: {
      type: String,
      value: 'widthFix',
    },
    src: {
      type: String,
      value: '',
      observer: function(newVal) {
        if (newVal && this.alreadyShow) {
          this.setData({
            url: newVal,
          });
        }
      },
    },
    // 图片的占位高度
    height: {
      type: Number,
      value: 200,
    },
    bottom: {
      type: Number,
      value: 300,
    },
  },
  ready: function() {
    // observer的元素必须有高度 不然不会触发回调
    this.createIntersectionObserver()
      .relativeToViewport({ bottom: this.data.bottom })
      .observe('.lazy-load', (rect) => {
        if (!this.alreadyShow) {
          this.alreadyShow = true;
          this.setData({
            url: rect.dataset.src,
          });
        }
      });
  },
  methods: {
    imageLoad: function(e) {
      // 触发lazy-load的load事件
      this.triggerEvent('load', e);
    },
    handleTap: function(e) {
      this.triggerEvent('lazytap', e);
    },
    handleError: function(e) {
      this.setData({
        url: './pic_cache.png',
      });
      this.triggerEvent('error', e);
    },
  },
});
