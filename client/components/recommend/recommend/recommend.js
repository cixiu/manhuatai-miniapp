const apiHome = require('../../../api/home.js');

const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    loading: true,
    // jumpData: {},  // 活动跳转为webview页面，暂时不做处理
    isRefresh: false,
    recommendNoMoreList: [],
  },
  properties: {
    swiperHeight: String,
    // recommendData: {
    //   type: Object,
    //   value: {},
    //   observer: function(newVal) {
    //     if (newVal && newVal.book) {
    //       this._setRecommendList(newVal);
    //     }
    //   },
    // },
  },
  ready: function() {
    this.isUpper = true;
    this._getRecommendList();
  },
  methods: {
    handleScroll: function(e) {
      if (e.detail.scrollTop === 0) {
        this.isUpper = true;
      } else {
        this.isUpper = false;
      }
    },
    handleTouchStart: function(e) {
      this.startPageY = e.changedTouches[0].pageY;
    },
    handleTouchEnd: function(e) {
      this.endPageY = e.changedTouches[0].pageY;
      const diffY = this.endPageY - this.startPageY;
      // console.log(this.isUpper, diffY);
      if (this.isUpper && diffY > 100) {
        clearTimeout(this.refreshTimer);
        this.setData(
          {
            isRefresh: true,
          },
          function() {
            this.refreshTimer = setTimeout(() => {
              this._getRecommendList();
            }, 500);
          },
        );
      }
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setRecommendList: function(recommendData) {
      // 将漫画台漫画头条, 精品小说, 游戏专区, 独家专栏, 独家策划的book_id过滤掉
      const bookList = recommendData.book.filter((item) => {
        if (item.book_id === 5035) return false;
        if (item.book_id === 4938) return false;
        if (item.book_id === 5072) return false;
        if (item.book_id === 3743) return false;
        if (item.book_id === 9669) return false;
        if (item.book_id === 8833) return false;
        return true;
      });

      // let jumpData = {};
      let recommendBanner = {};
      // let recommendNew = {};
      // let recommendAuthor = {};
      // let recommendGood = {};
      let recommendNoMoreList = [];

      bookList.forEach((item) => {
        if (item.title.includes('安卓')) {
          item.comic_info = item.comic_info.splice(0, 6);
          recommendBanner = item;
        }

        // if (item.title === '登台新作') {
        //   recommendNew = item;
        // }

        // if (item.title === '台长推荐') {
        //   recommendAuthor = item;
        // }

        // if (item.title === '频道佳作') {
        //   recommendGood = item;
        // }
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
        recommendBanner,
        // recommendNew,
        // recommendAuthor,
        // recommendGood,
        recommendNoMoreList,
      });
    },
    _getRecommendList() {
      apiHome.getBookList('', 132, (res) => {
        this.setData({
          recommendData: res.data.data,
          isRefresh: false,
        });
        this._setRecommendList(res.data.data);
      });
    },
  },
});
