const apiComment = require('../../../api/comment');
const WxParse = require('../../../wxParse/wxParse');
const emoji = require('../../../data/emoji');
const common = require('../../../utils/common');

const app = getApp();

WxParse.emojisInit('[]', '/wxParse/emojis/', emoji.emojiData);

/*
  由于该组件在评论列表组件和评论详情中都使用了，为了区分不同的用途，使用了isDetail字段用来区分，
  所以该组件的内容较为复杂

*/

Component({
  data: {
    isSupport: 0, // 0表示没有点赞 || 1表示已经点赞
    supportCount: 0,
  },
  properties: {
    isDetail: {
      // 是否是评论的详情
      type: Boolean,
      value: false,
    },
    isFather: {
      // 是否是父级评论
      type: Boolean,
      value: false,
    },
    ssidType: {
      // 是否是帖子评论 1 => 帖子 || 0 => 漫画
      type: Number,
      value: 1,
    },
    isHotList: {
      // 是否是热门评论
      type: Boolean,
      value: false,
    },
    isNewList: {
      // 是否是最新评论
      type: Boolean,
      value: false,
    },
    index: {
      // 评论在评论列表中的索引
      type: Number,
      value: 0,
    },
    comment: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        if (newVal && newVal.id) {
          this.setData({
            isSupport: newVal.issupport,
            supportCount: newVal.supportcount,
          });
        }

        if (newVal && newVal.id && newVal.id !== oldVal.id) {
          const imgHost = 'https://image.zymk.cn/file/emot/';
          const suffix = '.gif';
          let content = newVal.content.replace(/\r\n|\n/g, '\n\n');
          content = content
            .replace(
              /\{emoji\:(.*?\/\d+)\}/g,
              `<img style="width: 84rpx; height: 84rpx;" src="${imgHost}$1${suffix}"/>`,
            )
            .replace(/\[url:.*?[^\]].*?\]/g, '');

          WxParse.wxParse('content', 'md', content, this);
        }
      },
    },
  },
  methods: {
    // 前往评论详情页
    goToCommentDetail: function(e) {
      if (this.properties.isDetail) {
        return;
      }

      const comment = {
        ...this.properties.comment,
        issupport: this.data.isSupport,
        supportcount: this.data.supportCount,
      };
      const FatherId = comment.id;
      const { ssidType, isHotList, isNewList, index } = this.properties;
      app.globalData.fatherComment = comment;

      wx.navigateTo({
        url: `/pages/comment-detail/comment-detail?FatherId=${FatherId}&ssidType=${ssidType}&isHotList=${isHotList}&isNewList=${isNewList}&index=${index}`,
      });
    },
    // 前往个人中心页
    goUserCenter: function() {
      wx.showToast({
        title: '前往个人中心',
        icon: 'none',
      });
    },
    // 点赞评论
    supportComment: function() {
      if (!common.hasLogin()) {
        return common.navigateToLogin();
      }

      const comment = this.properties.comment;
      const status = this.data.isSupport ? 0 : 1;
      const supportCount = status
        ? this.data.supportCount + 1
        : this.data.supportCount - 1;

      this.setData({
        isSupport: status,
        supportCount,
      });

      const requestData = {
        commentId: comment.id,
        ssid: comment.ssid,
        ssidType: comment.ssidtype,
        status,
      };
      apiComment.commentSupport(requestData);

      if (this.properties.isDetail) {
        const { isHotList, isNewList, index } = this.properties;
        // 如果是从热门评论或者最新评论
        if (isHotList || isNewList) {
          // 将点赞的评论数据同步到上一层的评论中
          let pages = getCurrentPages();
          let prevPage = null; // 上一个页面

          if (pages.length >= 2) {
            prevPage = pages[pages.length - 2]; // 上一个页面
          }

          if (prevPage) {
            if (isHotList) {
              prevPage.setData({
                [`hotCommentList[${index}].issupport`]: status,
                [`hotCommentList[${index}].supportcount`]: supportCount,
              });
            }

            if (isNewList) {
              prevPage.setData({
                [`newCommentList[${index}].issupport`]: status,
                [`newCommentList[${index}].supportcount`]: supportCount,
              });
            }
          }
        }
      }
    },
  },
});
