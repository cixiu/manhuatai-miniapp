/**
 * GET | DETAIL 获取指定漫画的主体信息
 * @param {*} comic_id 漫画的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getComicInfoBody = (comic_id, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://getcomicinfo-globalapi.yyhao.com/app_api/v5/getcomicinfo_body/',
    data: {
      comic_id, // 漫画的id
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail
  });
};

/**
 * GET | DETAIL 获取指定漫画的作者和角色信息
 * @param {*} comic_id 漫画的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getComicInfoRole = (comic_id, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://getcomicinfo-globalapi.yyhao.com/app_api/v5/getcomicinfo_role/',
    data: {
      comic_id, // 漫画的id
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail
  });
};

/**
 * GET | DETAIL 获取指定漫画的人气活跃数据
 * @param {*} comic_id 漫画的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getComicInfoInfluence = (comic_id, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://influence.321mh.com/app_api/v5/getcomicinfo_influence/',
    data: {
      comic_id, // 漫画的id
      rank_type: 'all',
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail
  });
};

/**
 * GET | COUNT 获取指定漫画的评论(吐槽)数量
 * @param {*} comic_id 漫画的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getComicCommentCount = (comic_id, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://community-hots.321mh.com/comment/count/',
    data: {
      appId: 2,
      commentType: 2,
      ssid: comic_id, // 漫画的id
      ssidType: 0,
    },
    success,
    fail
  });
};

/**
 * POST 获取指定漫画的推荐相关的列表
 * @param {*} comic_id 漫画的id
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getBookByComicid = (comic_id, userauth, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: 'https://recommend-globalapi.321mh.com/app_api/v1/comic/getBookByComicid/',
    data: {
      booktype: 'detail',
      platform: 8,
      productname: 'mht',
      platformname:	'android',
      userauth,
      comic_id,
    },
    success,
    fail
  });
};

module.exports = {
  getComicInfoBody,
  getComicInfoRole,
  getComicInfoInfluence,
  getComicCommentCount,
  getBookByComicid
}
