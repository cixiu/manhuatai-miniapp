const apiManhuatai = require('../../api/manhuatai');
const apiCommentUser = require('../../api/commentUser');
const WxParse = require('../../wxParse/wxParse.js');
const filter = require('../../utils/filter');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    postDetail: {}, // 帖子详情
    postUser: {}, // 帖子作者
  },
  onLoad: function(query) {
    this.initFetch(query);
  },
  // 初始化数据
  initFetch: function(query) {
    const postListParams = {
      satelliteId: query.satelliteId,
      satelliteType: 0,
      starId: query.starId,
      pagesize: 1,
    };
    // 获取帖子的详情
    apiManhuatai.getPostList(postListParams, (postRes) => {
      const postDetail = postRes.data.data[0];
      postDetail.Images = JSON.parse(postDetail.Images).map((item) => {
        const imgUrl = item.replace(
          /@#de<!--IMG#\d+-->@#de\d+:\d+/g,
          '-noresize',
        );
        return this.data.imgHost + imgUrl;
      });

      // 将图片插入Content字符串中
      const article = postDetail.Content.replace(/<!--IMG#(\d+)-->/g, function(
        match,
        p1,
      ) {
        // 如果图片大小不适应 可以修改wxParse.wxml中的代码，进行配置
        return `\n\n <img src=${postDetail.Images[p1]} /> \n\n`;
      });
      // wxParse数据绑定
      WxParse.wxParse('article', 'md', article, this);

      this.setData({
        postDetail,
      });
      const userids = [postRes.data.data[0].UserIdentifier];
      // 获取帖子的作者信息
      apiCommentUser.getCommentUser(userids, (commentUserRes) => {
        const postUser = commentUserRes.data.data[0];
        const id = postUser.Uid;
        const imgHost =
          'https://image.samanlehua.com/file/kanmanhua_images/head/';

        postUser.img_url = filter.makeImgUrlById(id, imgHost, 'l1x1');
        this.setData({
          postUser,
        });
      });
    });
  },
});
