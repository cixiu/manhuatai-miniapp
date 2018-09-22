const filter = require('../../utils/filter');
const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
  },
  properties: {
    comicItem: {
      type: Object,
      value: {},
    },
    showLabel: {
      type: Boolean,
      value: false,
    },
  },
});
