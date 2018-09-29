const utils = require('../../../utils/util');

const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    loading: true,
    jumpData: {},
    recommendHasMoreList: [],
    recommendNoMoreList: [],
  },
  properties: {
    swiperHeight: String,
    recommendData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.book) {
          this._setRecommendList(newVal);
        }
      },
    },
  },
  methods: {
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setRecommendList: function(recommendData) {
      const bookList = recommendData.book;
      const jumpData = bookList[1];
      if (!/^\//.test(jumpData.comic_info[0].img_url)) {
        jumpData.comic_info[0].img_url = '/' + jumpData.comic_info[0].img_url;
      }
      this.setData({
        loading: false,
        jumpData,
        recommendHasMoreList: bookList.slice(3, 5),
        recommendNoMoreList: bookList.slice(5),
      });
    },
  },
});
