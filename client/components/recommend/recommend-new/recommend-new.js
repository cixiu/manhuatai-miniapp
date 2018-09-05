const filter = require('../../../utils/filter');

const app = getApp();
const LENGTH = 4;

Component({
  data: {
    imgHost: app.globalData.imgHost,
    comicList: [],
    start: 0,
    end: 4,
    switchNumber: 0,
  },
  properties: {
    recommendNew: {
      type: Object,
      value: {},
    },
  },
  ready: function() {
    this.filterComic();
  },
  methods: {
    // 切换推荐的显示列表
    switchRecommenList: function() {
      const times = this.properties.recommendNew.comic_info.length / LENGTH;
      this.data.switchNumber++;
      if (this.data.switchNumber === times) {
        this.data.switchNumber = 0;
        this.data.start = 0;
        this.data.end = 4;
      } else {
        this.data.start = this.data.end;
        this.data.end = this.data.end + LENGTH;
      }
      this.filterComic();
    },
    // 过滤需要显示的数据
    filterComic: function() {
      const comicList = filter.filterDataList(
        this.properties.recommendNew.comic_info,
        this.data.start,
        this.data.end,
      );
      this.setData({
        comicList,
      });
    },
  },
});
