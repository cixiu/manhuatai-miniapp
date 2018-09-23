const filter = require('../../../utils/filter');

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
        list: filter.fitlerM2x1Format(updateData.info.slice(0, 100), 'feature_img'),
        loading: false,
      })
    },
  },
});
