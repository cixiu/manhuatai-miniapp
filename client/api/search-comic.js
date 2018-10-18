const app = getApp();

/**
 * GET 获取搜索词的漫画列表
 * @param {*} page 页码
 * @param {*} search_key 搜索词
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getSortList = (page, search_key, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://getcomicinfo-globalapi.yyhao.com/app_api/v5/getsortlist/',
    data: {
      page,
      size: 7,
      orderby: 'click',
      comic_sort: '',
      search_type: '',
      comic_sort: '',
      search_key,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

/**
 * GET 获取搜索词的作者列表
 * @param {*} page 页码
 * @param {*} search_key 搜索词
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
    url: 'https://getcomicinfo-globalapi.yyhao.com/app_api/v5/getsearchauthor/',
    data: {
      page,
      size: 3,
      search_key,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

/**
 * GET 获取搜索词的帖子列表
 * @param {*} page 页码
 * @param {*} search_key 搜索词
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getSearchPostList = (search_key, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://community.321mh.com/satellite/gets/',
    data: {
      userIdentifier: app.globalData.comicUserInfo.Uid,
      userloglevel: 1,
      appId: 2,
      level: 1,
      isWater: -1,
      siteId: 8,
      satelliteId: 0,
      satelliteType: 0,
      starId: 0,
      isJoin: 0,
      keyWord: search_key,
    },
    success,
    fail,
  });
};

module.exports = {
  getSortList,
  getSearchAuthor,
  getSearchPostList,
};
