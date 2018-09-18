Component({
  data: {
    loading: true,
  },
  properties: {
    swiperHeight: Number,
    rankData: {
      type: Array,
      value: [],
      observer: function(newVal) {
        if (newVal && newVal.length > 0) {
          this.setData({
            loading: false,
          });
        }
      },
    },
  },
});
