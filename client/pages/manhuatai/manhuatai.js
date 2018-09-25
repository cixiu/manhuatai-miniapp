const apiManhuatai = require('../../api/manhuatai');
const WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    page: 1,
    loadMore: true,
    postList: [],
    descList: [],
  },
  onLoad: function() {
    this.getPostList();
  },
  onReachBottom: function() {
    if (!this.data.loadMore) {
      return;
    }
    this.data.page++;
    this.getPostList(this.data.page);
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
  // 获取热门帖子列表
  getPostList: function(page = 1) {
    const descArr = [];
    apiManhuatai.getPostList(page, (res) => {
      if (res.data.data.length === 0) {
        this.setData({
          loadMore: false,
        });
        return;
      }

      const postList = res.data.data.map((item) => {
        descArr.push(
          item.Content.replace(/<!--IMG#\d+-->\s+/g, '').substring(0, 50),
        );
        // 将图片转成200x200的小图  -- 图片展示的时候使用
        const Images = item.Images.replace(
          /@#de<!--IMG#\d+-->@#de\d+:\d+/g,
          '-200x200',
        );
        item.Images = JSON.parse(Images).map((imgItem) => {
          return this.data.imgHost + imgItem;
        });
        return item;
      });

      this.data.descList = this.data.descList.concat(descArr);
      // wxParse多数据循环使用
      for (let i = 0; i < this.data.descList.length; i++) {
        WxParse.wxParse('desc' + i, 'html', this.data.descList[i], this);
        if (i === this.data.descList.length - 1) {
          WxParse.wxParseTemArray(
            'descTemArray',
            'desc',
            this.data.descList.length,
            this,
          );
        }
      }

      this.setData({
        postList: this.data.postList.concat(postList),
      });
    });
  },
});
