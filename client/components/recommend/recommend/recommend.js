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
      let jumpData = {};
      let recommendNew = {};
      let recommendAuthor = {};
      let recommendGood = {};
      bookList.forEach((item) => {
        if (item.title === '漫画台跳转') {
          jumpData = item;
        }
        if (item.title === '登台新作') {
          recommendNew = item;
        }
        if (item.title === '台长推荐') {
          recommendAuthor = item;
        }
        if (item.title === '频道佳作') {
          recommendGood = item;
        }
      });
      if (!/^\//.test(jumpData.comic_info[0].img_url)) {
        jumpData.comic_info[0].img_url = '/' + jumpData.comic_info[0].img_url;
      }
      this.setData({
        loading: false,
        jumpData,
        recommendNew,
        recommendAuthor,
        recommendGood,
        recommendNoMoreList: bookList.slice(5),
      });
    },
  },
});
