const apiManhuatai = require('../../api/manhuatai');
const util = require('../../utils/util');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    loading: true,
    loadMore: true,
    postList: [],
  },
  onLoad: function() {
    this.page = 1;
    this.getPostList({ page: 1 });
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.page = 1;
    this.getPostList({ page: 1 }, () => {
      wx.stopPullDownRefresh();
    });
  },
  // 上滑加载
  onReachBottom: function() {
    if (!this.data.loadMore || this.isRequesting) {
      return;
    }
    this.page++;
    this.getPostList({ page: this.page });
  },
  // 获取热门帖子列表
  getPostList: function(params, callback) {
    this.isRequesting = true;
    apiManhuatai.getPostList(
      params,
      (res) => {
        if (res.data.data.length === 0) {
          this.setData({
            loadMore: false,
          });
          return;
        }

        const postListObj = {};
        const length = this.data.postList.length;

        const postList = res.data.data.map((item, index) => {
          item.Content = util.parseContent(item.Content);
          // 将图片转成200x200的小图  -- 图片展示的时候使用
          const Images = item.Images.replace(
            /@#de<!--IMG#\d+-->@#de\d+:\d+/g,
            '-200x200',
          );
          item.Images = JSON.parse(Images).map((imgItem) => {
            return this.data.imgHost + imgItem;
          });
          const pIndex = length + index;
          postListObj[`postList[${pIndex}]`] = item;

          return item;
        });

        if (callback) {
          this.setData({
            postList,
          });

          callback();
        } else {
          this.setData({
            ...postListObj,
            loading: false,
          });
        }

        this.isRequesting = false;
      },
      () => {
        this.isRequesting = false;
        this.page--;
        this.setData({
          loading: false,
        });

        callback && callback();
      },
    );
  },
});
