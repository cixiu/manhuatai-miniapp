Component({
  externalClasses: ['border-radius'], // 用于在组件外部控制图片的圆角的class
  data: {
    alreadyShow: false,
    loaded: false,
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
        if (newVal && this.data.alreadyShow) {
          this.setData({
            url: newVal,
            loaded: false,
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
        if (!this.data.alreadyShow) {
          this.setData({
            alreadyShow: true,
            url: rect.dataset.src,
          });
        }
      });
  },
  methods: {
    imageLoad: function(e) {
      // TODO: 如果图片已经缓存过，导致图片加载速度很快，loaded的变化不会反应在视图层，待解决
      this.setData({
        loaded: true,
      });
      // FIXME: 待删除
      // this.createSelectorQuery()
      //   .select('.lazy-load')
      //   .boundingClientRect((rect) => {
      //     // 因为createIntersectionObserver需要高度，所以图片设置了一个默认的高度
      //     // 之后图片加载后通过boundingClientRect获取的高度可能不正确 最好通过width计算
      //     wx.nextTick(() => {
      //       const computedHeight = (rect.width / e.detail.width) * e.detail.height;
      //       this.triggerEvent('load', { height: computedHeight });
      //     });
      //   })
      //   .exec();

      // 触发lazy-load的load事件
      this.triggerEvent('load', e);
    },
    handleTap: function(e) {
      this.triggerEvent('lazytap', e);
    },
    handleError: function(e) {
      this.triggerEvent('error', e);
    },
  },
});
