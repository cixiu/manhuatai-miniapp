const apiComment = require('../../api/comment');
const cache = require('../../utils/cache');

const app = getApp();

Page({
  data: {
    commentValue: '',
    isFather: false,
    isComic: false,
    ssid: 0,
    comic_name: '',
    comic_share_url: '',
  },
  onLoad: function(query) {
    this.setData({
      isComic: query.isComic ? JSON.parse(query.isComic) : false,
      isFather: query.isFather ? JSON.parse(query.isFather) : false,
      ssid: query.ssid ? JSON.parse(query.ssid) : false,
      comic_name: query.comic_name ? query.comic_name : '',
      comic_share_url: query.comic_share_url ? query.comic_share_url : '',
    });
  },
  inputChange: function(e) {
    this.setData({
      commentValue: e.detail.value,
    });
  },
  // 确认评论
  confirmComment: function() {
    if (!this.data.commentValue) {
      return wx.showToast({
        title: '先写点内容吧',
        image: '../../img/icon_message_error.png',
      });
    }

    let requestData = null;
    let commentValue = this.data.commentValue;
    const { replyComment, comic_share_url } = app.globalData;
    const userInfo = cache.loadUserInfo();

    // 如果是漫画的吐槽
    if (this.data.isComic) {
      requestData = {
        content: commentValue,
        fatherId: 0, // 帖子评论的id 0表示对帖子或者漫画的评论 其他表示对评论的回复
        opreateId: 0, // 帖子评论的作者id
        satelliteId: 0, // 吐槽帖子时帖子的id  0表示不是对帖子的吐槽
        ssid: this.data.ssid, // 帖子的id 或者漫画的id
        ssidType: 0, // 1表示帖子 0表示漫画
        starId: 0, // 0表示回复或者漫画 其他表示帖子中的StarId字段
        title: this.data.comic_name, // 帖子的标题 或者 漫画的名称
        url: comic_share_url, // 帖子为空 漫画评论来源的comic_share_url
      };
    }

    // 不是对漫画的吐槽 而是对评论的吐槽
    if (!this.data.isComic) {
      // 如果是父评论的回复
      if (this.data.isFather) {
        requestData = {
          content: commentValue,
          fatherId: replyComment.id, // 帖子评论的id 0表示对帖子的评论 其他表示对评论的回复
          opreateId: replyComment.useridentifier, // 帖子评论的作者id
          satelliteId: 0, // 吐槽帖子时帖子的id  0表示不是对帖子的吐槽
          ssid: replyComment.ssid, // 帖子的id 或者漫画的id
          ssidType: replyComment.ssidtype, // 1表示帖子 0表示漫画
          starId: 0, // 0表示回复或者漫画 其他表示帖子中的StarId字段
          title: replyComment.title, // 帖子的标题 或者 漫画的名称
          url: comic_share_url, // 帖子为空 漫画评论来源的comic_share_url
        };
      } else {
        commentValue = `{reply:“${
          replyComment.useridentifier
        }”}${commentValue}`;

        requestData = {
          content: commentValue,
          fatherId: replyComment.id, // 帖子评论的id 0表示对帖子的评论 其他表示对评论的回复
          opreateId: replyComment.useridentifier, // 帖子评论的作者id
          satelliteId: 0, // 吐槽帖子时帖子的id  0表示不是对帖子的吐槽
          replyName: replyComment.Uname,
          ssid: replyComment.ssid, // 帖子的id 或者漫画的id
          ssidType: replyComment.ssidtype, // 1表示帖子 0表示漫画
          starId: 0, // 0表示回复或者漫画 其他表示帖子中的StarId字段
          title: replyComment.title, // 帖子的标题 或者 漫画的名称
          url: comic_share_url, // 帖子为空 漫画评论来源的comic_share_url
        };
      }
    }

    wx.showLoading({
      title: '正在发布中...',
      mask: true,
    });

    apiComment.postComment(
      requestData,
      (res) => {
        if (res.data.status !== 1) {
          return wx.showToast({
            title: '发布失败，稍后再试...',
            icon: 'none',
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                });
              }, 1500);
            },
          });
        }

        commentValue = `回复<span class="reply-user">${
          replyComment.Uname
        }</span>：${this.data.commentValue}`;

        const content =
          this.data.isFather || this.data.isComic
            ? this.data.commentValue
            : commentValue;

        const isComic = this.data.isComic;

        const commentData = {
          id: res.data.data,
          content,
          fatherid: isComic ? 0 : replyComment.id,
          images: '[]',
          ssid: isComic ? this.data.ssid : replyComment.ssid,
          title: isComic ? this.data.comic_name : replyComment.title,
          url: comic_share_url,
          supportcount: 0,
          iselite: 0,
          istop: 0,
          revertcount: 0,
          useridentifier: userInfo.Uid,
          createtime: +new Date(),
          updatetime: +new Date(),
          ssidtype: isComic ? 0 : replyComment.ssidtype,
          issupport: 0,
          RelateId: '',
          Uid: userInfo.Uid,
          Ulevel: userInfo.Ulevel,
          Uname: userInfo.Uname,
          isvip: userInfo.isvip ? true : false,
          img_url: userInfo.Uavatar,
        };

        // 将评论后的数据同步到评论列表中
        let pages = getCurrentPages();
        let prevPage = null; // 上一个页面

        if (pages.length >= 2) {
          prevPage = pages[pages.length - 2]; // 上一个页面
        }

        if (prevPage) {
          prevPage.data.newCommentList.unshift(commentData);

          prevPage.setData({
            newCommentList: prevPage.data.newCommentList,
          });

          wx.showToast({
            title: '发布成功',
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                });
              }, 1500);
            },
          });
        }
      },
      () => {
        wx.showToast({
          title: '发布失败',
          icon: '../../img/icon_message_error.png',
        });
      },
    );
  },
});
