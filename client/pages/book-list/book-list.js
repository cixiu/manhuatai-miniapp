const apiBookList = require('../../api/book-list');
const filter = require('../../utils/filter');

Page({
  data: {
    subTitle: {
      click: '人气',
      shoucang: '收藏',
      date: '更新',
      wanjie: '完结',
    },
    loading: true,
    loadMore: true,
    bookList: [],
  },
  onLoad: function(query) {
    this.page = 1;
    this.orderby = query.orderby || 'click'; // 排序方式
    this.comic_sort = query.comic_sort || ''; // 漫画类型
    this.search_key = query.search_key || ''; // 搜索的关键词
    this.newsid = query.newsid || ''; // 搜索的作者用户的id
    this.author_name = query.author_name || ''; // 搜索的作者用户的名称

    if (this.newsid) {
      this.getSearchAuthorComic(this.page, this.orderby, this.newsid);
      this.setData({
        loadMore: false,
      });
    } else {
      this.getSortList(
        this.page,
        this.orderby,
        this.comic_sort,
        this.search_key,
      );
    }
  },
  onReachBottom: function() {
    if (!this.data.loadMore || this.isRequesting) {
      return;
    }
    this.page++;
    this.getSortList(this.page, this.orderby, this.comic_sort, this.search_key);
  },
  getSortList: function(page, orderby, comic_sort, search_key) {
    this.isRequesting = true;
    apiBookList.getSortList(page, orderby, comic_sort, search_key, (res) => {
      this.isRequesting = false;
      this._setData(res);
    }, () => {
      this.isRequesting = false;
      this.page--;
    });
  },
  // 获取作者出品的漫画列表
  getSearchAuthorComic: function(page, orderby, newsid) {
    apiBookList.getSearchAuthorComic(page, orderby, newsid, (res) => {
      this._setData(res);
    });
  },
  _setData: function(res) {
    if (this.page === 1) {
      let mainTitle = '';
      if (this.author_name) {
        mainTitle = this.author_name;
      } else {
        mainTitle = res.data.page.comic_sort || res.data.page.search_key;
      }
      const subTitle = this.data.subTitle[this.orderby];
      const title = `${mainTitle}-${subTitle}`;
      wx.setNavigationBarTitle({
        title,
      });
    }
    // 如果data.length === 0 表示没有更多数据可以加载了
    if (res.data.data.length === 0) {
      this.setData({
        loadMore: false,
        loading: false
      });
      return;
    }

    const bookList = this.data.bookList.concat(
      filter.fitlerM3x4Format(res.data.data),
    );
    this.setData({
      bookList,
      loading: false,
    });
  },
});
