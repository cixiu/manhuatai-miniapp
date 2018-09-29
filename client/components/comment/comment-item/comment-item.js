const WxParse = require('../../../wxParse/wxParse');
const emoji = require('../../../data/emoji');
const app = getApp();

WxParse.emojisInit('[]', '/wxParse/emojis/', emoji.emojiData);

Component({
  properties: {
    isDetail: {
      type: Boolean,
      value: false,
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
              /\{emoji\:(馒头仔\/\d+)\}/g,
              `<img style="width: 84rpx; height: 84rpx;" src="${imgHost}$1${suffix}"/>`,
            )
            .replace(/\[url:.*?[^\]].*?\]/g, '');

          WxParse.wxParse('content', 'md', content, this);
        }
      },
    },
  },
  methods: {
    goToCommentDetail: function(e) {
      if (this.properties.isDetail) {
        return;
      }
      const comment = this.properties.comment;
      app.globalData.fatherComment = comment;
      wx.navigateTo({
        url: `/pages/comment-detail/comment-detail?FatherId=${comment.id}`,
      });
    },
  },
});
