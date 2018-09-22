const filter = require('../../utils/filter');

Component({
  data: {
    bannerList: [],
  },
  properties: {
    bookData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comic_info) {
          this._setBannerList(newVal);
        }
      },
    },
  },
  methods: {
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setBannerList: function(bookData) {
      this.setData({
        bannerList: filter.filterDataList(bookData),
      });
    },
  },
});
