const apiManhuatai = require('../../api/manhuatai');
const common = require('../../utils/common');

/**
 * 帖子列表组件
 * 关于proper postList属性说明
 * postList属性可以采用2种方法
 * 一种是：将处理好的数据传递进组件
 * 另一种是：将未处理的数据传递进组件，之后在组件中进行数据处理
 *
 * 这里使用第一种方案
 *        因为在漫画台热门帖子中有上滑加载更多的功能，导致postList会越来越大。如果在组件中处理，那么每次父组件更新
 *        postList时，会导致子组件也会更新postList,也就是再次处理传递进来的数据。每次更新都会导致数据需要全部
 *        重新处理，如果数据一多，则会导致setData每次更新的数据越来越大。而在父组件中，我们可以根据请求的新数据做
 *        局部的更新
 */

Component({
  properties: {
    postList: {
      type: Array,
      value: [],
    },
  },
  methods: {
    // 预览图片
    previewImage: function(e) {
      const index = e.currentTarget.dataset.index;
      const previewIndex = e.currentTarget.dataset.previewIndex;
      // 将图片转成没有裁切的大图 -- 图片预览的时候使用
      const previewImages = this.properties.postList[index].Images.map(
        (imgItem) => {
          return imgItem.replace('200x200', 'noresize');
        },
      );
      const current = previewImages[previewIndex];
      wx.previewImage({
        urls: previewImages,
        current,
      });
    },
    // 前往帖子详情查看
    goToPost: function(e) {
      const { item, index } = e.currentTarget.dataset;
      const satelliteId = item.Id;
      const starId = item.StarId;
      const userIdentifier = item.UserIdentifier;
      wx.navigateTo({
        url: `/pages/post/post?satelliteId=${satelliteId}&starId=${starId}&userIdentifier=${userIdentifier}&index=${index}`,
      });
    },
    // 点赞帖子
    postSupport: function(e) {
      // 如果没有登录，则跳转去登录
      if (!common.hasLogin()) {
        return common.navigateToLogin();
      }

      const { item, index } = e.currentTarget.dataset;
      const IsSupport = !item.IsSupport;
      const SupportNum = item.IsSupport
        ? item.SupportNum - 1
        : item.SupportNum + 1;

      const requestData = {
        satelliteId: item.Id,
        starId: item.StarId,
        status: IsSupport,
        titel: item.Title,
      };
      apiManhuatai.postSupport(requestData);

      let pages = getCurrentPages();
      let currentPage = null; // 当前页面

      if (pages.length >= 1) {
        currentPage = pages[pages.length - 1]; // 当前页面
      }

      if (currentPage) {
        currentPage.setData({
          [`postList[${index}].IsSupport`]: IsSupport,
          [`postList[${index}].SupportNum`]: SupportNum,
        });
      }
    },
  },
});
