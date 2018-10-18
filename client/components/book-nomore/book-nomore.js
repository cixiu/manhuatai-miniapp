const filter = require('../../utils/filter');
const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    comicList: [],
    itemWidth: '',
    lazyHeight: 0,
  },
  properties: {
    bookData: {
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
    // 过滤需要显示的数据
    filterComic: function(bookData) {
      let itemWidth;
      let comicList = filter.filterDataList(bookData);
      const widthHeightRatio = filter.computedRatio(
        bookData.config.horizonratio,
      );
      const percentWidth = 100 - 1;
      const length = comicList.length;
      // const middle = 4;

      if (length % 3 === 0) {
        itemWidth = percentWidth / 3;
        comicList = comicList.slice(0, 6);
      } else {
        if (length > 8 && length % 8 === 0) {
          itemWidth = percentWidth / 4;
          comicList = comicList.slice(0, 8);
        } else {
          itemWidth = percentWidth / 2;
          comicList = comicList.slice(0, 4);
        }
      }
      // 根据宽高比设置height 单位rpx
      const lazyHeight = ((itemWidth / 100) * 750) / widthHeightRatio;

      this.setData({
        lazyHeight,
        itemWidth,
        comicList,
      });
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setComicList: function(bookData) {
      this.filterComic(bookData);
    },
  },
});
