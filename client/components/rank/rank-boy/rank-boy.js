const filter = require('../../../utils/filter');
const app = getApp();

/*
少年榜榜图片显示说明
只显示3条数据
图片比例是m2x1   -----图片比例对应在/data/configData.js中
*/

Component({
  data: {
    imgHost: app.globalData.imgHost,
    allList: [],
  },
  properties: {
    rankData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.type) {
          // 深克隆一份数据 以防操作数据的时候修改了原数据
          const copyAllList = filter.deepClone(newVal.list);
          this._setAllList(copyAllList);
        }
      },
    },
  },
  methods: {
    // 设置需要显示的排行榜列表
    _setAllList: function(list) {
      const allList = filter.fitlerM2x1Format(list.slice(0, 3));
      this.setData({
        allList,
      });
    },
  },
});
