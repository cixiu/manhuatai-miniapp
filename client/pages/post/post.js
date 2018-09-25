const apiManhuatai = require('../../api/manhuatai');
const apiCommentUser = require('../../api/commentUser');
const apiComment = require('../../api/comment');
const WxParse = require('../../wxParse/wxParse.js');
const filter = require('../../utils/filter');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    postDetail: {}, // 帖子详情
    postUser: {}, // 帖子作者
    hotCommentList: [], // 热门评论列表
    // hotCommentUserList: [], // 热门评论列表的用户
    newCommentList: [], //
    // newCommentUserList: [],
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
    const commentListParams = {
      page: 1,
      ssid: query.satelliteId,
    };
    // 获取帖子的详情
    this.getPostDetail(postListParams);
    // 获取热门评论
    this.getHotCommentList(commentListParams);
    // 获取最新评论
    this.getNewCommentList(commentListParams);
  },
  // 获取帖子详情
  getPostDetail: function(params) {
    apiManhuatai.getPostList(params, (postRes) => {
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
  // 获取热门评论
  getHotCommentList: function(params) {
    apiComment.getHotCommentList(params, (res) => {
      this._setCommentList(res, 'hotCommentList');
    });
  },
  // 获取最新评论
  getNewCommentList: function(params) {
    apiComment.getNewCommentList(params, (res) => {
      this._setCommentList(res, 'newCommentList');
    });
  },
  // 设置评论列表
  _setCommentList: function(res, dataKey) {
    let commentList = res.data.data;
    let userids = [];
    commentList.forEach((item) => {
      userids.push(item.useridentifier);
    });

    apiCommentUser.getCommentUser(userids, (commentUserRes) => {
      let commentUserList = commentUserRes.data.data;
      commentList = commentList.map((item, index) => {
        const commentUser = commentUserList[index];
        return {
          ...item,
          ...commentUser,
        };
      });
      // 通过用户的uid 拼出用户头像的img_url
      commentList = filter.filterFansList(commentList);
      this.setData({
        [dataKey]: commentList,
      });
    });
  },
});
