const app = getApp()

Component({
  data: {
    imgHost: app.globalData.imgHost,
    bannerSwiperHeight: 0,
  },
  properties: {
    recommendBanner: {
      type: Object,
      value: {},
    },
  },
  methods: {
    imageLoad: function(e) {
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
