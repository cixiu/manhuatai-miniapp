/**
 * GET 获取指定类型书籍的漫画列表
 * @param {*} page 页码
 * @param {*} ssid 帖子的id
 * @param {*} FatherId 帖子中的某个评论的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getNewCommentList = (
  page,
  ssid,
  FatherId,
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'https://community-hots.321mh.com/comment/newgets/',
    data: {
      appId: 2,
      page,
      pagesize: 20,
      ssid,
      ssidType: 1,
      sorttype: 1,
      commentType: 1,
      FatherId,
      isWater: -1,
    },
    success,
    fail,
  });
};

module.exports = {
  getNewCommentList,
};
