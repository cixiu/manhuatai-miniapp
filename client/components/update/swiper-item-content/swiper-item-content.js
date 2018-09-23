Component({
  data: {
    loading: true,
    list: [],
  },
  properties: {
    swiperHeight: Number,
    updateData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comicUpdateDate) {
          this._setData(newVal);
        }
      },
    },
  },
  methods: {
    _setData: function(updateData) {
      this.setData({
        list: updateData.info.slice(0, 100),
        loading: false,
      })
    },
  },
});
