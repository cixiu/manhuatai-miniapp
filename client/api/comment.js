const app = getApp();

/**
 * GET 获取评论的数量
 *
 * @param {object} params
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getCommentCount = (
  params = { ssid: 0, ssidType: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'https://community-hots.321mh.com/comment/count/',
    data: {
      appId: 2,
      commentType: 2,
      ssid: 0,
      ssidType: 0,
      ...params,
    },
    success,
    fail,
  });
};

/**
 * GET 获取热门评论
 *
 * @param {object} params
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getHotCommentList = (
  params = { page: 1, ssid: 0, ssidType: 1 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    url: 'https://community-hots.321mh.com/comment/hotlist/',
    data: {
      appId: 2,
      pagesize: 5,
      contentType: 3,
      ssidType: 1,
      ...params,
    },
    success,
    fail,
  });
};

/**
 * GET 获取最新的评论
 *
 * @param {object} params
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getNewCommentList = (
  params = { page: 1, ssid: 0, ssidType: 1, FatherId: 0, isWater: 0, commentType: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'GET',
    // url: 'https://community-hots.321mh.com/comment/newgets/',
    url: 'https://community.321mh.com/comment/newgets/',
    data: {
      appId: 2,
      page: 1,
      pagesize: 20,
      ssidType: 1,
      sorttype: 1,
      commentType: 0,
      FatherId: 0,
      isWater: 0,
      ...params,
    },
    success,
    fail,
  });
};

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
  dataStr = dataStr.replace(/&$/, '');
  return wx.request({
    method: 'GET',
    // url: `https://task-globalapi.yyhao.com/user/commentuser/${dataStr}`,
    url: `https://community-hots.321mh.com/user/commentuser/${dataStr}`,
    success,
    fail,
  });
};

/**
 * POST 对帖子或者漫画的评论进行点赞
 * @param {*} data
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const commentSupport = (data, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'PUT',
    url: 'https://community.321mh.com/comment/support/',
    data: {
      appId: 2,
      authorization: `Bearer ${
        app.globalData.comicUserInfo.community_data.authcode
      }`,
      level: 1,
      siteId: 8,
      // commentId: 2432543,
      // ssid: 123147,
      // ssidType: 1, 1 => 帖子的评论 || 0 => 漫画的评论
      // status: 1, 1 => 点赞 || 0 => 取消点赞
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

const postComment = (data, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: `https://community.321mh.com/comment/add/?FatherId=${data.fatherId}`,
    data: {
      appId: 2,
      authorization: `Bearer ${
        app.globalData.comicUserInfo.community_data.authcode
      }`,
      // content: '想去',
      // fatherId: 0, // 帖子评论的id 0表示对帖子的评论 其他表示对评论的回复
      images: '[]',
      level: 1,
      // opreateId: 57676894, // 帖子或者评论的作者id  0表示评论的漫画
      relateId: '',
      // satelliteId: 123147, // 吐槽帖子时帖子的id  0表示不是对帖子的吐槽
      selfName: app.globalData.comicUserInfo.Uname, // 吐槽评论的用户名
      siteId: 8,
      // ssid: 123147, // 帖子的id 或者漫画的id
      // ssidType: 1, // 1表示帖子 0表示漫画
      // starId: 103722, // 0表示回复或者漫画 其他表示帖子中的StarId字段
      // title: '小明太极亮相2018中国国际漫画节动漫游戏展', // 帖子的标题 或者 漫画的名称
      // url: '', // 帖子为空 漫画为comic_share_url
      userIdentifier: app.globalData.comicUserInfo.Uid, // 吐槽评论的用户Uid
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
  getCommentCount,
  getHotCommentList,
  getNewCommentList,
  getCommentUser,
  commentSupport,
  postComment,
};
