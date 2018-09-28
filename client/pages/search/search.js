const apiSearch = require('../../api/search');
const cache = require('../../utils/cache');

Page({
  data: {
    query: '', // 搜索词
    suggestList: [],
    searchHistoryList: [],
  },
  onLoad: function() {
    this.getHotSearchList();
  },
  onShow: function() {
    this.setData({
      searchHistoryList: cache.loadSearch(),
    });
  },
  // 输入时触发
  inputChange: function(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setData({
        query: e.detail.value,
      });
      apiSearch.searchComic(this.data.query, (res) => {
        this.setData({
          suggestList: res.data.data,
        });
      });
    }, 300);
  },
  // 键盘右下角搜索按钮点击时触发
  inputConfirm: function(e) {
    const search_key = e.detail.value;
    if (!search_key) {
      return;
    }
    this.goToSearchComic(search_key);
  },
  // 搜索结果的点击导航
  navigateToSearchComic: function(e) {
    const search_key = e.currentTarget.dataset.value;
    this.goToSearchComic(search_key);
  },
  // 路由跳转
  goToSearchComic: function(search_key) {
    wx.navigateTo({
      url: `/pages/search-comic/search-comic?search_key=${search_key}`,
      complete: () => {
        // 路由跳转完成后，将搜索词存入storage中
        cache.saveSearch(search_key);
      },
    });
  },
  // 清空搜索历史
  clearSearchHistory: function() {
    wx.showModal({
      title: '',
      content: '是否清空搜索记录',
      success: (res) => {
        if (res.confirm) {
          cache.clearSearch();
          this.setData({
            searchHistoryList: []
          })
        }
      }
    })
  },
  // 删除一条搜索历史
  deleteSearchHistory: function(e) {
    const searchHistoryList = cache.deleteSearch(e.currentTarget.dataset.value);
    this.setData({
      searchHistoryList,
    });
  },
  getHotSearchList: function() {
    apiSearch.getHotSearchList((res) => {
      this.setData({
        hotSearchList: res.data.data,
      });
    });
  },
});
