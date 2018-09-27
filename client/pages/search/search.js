const apiSearch = require('../../api/search');

Page({
  data: {
    query: '', // 搜索词
    suggestList: [],
  },
  onLoad: function() {
    this.getHotSearchList();
  },
  // 输入时触发
  inputChange: function(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setData({
        query: e.detail.value,
      });
      apiSearch.searchComic(this.data.query, (res) => {
        // console.log(res.data);
        this.setData({
          suggestList: res.data.data,
        });
      });
    }, 300);
  },
  // 点击完成按钮时触发
  searchConfirm: function(e) {
    console.log(e);
  },
  getHotSearchList: function() {
    apiSearch.getHotSearchList((res) => {
      this.setData({
        hotSearchList: res.data.data,
      });
    });
  },
});
