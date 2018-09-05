const utils = require('../../../utils/util');

const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    bannerSwiperHeight: 0,
  },
  properties: {
    swiperHeight: String,
    recommendData: {
      type: Object,
      value: {},
    },
  },
});
