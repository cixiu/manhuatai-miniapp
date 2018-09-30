const apiComment = require('../../api/comment');
const filter = require('../../utils/filter');
const app = getApp();

Page({
  data: {
    loading: true,
    loadMore: true,
    fatherComment: {},
    newCommentList: [],
  },
  onLoad: function(query) {
    const fatherComment = app.globalData.fatherComment;
    this.page = 1;
    this.ssid = fatherComment.ssid;
    this.fatherId = fatherComment.id;
    this.ssidType = query.ssidType || 1; // 0 或者 1
    this.isWater = -1;
    this.setData({
      fatherComment: fatherComment,
    });
    this.newCommentListParams = {
      page: this.page,
      ssid: this.ssid,
      FatherId: this.fatherId,
      ssidType: this.ssidType,
      isWater: this.isWater,
    };
    this.getNewCommentList(this.newCommentListParams);
  },
  onReachBottom: function() {
    if (!this.data.loadMore || this.isRequesting) {
      return;
    }
    this.page++;
    const newCommentListParams = {
      ...this.newCommentListParams,
      page: this.page,
    };
    this.getNewCommentList(newCommentListParams);
  },
  // 获取最新的评论回复列表
  getNewCommentList: function(newCommentListParams) {
    this.isRequesting = true;
    apiComment.getNewCommentList(
      newCommentListParams,
      (res) => {
        if (res.data.data.length === 0) {
          this.setData({
            loadMore: false,
            loading: false,
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
    // content中回复他人的regexp
    const replyRegexp = /^\{reply:“(\d+)”\}/;
    commentList.forEach((item) => {
      const matches = item.content.match(replyRegexp);
      if (matches) {
        const id = +matches[1];
        if (id) {
          userids.push(id);
        }
      }
      if (userids.indexOf(item.useridentifier) < 0) {
        userids.push(item.useridentifier);
      }
    });

    apiComment.getCommentUser(userids, (commentUserRes) => {
      let commentUserList = commentUserRes.data.data;
      commentList = commentList.map((item) => {
        // 找到评论的用户
        if (commentUserList && commentUserList.length > 0) {
          const commentUser = commentUserList.find((userItem) => {
            return userItem.Uid === item.useridentifier;
          });
          // 找到评论回复的用户
          let replyUser = {};
          if (replyRegexp.test(item.content)) {
            item.content = item.content.replace(replyRegexp, function(match, p1) {
              const id = +p1;
              const replyCommentUser = commentUserList.find((userItem) => {
                return userItem.Uid === id;
              });
              if (replyCommentUser) {
                replyUser.replyUserId = replyCommentUser.Uid;
                replyUser.replyUserName = replyCommentUser.Uname;
              }
              if (!id || !replyCommentUser) {
                return '';
              }
              return `回复<span class="reply-user">${
                replyUser.replyUserName
              }</span>：`;
            });
          }
          return {
            ...item,
            ...commentUser,
            ...replyUser,
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

      this.setData({
        loading: false,
      });

      this.setData(commentListObj);
      this.isRequesting = false;
    });
  },
});
