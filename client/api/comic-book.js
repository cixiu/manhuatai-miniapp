/**
 * GET 获取指定书籍的漫画列表
 * @param {*} book_id book的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getBookInfo = (book_id, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://getconfig-globalapi.yyhao.com/app_api/v5/getbookinfo/',
    data: {
      book_id, // book的id
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail
  });
};

module.exports = {
  getBookInfo
}
