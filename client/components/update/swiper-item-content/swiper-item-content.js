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
      const neededList = updateData.info.slice(0, 100);
      this.setData({
        list: filter.fitlerM2x1Format(neededList, 'feature_img'),
        loading: false,
      });
    },
  },
});
