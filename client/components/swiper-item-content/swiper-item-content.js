const filter = require('../../utils/filter');
const data = require('./data');

const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    loading: true,
    bannerListData: {},
    moreRigengData: {},
    bookTypeList: [],
  },
  properties: {
    swiperHeight: String,
    comicSort: String,
    bookTypeData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.book) {
          this._setData(newVal);
        }
      },
    },
  },
  methods: {
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setData: function(bookTypeData) {
      const bookList = bookTypeData.book;
      const bookLength = bookList.length;
      let bannerListData = {};
      let moreRigengData = {};
      let comic_info = [];

      if (bookLength) {
        moreRigengData = bookList[bookList.length - 1];
        if (moreRigengData.comic_info.length > 4) {
          moreRigengData.comic_info.length = 4; // 只取4条数据
        }
        if (bookList.length > 3) {
          bannerListData = bookTypeData.book[2];
          bookList.slice(3, bookList.length - 1).forEach((item) => {
            comic_info = comic_info.concat(item.comic_info);
          });
          bannerListData.comic_info = bannerListData.comic_info.concat(
            comic_info,
          );
        }
      }

      const renqiData = data.bookTypes.renqi;
      const shoucangData = data.bookTypes.shoucang;
      const updatetimeData = data.bookTypes.updatetime;
      const wanjieData = data.bookTypes.wanjie;

      renqiData.list = filter.fitlerM3x4Format(bookTypeData.renqi)
      shoucangData.list =  filter.fitlerM3x4Format(bookTypeData.shoucang)
      updatetimeData.list =  filter.fitlerM3x4Format(bookTypeData.updatetime)
      wanjieData.list =  filter.fitlerM3x4Format(bookTypeData.wanjie)

      const bookTypeList = [renqiData, shoucangData, updatetimeData, wanjieData];

      this.setData({
        bannerListData,
        moreRigengData,
        loading: false,
        bookTypeList,
      });
    },
  },
});
