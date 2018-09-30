const filter = require('../../../utils/filter');
const bookData = require('./data');
const app = getApp();

const LENGTH = 4;
const InitHeight = 216; // rpx

Component({
  data: {
    imgHost: app.globalData.imgHost,
    comicList: [],
    itemWidth: '',
    comicImgHeight: InitHeight,
    height: InitHeight,
    start: 0,
    end: LENGTH,
    switchNumber: 0,
  },
  properties: {
    book: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.comic_info) {
          this._setComicList(newVal);
          // 给lzay-load懒加载设置height占位
          for (const item of bookData.heightList) {
            if (item.title === newVal.title) {
              this.setData({
                comicImgHeight: item.height,
                height: item.height,
              });
              break;
            }
          }
        }
      },
    },
  },
  ready: function() {
    this.animation = wx.createAnimation();
  },
  methods: {
    // 图片加载完毕
    imgLoad: function(e) {
      // FIXME: 待删除
      // if (e.currentTarget.dataset.index === 0) {
      //   this.setData({
      //     comicImgHeight: e.detail.height,
      //   });
      // }
    },
    // 切换推荐的显示列表
    switchRecommenList: function() {
      // 以fade-out-in模式切换，
      this.animation
        .opacity(0)
        .step({ duration: 20, timingFunction: 'step-start' }) // 以20ms作为一帧的运动时间
        .opacity(1)
        .step({ duration: 500, timingFunction: 'ease-in-out' });

      this.setData({
        animation: this.animation.export()
      });

      const book = this.properties.book;
      const times = book.comic_info.length / LENGTH;
      this.data.switchNumber++;
      if (this.data.switchNumber === times) {
        this.data.switchNumber = 0;
        this.data.start = 0;
        this.data.end = LENGTH;
      } else {
        // 此处的data并不需要响应在视图上，所以不需要使用setData方法
        this.data.start = this.data.end;
        this.data.end = this.data.end + LENGTH;
      }
      this.filterComic(book);
    },
    // 过滤需要显示的数据 并设置width
    filterComic: function(book) {
      let itemWidth;
      let comicList = filter.filterDataList(
        book,
        this.data.start,
        this.data.end,
      );
      const bookHorizonratio = filter.convertRatioFormat(
        book.config.horizonratio,
      );
      const screenWidthRPX = 750; // 设备的宽度 规定屏幕宽为750rpx
      if (bookHorizonratio.ratio === 2) {
        const bookItemsWidth = screenWidthRPX - 20 * 2 - (LENGTH / 2 - 1) * 20;
        itemWidth = bookItemsWidth / (LENGTH / 2) + 'rpx';
      } else {
        // 否则排成1排
        const bookItemsWidth = screenWidthRPX - 20 * 2 - (LENGTH - 1) * 20;
        itemWidth = bookItemsWidth / LENGTH + 'rpx';
      }

      this.setData({
        itemWidth,
        comicList,
      });
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setComicList: function(book) {
      this.filterComic(book);
    },
  },
});
