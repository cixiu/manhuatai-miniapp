/**
 * GET 获取指定类型书籍的漫画列表
 * @param {*} page 页码
 * @param {*} orderby 排序方式
 * @param {*} comic_sort 漫画类型
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getSortList = (
  page,
  orderby = 'click',
  comic_sort = '',
  search_key = '',
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'https://getcomicinfo-globalapi.yyhao.com/app_api/v5/getsortlist/',
    data: {
      page,
      orderby,
      comic_sort,
      search_key,
      search_type: '',
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

/**
 * GET 获取相关用户作者出品的漫画
 * @param {*} page 页码
 * @param {*} orderby 排序方式
 * @param {*} newsid 作者的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getSearchAuthorComic = (
  page,
  orderby = 'click',
  newsid,
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'http://getcomicinfo-globalapi.yyhao.com/app_api/v5/getsearchauthor_comic/',
    data: {
      page,
      orderby,
      newsid,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

module.exports = {
  getSortList,
  getSearchAuthorComic,
};
