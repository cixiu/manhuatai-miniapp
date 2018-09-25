/**
 * GET 获取热门评论
 *
 * @param {object} params
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getHotCommentList = (
  params = { page: 1, ssid: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'https://community-hots.321mh.com/comment/hotlist/',
    data: {
      appId: 2,
      pagesize: 5,
      contentType: 3,
      ssidType: 1,
      ...params,
    },
    success,
    fail,
  });
};

/**
 * GET 获取最新的评论
 *
 * @param {object} params
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getNewCommentList = (
  params = { page: 1, ssid: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'https://community-hots.321mh.com/comment/newgets/',
    data: {
      appId: 2,
      pagesize: 20,
      ssidType: 1,
      sorttype: 1,
      commentType: 0,
      FatherId: 0,
      isWater: 0,
      ...params,
    },
    success,
    fail,
  });
};

module.exports = {
  getHotCommentList,
  getNewCommentList,
};
