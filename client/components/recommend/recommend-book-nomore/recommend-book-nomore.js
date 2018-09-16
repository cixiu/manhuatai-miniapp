const filter = require('../../../utils/filter');
const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    comicList: [],
    itemWidth: '',
    comicImgHeight: 100,
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
    // 过滤需要显示的数据
    filterComic: function(recommendBook) {
      let itemWidth;
      let comicList = filter.filterDataList(recommendBook);
      const percentWidth = 100;
      const length = comicList.length;
      const middle = 4;
      // 判断数组长度 设置对应的百分比width
      if (length < middle) {
        itemWidth = (percentWidth - 1) / length;
      } else if (length > middle && length < 2 * middle && length % 2 !== 0) {
        itemWidth = (percentWidth - 1) / ((length - 1) / 2);
        comicList.pop();
      } else if (length > middle && length > 2 * middle) { // length > 8 则只取随机的4项
        comicList.sort(() => Math.random() - 0.5).length = 4;
        itemWidth = (percentWidth - 1) / (middle / 2);
      } else {
        itemWidth = (percentWidth - 1) / (length / 2);
      }

      this.setData({
        itemWidth,
        comicList,
      });
    },
    // 图片加载完毕
    imgLoad: function(e) {
      // this.createSelectorQuery()
      //   .select('.comic-img')
      //   .boundingClientRect((rect) => {
      //     this.setData({
      //       comicImgHeight: rect.height,
      //     });
      //   })
      //   .exec();
      // console.log(e.detail.height)
      // console.log(e.detail.height)
      this.setData({
        comicImgHeight: e.detail.height,
      });
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setComicList: function(recommendBook) {
      this.filterComic(recommendBook);
    },
  },
});
