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
    loadError: function(e) {
      this.setData({
        placeholderUrl: '../../../img/pic_cache.png',
      });
    },
  },
});
