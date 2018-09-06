const utils = require('../../../utils/util');

const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    recommendHasMoreList: [],
    recommendNoMoreList: [],
  },
  properties: {
    swiperHeight: String,
    recommendData: {
      type: Object,
      value: {},
    },
  },
  ready: function() {
    const bookList = this.properties.recommendData.book;
    this.setData({
      recommendHasMoreList: bookList.slice(3, 5),
      recommendNoMoreList: bookList.slice(5),
    })
  }
});
