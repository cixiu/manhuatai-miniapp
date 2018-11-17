const filter = require('../../../utils/filter');

const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    comicList: [],
    itemWidth: '',
    lazyHeight: 0,
    switchNumber: 0,
  },
  properties: {
    book: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comic_info) {
          this._setComicList(newVal);
        }
      },
    },
  },
  ready: function() {
    this.animation = wx.createAnimation();
  },
  methods: {
    // 切换推荐的显示列表
    switchRecommenList: function() {
      // 以fade-out-in模式切换，
      this.animation
        .opacity(0)
        .step({ duration: 20, timingFunction: 'step-start' }) // 以20ms作为一帧的运动时间
        .opacity(1)
        .step({ duration: 500, timingFunction: 'ease-in-out' });

      this.setData({
        animation: this.animation.export(),
      });

      const book = this.properties.book;
      const times = book.comic_info.length / this.diff;
      this.data.switchNumber++;

      if (this.data.switchNumber === times) {
        this.data.switchNumber = 0;
        this.start = 0;
        this.end = this.diff;
      } else {
        // 此处的data并不需要响应在视图上，所以不需要使用setData方法
        this.start = this.end;
        this.end = this.end + this.diff;
      }

      this.filterComic(book);
    },
    // 过滤需要显示的数据 并设置width
    filterComic: function(book) {
      const comicList = filter.filterDataList(book, this.start, this.end);

      this.setData({
        comicList,
      });
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setComicList: function(book) {
      /* 初始化图片显示数量的数据 */
      this.start = 0; // 显示漫画列表的开始数
      this.end = 4; // 显示漫画列表的结束数
      this.diff = 4; // 切换时的显示的数据差

      let itemWidth = 0;
      const comicList = book.comic_info;
      const widthHeightRatio = filter.computedRatio(book.config.horizonratio);
      const percentWidth = 100 - 1;

      // 如果图片的比例是2：1，排成2排，则显示4张图片
      if (widthHeightRatio === 2) {
        this.end = 4;
        this.diff = 4;
        itemWidth = percentWidth / 2;
      }

      // 如果图片的比例不是2：1,排成1排
      if (widthHeightRatio !== 2) {
        if (comicList.length % 3 === 0) {
          this.end = 3;
          this.diff = 3;
          itemWidth = percentWidth / 3;
        } else {
          this.end = 4;
          this.diff = 4;
          itemWidth = percentWidth / 4;
        }
      }

      // 通过宽度计算高度
      const lazyHeight = ((itemWidth / 100) * 750) / widthHeightRatio;

      this.setData({
        lazyHeight,
        itemWidth: `${itemWidth}%`,
      });

      this.filterComic(book);
    },
  },
});
