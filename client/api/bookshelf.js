const app = getApp();

/**
 * POST 获取登录用户的收藏和历史记录
 *
 * @param {*} data object
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getUserRecord = (
  data = { type: 'mkxq', openid: 0, myuid: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'POST',
    url: 'https://getuserrecord-globalapi.yyhao.com/app_api/v5/getuserrecord/',
    data: {
      // type: 'mkxq',
      // openid: '11723460_D560BECD3731F869023144B2C2002BDB',
      // myuid: 58095618,
      autologo: 1,
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
 * POST 删除登录用户的阅读历史记录
 *
 * @param {*} data object
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const deleteUserRead = (
  data = { type: 'mkxq', openid: 0, myuid: 0, comic_id: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'POST',
    url: 'https://adduserread-globalapi.yyhao.com/app_api/v5/deluserread/',
    data: {
      // type: 'mkxq',
      // openid: '11723460_D560BECD3731F869023144B2C2002BDB',
      // myuid: 58095618,
      // comic_id: 106459,
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
 * POST 登录用户后添加的阅读历史记录
 *
 * @param {*} data object
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const addUserRead = (
  data = {
    type: 'mkxq',
    openid: 0,
    myuid: 0,
    comic_id: 0,
    chapter_id: 0,
    chapter_name: '',
    chapter_page: 1,
  },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'POST',
    url: 'https://adduserread-globalapi.yyhao.com/app_api/v5/adduserread/',
    data: {
      // type: 'mkxq',
      // openid: '11723460_D560BECD3731F869023144B2C2002BDB',
      // myuid: 58095618,
      // comic_id: 106459,
      userauth: app.globalData.comicUserInfo.task_data.authcode,
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
 * POST 设置登录用户的收藏漫画(添加或者删除)
 *
 * @param {*} data object
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const setUserCollect = (
  data = {
    type: 'mkxq',
    openid: 0,
    myuid: 0,
    comic_id_list: '',
    action: '',
    comic_id: '',
  },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'POST',
    url: 'https://getconfig-globalapi.yyhao.com/app_api/v5/setusercollect/',
    data: {
      // type: 'mkxq',
      // openid: '11723460_D560BECD3731F869023144B2C2002BDB',
      // myuid: 58095618,
      // comic_id_list: '106459', 删除为comic_id_list  添加为comic_id
      // action: 'dels', dels => 删除收藏， add => 添加收藏
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
  getUserRecord,
  deleteUserRead,
  addUserRead,
  setUserCollect,
};
