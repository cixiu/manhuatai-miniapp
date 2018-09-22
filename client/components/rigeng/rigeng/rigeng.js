const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    loading: true,
    bannerListData: {},
    moreRigengData: {}
  },
  properties: {
    swiperHeight: String,
    rigengData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.book) {
          this._setRigengBannerListData(newVal);
        }
      },
    },
  },
  methods: {
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setRigengBannerListData: function(rigengData) {
      const bookList = rigengData.book;
      const bannerListData = rigengData.book[2];
      const moreRigengData = bookList[bookList.length - 1];
      if (moreRigengData.comic_info.length > 4) {
        moreRigengData.comic_info.length = 4; // 只取4条数据
      }

      let comic_info = [];
      bookList.slice(3, bookList.length - 1).forEach((item) => {
        comic_info = comic_info.concat(item.comic_info)
      });
      bannerListData.comic_info = bannerListData.comic_info.concat(comic_info);

      this.setData({
        bannerListData,
        moreRigengData,
        loading: false,
      });
      console.log(this.data)
    },
  },
});
