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
      const widthHeightRatio = filter.computedRatio(bookData.config.horizonratio);
      const percentWidth = 100;
      const length = comicList.length;
      const middle = 4;
      // 判断数组长度 设置对应的百分比width
      if (length < middle) {
        itemWidth = (percentWidth - 1) / length;
      } else if (length > middle && length < 2 * middle && length % 2 !== 0) {
        itemWidth = (percentWidth - 1) / ((length - 1) / 2);
        comicList.pop();
      } else if (length > middle && length > 2 * middle) {
        // length > 8 则只取随机的4项
        comicList.sort(() => Math.random() - 0.5).length = 4;
        itemWidth = (percentWidth - 1) / (middle / 2);
      } else {
        itemWidth = (percentWidth - 1) / (length / 2);
      }
      // 根据宽高比设置height 单位rpx
      const lazyHeight = (itemWidth / 100) * 750 / widthHeightRatio;

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
