const filter = require('.././../../utils/filter');
const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    bannerSwiperHeight: '448rpx',
    bannerList: [],
  },
  properties: {
    recommendBanner: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        if (newVal && newVal.comic_info) {
          this._setBannerList(newVal);
        }
      }
    },
  },
  methods: {
    imageLoad: function() {
      this.createSelectorQuery()
        .selectAll('.banner-item')
        .boundingClientRect((rects) => {
          this.setData({
            bannerSwiperHeight: rects[0].height + 'px',
          });
        })
        .exec();
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setBannerList: function(recommendBanner) {
      this.setData({
        bannerList: filter.filterDataList(recommendBanner),
      });
    }
  },
});
