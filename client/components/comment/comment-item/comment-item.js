const WxParse = require('../../../wxParse/wxParse');
const emoji = require('../../../data/emoji');

Component({
  data: {
    placeholderUrl: '',
  },
  properties: {
    comment: {
      type: Object,
      value: {},
      observer: function(newVal) {
        if (newVal && newVal.id) {
          // 初始化emoji设置
          WxParse.emojisInit('[]', '/wxParse/emojis/', emoji.emojiData);

          const imgHost = 'https://image.zymk.cn/file/emot/';
          const suffix = '.gif';
          let content = newVal.content.replace(/\r\n/g, '\n\n');
          content = content.replace(
            /\{emoji\:(馒头仔\/\d+)\}/g,
            `<img style="width: 84rpx; height: 84rpx;" src="${imgHost}$1${suffix}"/>`,
          );
          WxParse.wxParse('content', 'md', content, this);
        }
      },
    },
  },
  methods: {
    // 图片加载失败时，使用默认的占位图代替
    loadError: function(e) {
      this.setData({
        placeholderUrl: '/img/pic_cache.png',
      });
    },
  },
});
