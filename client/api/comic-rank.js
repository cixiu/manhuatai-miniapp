const filter = require('../utils/filter');

/**
 * GET 排行榜类型
 */
const getRankTypes = (success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://rankdata-globalapi.321mh.com/app_api/v1/comic/getRankTypes/',
    data: {
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

/**
 * GET 获取排行榜类型的详细信息
 * @param {*} params
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getRankDataDetials = (
  params = {
    sort_type: 'all',
    rank_type: 'heat',
    time_type: 'week',
  },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url:
      'https://rankdata-globalapi.321mh.com/app_api/v1/comic/getRankDataDetials/',
    data: {
      ...params,
      query_time: filter.formatTime(new Date()),
      product_id: 2,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

module.exports = {
  getRankTypes,
  getRankDataDetials,
};
