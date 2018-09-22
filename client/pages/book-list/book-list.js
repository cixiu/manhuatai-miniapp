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
    const orderby = query.orderby;
    const comic_sort = query.comic_sort;
    this.setData({
      orderby,
      comic_sort,
    });
    this.getSortList(this.page, orderby, comic_sort);
  },
  onReachBottom: function() {
    if (!this.data.loadMore) {
      return;
    }
    this.page++;
    this.getSortList(this.page, this.data.orderby, this.data.comic_sort);
  },
  getSortList: function(page, orderby, comic_sort) {
    apiBookList.getSortList(page, orderby, comic_sort, (res) => {
      const title = `${res.data.page.comic_sort}-${
        this.data.subTitle[orderby]
      }`;
      wx.setNavigationBarTitle({
        title,
      });
      // 如果data.length === 0 表示没有更多数据可以加载了
      if (res.data.data.length === 0) {
        this.setData({
          loadMore: false,
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
    });
  },
});
