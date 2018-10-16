// const cache = require('../utils/cache');
const app = getApp();

const postListParams = {
  // userIdentifier: app.globalData.comicUserInfo.Uid,
  satelliteId: 0,
  satelliteType: 1,
  starId: 0,
  page: 1,
  pagesize: 20,
};

/**
 * GET 获取热门帖子列表
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getPostList = (
  params = postListParams,
  success = () => {},
  fail = () => {},
) => {
  const userInfo = app.globalData.comicUserInfo;
  const Uid = userInfo && userInfo.Uid ? userInfo.Uid : 0;
  return wx.request({
    method: 'GET',
    url: 'https://community.321mh.com/satellite/gets/',
    data: {
      userIdentifier: Uid,
      userloglevel: 1,
      appId: 2,
      level: 1,
      isWater: -1,
      siteId: 8,
      satelliteId: 0,
      satelliteType: 1,
      starId: 0,
      isJoin: 0,
      page: 1,
      pagesize: 20,
      ...params,
    },
    success,
    fail,
  });
};

/**
 * POST 对帖子进行点赞
 * @param {*} data
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const postSupport = (data, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'PUT',
    url: 'https://community.321mh.com/satellite/support/',
    data: {
      appId: 2,
      authorization: `Bearer ${
        app.globalData.comicUserInfo.community_data.authcode
      }`,
      level: 1,
      siteId: 8,
      // satelliteId: 123147,
      // starId: 103722,
      // status: 'true',
      // titel: '小明太极亮相2018中国国际漫画节动漫游戏展',
      userIdentifier: app.globalData.comicUserInfo.Uid,
      userloglevel: 1,
      ...data,
    },
    header: {
      Authorization: `Bearer ${
        app.globalData.comicUserInfo.community_data.authcode
      }`,
    },
    success,
    fail,
  });
};

module.exports = {
  getPostList,
  postSupport,
};
