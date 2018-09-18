const filter = require('../../../utils/filter');
const app = getApp();

/*
自制榜图片显示说明
只显示5条数据
图片比例是m3x4   -----图片比例对应在/data/configData.js中
*/

Component({
  data: {
    imgHost: app.globalData.imgHost,
    allList: [],
    firstList: [],
    secondList: [],
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
      const firstList = filter.fitlerM3x4Format(list.slice(0, 1));
      const secondList = filter.fitlerM3x4Format(list.slice(1, 5));
      const allList = firstList.concat(secondList);
      this.setData({
        allList,
        firstList,
        secondList,
      });
    },
  },
});
