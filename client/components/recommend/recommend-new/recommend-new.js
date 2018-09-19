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
    // 跳转至漫画详情页
    goToComiceDetail: function(e) {
      const comicItem = e.currentTarget.dataset.item;
      const comicId = comicItem.comic_id;
      wx.navigateTo({
        url: `/pages/comic-detail/comic-detail?comicId=${comicId}`,
      });
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

      const recommendNew = this.properties.recommendNew;
      const times = recommendNew.comic_info.length / LENGTH;
      this.data.switchNumber++;
      if (this.data.switchNumber === times) {
        this.data.switchNumber = 0;
        this.data.start = 0;
        this.data.end = 4;
      } else {
        this.data.start = this.data.end;
        this.data.end = this.data.end + LENGTH;
      }
      this.filterComic(recommendNew);
    },
    // 过滤需要显示的数据
    filterComic: function(recommendNew) {
      const comicList = filter.filterDataList(
        recommendNew,
        this.data.start,
        this.data.end,
      );
      this.setData({
        comicList,
      });
    },
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setComicList: function(recommendNew) {
      this.filterComic(recommendNew);
    },
  },
});
