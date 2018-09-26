const WxParse = require('../../../wxParse/wxParse');
const emoji = require('../../../data/emoji');

console.log(emoji.emojiData)

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
          WxParse.emojisInit('[]', "/wxParse/emojis/", emoji.emojiData)
          let content = newVal.content.replace(/\r\n/g, '\n\n');
          console.log(content);
          // if (content.match(/\[\/\]/))
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
