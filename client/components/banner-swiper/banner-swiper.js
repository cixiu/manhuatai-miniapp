const filter = require('../../utils/filter');
const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    bannerSwiperHeight: '448rpx',
    bannerList: [],
  },
  properties: {
    bannerData: {
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
        .select('.banner-item')
        .boundingClientRect((rect) => {
          this.setData({
            bannerSwiperHeight: rect.height + 'px',
          });
        })
        .exec();
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setBannerList: function(bannerData) {
      this.setData({
        bannerList: filter.filterDataList(bannerData),
      });
    }
  },
});
