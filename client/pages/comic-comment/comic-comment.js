const apiComment = require('../../api/comment');
const filter = require('../../utils/filter');
const util = require('../../utils/util');
const common = require('../../utils/common');

const app = getApp();

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    loading: true,
    hasNewCommentMore: true,
    hotCommentList: [], // 热门评论列表
    newCommentList: [], // 最新评论列表
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
      ssid: this.ssid,
      ssidType: 0,
    };
    this.getNewCommentList(commentListParams);
  },
  // 初始化数据
  initFetch: function(query) {
    app.globalData.comic_share_url = query.comic_share_url;

    this.page = 1; // 评论列表的页码
    this.ssid = query.ssid;
    this.comicName = query.comic_name;
    const commentListParams = {
      page: 1,
      ssid: query.ssid,
      ssidType: 0,
    };
    // 获取漫画评论的数量
    this.getCommentCount({ ssid: this.ssid, ssidType: this.ssidType });
    // 获取漫画热门评论
    this.getHotCommentList(commentListParams);
    // 获取漫画最新评论
    this.getNewCommentList(commentListParams);
  },
  // 获取漫画评论的数量
  getCommentCount: function(params) {
    apiComment.getCommentCount(params, (res) => {
      const count = util.formatNumber(res.data.data);
      const title = `${this.comicName} (${count})`;
      wx.setNavigationBarTitle({
        title,
      });
    });
  },
  // 获取漫画热门评论
  getHotCommentList: function(params) {
    apiComment.getHotCommentList(params, (res) => {
      if (res.data.data.length === 0) {
        return;
      }
      this._setCommentList(res, 'hotCommentList');
    });
  },
  // 获取漫画最新评论
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
  // 进入发布吐槽评论页面
  goToCommentReply: function() {
    if (!common.hasLogin()) {
      return common.navigateToLogin();
    }

    const ssid = this.ssid;
    const comic_name = this.comicName;
    const comic_share_url = app.globalData.comic_share_url;

    wx.navigateTo({
      url: `/pages/comment-reply/comment-reply?ssid=${ssid}&comic_name=${comic_name}&comic_share_url=${comic_share_url}&isComic=true`,
    });
  },
  // 设置评论列表
  _setCommentList: function(res, dataKey) {
    let commentList = res.data.data;
    let userids = [];
    commentList.forEach((item) => {
      userids.push(item.useridentifier);
    });

    apiComment.getCommentUser(userids, (commentUserRes) => {
      let commentUserList = commentUserRes.data.data;
      commentList = commentList.map((item) => {
        if (commentUserList && commentUserList.length > 0) {
          const commentUser = commentUserList.find((userItem) => {
            return userItem.Uid === item.useridentifier;
          });
          return {
            ...item,
            ...commentUser,
          };
        }
        return item;
      });
      // 通过用户的uid 拼出用户头像的img_url
      commentList = filter.filterFansList(commentList);

      const commentListObj = {};
      const length = this.data[dataKey].length;
      commentList.forEach((item, index) => {
        const pIndex = length + index;
        commentListObj[`${dataKey}[${pIndex}]`] = item;
      });

      if (dataKey === 'newCommentList') {
        this.setData({
          loading: false,
        });
      }

      this.setData(commentListObj);
      this.isRequesting = false;
    });
  },
});
