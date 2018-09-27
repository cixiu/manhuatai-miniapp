const apiManhuatai = require('../../api/manhuatai');
const wxDiscode = require('../../wxParse/wxDiscode');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    loading: true,
    page: 1,
    loadMore: true,
    postList: [],
    descList: [],
  },
  onLoad: function() {
    const params = {
      page: 1,
    };
    this.getPostList(params);
  },
  onReachBottom: function() {
    if (!this.data.loadMore) {
      return;
    }
    this.data.page++;
    const params = {
      page: this.data.page,
    };
    this.getPostList(params);
  },
  // 预览图片
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const previewIndex = e.currentTarget.dataset.previewIndex;
    // 将图片转成没有裁切的大图 -- 图片预览的时候使用
    const previewImages = this.data.postList[index].Images.map((imgItem) => {
      return imgItem.replace('200x200', 'noresize');
    });
    const current = previewImages[previewIndex];
    wx.previewImage({
      urls: previewImages,
      current,
    });
  },
  // 前往帖子详情查看
  goToPost: function(e) {
    const item = e.currentTarget.dataset.item;
    const satelliteId = item.Id;
    const starId = item.StarId;
    const userIdentifier = item.UserIdentifier;
    wx.navigateTo({
      url: `/pages/post/post?satelliteId=${satelliteId}&starId=${starId}&userIdentifier=${userIdentifier}`,
    });
  },
  // 获取热门帖子列表
  getPostList: function(params) {
    const descArr = [];
    apiManhuatai.getPostList(params, (res) => {
      if (res.data.data.length === 0) {
        this.setData({
          loadMore: false,
        });
        return;
      }

      const postListObj = {};
      const length = this.data.postList.length;

      res.data.data.forEach((item, index) => {
        item.Content = this.parseContent(item.Content);
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
    });
  },
  // 解析content 除去特殊的字符
  parseContent: function(content) {
    // 将html标签去掉
    const htmlReg = /<[^>]+>/g;
    // 将自定义的emoji去掉
    const emojiReg = /\[.*?\]|\{emoji\:(馒头仔\/\d+)\}/g;
    const contentStr = content.replace(htmlReg, '').replace(emojiReg, ' ');
    // 将特殊符号的HTML源码转成特殊符号
    return wxDiscode.strDiscode(contentStr).substring(0, 50);
  },
});
