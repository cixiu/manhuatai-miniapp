Component({
  alreadyShow: false,
  url: '',
  properties: {
    src: {
      type: String,
      value: '',
      observer: function(newVal) {
        if (newVal && this.data.alreadyShow) {
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
  },
  ready: function() {
    // observer的元素必须有高度 不然不会触发回调
    this.createIntersectionObserver()
      .relativeToViewport({ bottom: 300 })
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
      this.createSelectorQuery()
        .select('.lazy-load')
        .boundingClientRect((rect) => {
          // 因为createIntersectionObserver需要高度，所以图片设置了一个默认的高度
          // 之后图片加载后通过boundingClientRect获取的高度可能不正确 最好通过width计算
          wx.nextTick(() => {
            const computedHeight = (rect.width / e.detail.width) * e.detail.height;
            this.triggerEvent('load', { height: computedHeight });
          });
        })
        .exec();
    },
  },
});
