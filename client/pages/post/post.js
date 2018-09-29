const apiManhuatai = require('../../api/manhuatai');
const apiCommentUser = require('../../api/commentUser');
const apiComment = require('../../api/comment');
const WxParse = require('../../wxParse/wxParse.js');
const filter = require('../../utils/filter');
const emoji = require('../../data/emoji');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    loading: true,
    postDetail: {}, // 帖子详情
    postUser: {}, // 帖子作者
    hotCommentList: [], // 热门评论列表
    // hotCommentUserList: [], // 热门评论列表的用户
    newCommentList: [], // 最新评论列表
    // newCommentUserList: [],
    hasNewCommentMore: true, // 是否还有更多的评论
  },
  onLoad: function(query) {
    this.initFetch(query);
  },
  onReachBottom: function() {
    if (!this.data.hasNewCommentMore || this.isRequesting) {
      return;
    }
    this.page++;
    const commentListParams = {
      page: this.page,
      ssid: this.satelliteId,
    };
    this.getNewCommentList(commentListParams);
  },
  // 初始化数据
  initFetch: function(query) {
    this.page = 1; // 评论列表的页码
    this.satelliteId = query.satelliteId; // 帖子的id
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
      // 帖子详情中的图片列表有关的宽高信息
      let imgDetailList = [];
      // 将@#de<!--IMG#\d+-->@#de(\d+:\d+) 替换为img_url
      postDetail.Images = JSON.parse(postDetail.Images).map((item) => {
        const imgUrl = item.replace(
          /@#de<!--IMG#\d+-->@#de(\d+:\d+)/g,
          function(match, p1) {
            const imgTempDetail = p1.split(':');
            const imgWidth = +imgTempDetail[0];
            const imgHeight = +imgTempDetail[1];
            imgDetailList.push({
              width: imgWidth,
              height: imgHeight,
            });
            return '-noresize';
          },
        );
        return this.data.imgHost + imgUrl;
      });

      // 初始化emoji设置
      WxParse.emojisInit('[]', '/wxParse/emojis/', emoji.emojiData);

      // 将图片插入Content字符串中
      let article = postDetail.Content.replace(/<!--IMG#(\d+)-->/g, function(
        match,
        p1,
      ) {
        // 计算图片的高度
        const imgDetail = imgDetailList[p1];
        const width = 750 - 32 * 2; // 750rpx - padding-left-right * 2
        const height = (imgDetail.height / imgDetail.width) * width;
        const style = `width: ${width}rpx; height: ${height}rpx`;
        const src = postDetail.Images[p1];
        // 如果图片大小不适应 可以修改wxParse.wxml中的代码，进行配置
        return `\n\n <img class="custom-img" style="${style}" src="${src}" /> \n\n`;
      });
      // 设置馒头仔的自定emoji图片
      const imgHost = 'https://image.zymk.cn/file/emot/';
      const suffix = '.gif';
      article = article
        .replace(
          /\{emoji\:(馒头仔\/\d+)\}/g,
          `<img style="width: 84rpx; height: 84rpx;" src="${imgHost}$1${suffix}"/>`,
        )
        .replace(/\[url:.*?[^\]].*?\]/g, '')
        .replace(/\n/g, '\n\n');
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
        // 生成用户的头像的url
        postUser.img_url = filter.makeImgUrlById(id, imgHost, 'l1x1');
        this.setData({
          postUser,
          loading: false,
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
    this.isRequesting = true;
    apiComment.getNewCommentList(
      params,
      (res) => {
        if (res.data.data.length === 0) {
          this.setData({
            hasNewCommentMore: false,
          });
          return;
        }
        this._setCommentList(res, 'newCommentList');
      },
      () => {
        this.isRequesting = false;
        this.page--;
      },
    );
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
      commentList = commentList.map((item) => {
        const commentUser = commentUserList.find((userItem) => {
          return userItem.Uid === item.useridentifier;
        });
        return {
          ...item,
          ...commentUser,
        };
      });
      // 通过用户的uid 拼出用户头像的img_url
      commentList = filter.filterFansList(commentList);
      commentList = this.data[dataKey].concat(commentList);
      this.setData({
        [dataKey]: commentList,
      });
      this.isRequesting = false;
    });
  },
});
