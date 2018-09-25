/**
 * GET 获取评论用户的信息
 *
 * @param {Array | number} 用户的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getCommentUser = (userids, success = () => {}, fail = () => {}) => {
  let dataStr = '?';
  userids.forEach((item) => {
    dataStr += `userids=${item}&`;
  });
  return wx.request({
    method: 'GET',
    url: `https://task-globalapi.yyhao.com/user/commentuser/${dataStr}`,
    // data: {
    //   userids: userids,
    //   userids: userids,
    // },
    success,
    fail,
  });
};

module.exports = {
  getCommentUser,
};
