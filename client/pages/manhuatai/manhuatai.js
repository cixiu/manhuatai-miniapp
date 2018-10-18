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
  // 上滑加载
  onReachBottom: function() {
    if (!this.data.loadMore || this.isRequesting) {
      return;
    }
    this.page++;
    this.getPostList({ page: this.page });
  },
  // 获取热门帖子列表
  getPostList: function(params) {
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

        res.data.data.forEach((item, index) => {
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
        });

        this.setData({
          ...postListObj,
          loading: false,
        });
        this.isRequesting = false;
      },
      () => {
        this.isRequesting = false;
        this.page--;
        this.setData({
          loading: false,
        });
      },
    );
  },
});
