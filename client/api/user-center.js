/**
 * POST 修改用户的个人资料
 *
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const setComicUserInfo = (data = {}, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: 'https://getconfig-globalapi.yyhao.com/app_api/v5/setuserinfo/',
    data: {
      type: 'mkxq',
      // openid: undefined,
      // myuid: undefined,
      // action: '',
      // value: '',
      'client-type': 'android',
      productname: 'mht',
      platformname: 'android',
      ...data,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success,
    fail,
  });
};

/**
 * GET 获取标签列表
 *
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getTagsList = (success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://punch-globalapi.321mh.com/app_api/v1/tags/gettagslist/',
    data: {
      productname: 'mht',
      platformname: 'android',
    },
    success,
    fail,
  });
};

/**
 * POST 获取用户的标签列表
 *
 * @param {*} userid 用户的Uid
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getTagsInfo = (userid, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: 'https://punch-globalapi.321mh.com/app_api/v1/tags/tagsInfo/',
    data: {
      userid,
      'client-type': 'android',
      productname: 'mht',
      platformname: 'android',
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success,
    fail,
  });
};

/**
 * POST 修改用户的标签列表
 *
 * @param {*} data
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const addUserTags = (data = {}, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: 'https://punch-globalapi.321mh.com/app_api/v1/tags/addtags/',
    data: {
      // userauth: '',
      // type: 1,
      // extraid: '[]',
      'client-type': 'android',
      productname: 'mht',
      platformname: 'android',
      ...data,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success,
    fail,
  });
};

module.exports = {
  setComicUserInfo,
  getTagsList,
  getTagsInfo,
  addUserTags,
};
