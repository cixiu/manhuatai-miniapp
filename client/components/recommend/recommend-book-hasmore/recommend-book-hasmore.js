const filter = require('../../../utils/filter');
const app = getApp();
const LENGTH = 6;

Component({
  data: {
    imgHost: app.globalData.imgHost,
    comicList: [],
    start: 0,
    end: 6,
    switchNumber: 0,
  },
  properties: {
    recommendBook: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comic_info) {
          this._setComicList(newVal);
        }
      },
    },
  },
  methods: {
    // 切换推荐的显示列表
    switchRecommenList: function() {
      const recommendBook = this.properties.recommendBook;
      const times = recommendBook.comic_info.length / LENGTH;
      this.data.switchNumber++;
      if (this.data.switchNumber === times) {
        this.data.switchNumber = 0;
        this.data.start = 0;
        this.data.end = 6;
      } else {
        this.data.start = this.data.end;
        this.data.end = this.data.end + LENGTH;
      }
      this.filterComic(recommendBook);
    },
    // 过滤需要显示的数据
    filterComic: function(recommendBook) {
      const comicList = filter.filterDataList(
        recommendBook,
        this.data.start,
        this.data.end,
      );
      this.setData({
        comicList,
      });
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setComicList: function(recommendBook) {
      this.filterComic(recommendBook);
    },
  },
});
