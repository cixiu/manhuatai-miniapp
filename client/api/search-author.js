/**
 * GET 获取相关用户作者
 * @param {*} page 页码
 * @param {*} orderby 排序方式
 * @param {*} newsid 作者的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getSearchAuthor = (
  page,
  search_key,
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url:
      'http://getcomicinfo-globalapi.yyhao.com/app_api/v5/getsearchauthor/',
    data: {
      page,
      size: 20,
      search_key,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

module.exports = {
  getSearchAuthor,
};
