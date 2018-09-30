const WxParse = require('../../../wxParse/wxParse');
const emoji = require('../../../data/emoji');
const app = getApp();

WxParse.emojisInit('[]', '/wxParse/emojis/', emoji.emojiData);

Component({
  properties: {
    isDetail: { // 是否是评论的详情
      type: Boolean,
      value: false,
    },
    isFather: { // 是否是父级评论
      type: Boolean,
      value: false,
    },
    ssidType: { // 是否是帖子评论 1 => 帖子 || 0 => 漫画
      type: Number,
      value: 1,
    },
    comment: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
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
      const comment = this.properties.comment;
      const ssidType = this.properties.ssidType;
      app.globalData.fatherComment = comment;
      wx.navigateTo({
        url: `/pages/comment-detail/comment-detail?FatherId=${
          comment.id
        }&ssidType=${ssidType}`,
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
      wx.showToast({
        title: '点赞',
        icon: 'none',
      });
    },
  },
});
