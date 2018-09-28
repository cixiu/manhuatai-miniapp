const apiSearchAuthor = require('../../api/search-author');

Page({
  data: {
    loading: true,
    loadMore: true,
    authorList: [],
  },
  onLoad: function(query) {
    this.page = 1;
    this.search_key = query.search_key;
    this.getSearchAuthor(this.page, this.search_key);
  },
  onReachBottom: function() {
    if (!this.data.loadMore || this.isRequesting) {
      return;
    }
    this.page++;
    this.getSearchAuthor(this.page, this.search_key);
  },
  // 获取相关用户作者
  getSearchAuthor: function(page, search_key) {
    // 正在进行数据请求 用于控制loadmore的再次请求
    this.isRequesting = true;
    apiSearchAuthor.getSearchAuthor(page, search_key, (res) => {
      if (res.data.data && !res.data.data.count) {
        return;
      }
      if (res.data.data.list.length === 0) {
        this.setData({
          loadMore: false,
        });
        return;
      }
      // 这里的size为20
      if (res.data.data.list.length < 20) {
        this.setData({
          loadMore: false,
        });
      }

      const authorListObj = {};
      const length = this.data.authorList.length;

      res.data.data.list.forEach((item, index) => {
        // webp格式的http图片链接 转成 https和jgp格式的图片外链
        item.sculpture = item.sculpture.replace(
          /^(http)(.*?)(\.webp)$/g,
          (match, ...arg) => {
            return `https${arg[1]}`;
          },
        );
        const pIndex = length + index;
        authorListObj[`authorList[${pIndex}]`] = item;
      });
      // 局部更新
      this.setData({
        ...authorListObj,
        loading: false,
      });
      this.isRequesting = false;
    }, () => {
      this.isRequesting = false;
      this.page--;
    });
  },
});
