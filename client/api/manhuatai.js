const postListParams = {
  userIdentifier: 59054484,
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
  return wx.request({
    method: 'GET',
    url: 'https://community.321mh.com/satellite/gets/',
    data: {
      userIdentifier: 59054484,
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

module.exports = {
  getPostList,
};
