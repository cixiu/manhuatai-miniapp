const app = getApp();

Component({
  data: {
    imgHost: app.globalData.imgHost,
    loading: true,
  },
  properties: {
    swiperHeight: String,
    rigengData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.book) {
          this._setRigenList(newVal);
        }
      },
    },
  },
  methods: {
    // 将properties中的数据映射到data中，并过滤成需要的格式
    _setRigenList: function(rigengData) {
      const bookList = rigengData.book;
      this.setData({
        loading: false,
      });
    },
  },
});
