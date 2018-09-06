const filter = require('.././../../utils/filter');
const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    bannerSwiperHeight: 0,
    bannerList: [],
  },
  properties: {
    recommendBanner: {
      type: Object,
      value: {},
    },
  },
  ready: function() {
    const bannerList = this.properties.recommendBanner.comic_info;
    this.setData({
      bannerList: filter.filterDataList(bannerList),
    });
  },
  methods: {
    imageLoad: function() {
      this.createSelectorQuery()
        .selectAll('.banner-item')
        .boundingClientRect((rects) => {
          this.setData({
            bannerSwiperHeight: rects[0].height,
          });
        })
        .exec();
    },
  },
});
