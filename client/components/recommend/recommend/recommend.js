const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    loading: true,
    // jumpData: {},  // 活动跳转为webview页面，暂时不做处理
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
      // let jumpData = {};
      let recommendNew = {};
      let recommendAuthor = {};
      let recommendGood = {};
      let recommendNoMoreList = [];

      bookList.forEach((item) => {
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

      // bookList.slice(0, 5).forEach((item) => {
      //   if (item.config.display_type === '20') {
      //     jumpData = item;
      //     if (!/^\//.test(jumpData.comic_info[0].img_url)) {
      //       jumpData.comic_info[0].img_url =
      //         '/' + jumpData.comic_info[0].img_url;
      //     }
      //   }
      // });

      recommendNoMoreList = bookList.slice(1);

      // recommendNoMoreList = bookList.slice(5).filter((item) => {
      //   return (
      //     item.title !== '频道佳作' &&
      //     item.title !== '台长推荐' &&
      //     item.title !== '登台新作'
      //   );
      // });

      this.setData({
        loading: false,
        // jumpData,
        recommendNew,
        recommendAuthor,
        recommendGood,
        recommendNoMoreList,
      });
    },
  },
});
