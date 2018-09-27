/**
 * GET 获取热门搜索列表
 *
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getHotSearchList = (success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://community.321mh.com/star/hotsearchs/',
    data: {
      page: 1,
      pagesize: 10,
      userloglevel: 1,
      AppId: 2,
      level: 1,
      siteId: 8,
    },
    success,
    fail,
  });
};

/**
 * GET 搜索漫画
 *
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const searchComic = (searchKey, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://getconfig-globalapi.yyhao.com/app_api/v5/serachcomic/',
    // 这个接口的search单词是错误的😂😂
    data: {
      serachKey: searchKey,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

module.exports = {
  getHotSearchList,
  searchComic,
};
