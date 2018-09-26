Component({
  data: {
    placeholderUrl: '',
  },
  properties: {
    comment: {
      type: Object,
      value: {},
    },
  },
  methods: {
    // 图片加载失败时，使用默认的占位图代替
    loadError: function(e) {
      this.setData({
        placeholderUrl: '/img/pic_cache.png',
      });
    },
  },
});
