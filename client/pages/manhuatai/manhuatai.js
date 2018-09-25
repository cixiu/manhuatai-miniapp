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
        const Images = item.Images.replace(
          /@#de<!--IMG#\d+-->@#de\d+:\d+/g,
          '-200x200',
        );
        item.Images = JSON.parse(Images);
        return item;
      });

      this.data.descList = this.data.descList.concat(descArr);

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
