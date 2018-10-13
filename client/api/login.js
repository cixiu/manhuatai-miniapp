/**
 * POST 获取短信验证码
 *
 * @param {*} mobile 手机号
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const sendsms = (
  data = { mobile: 0, imgCode: '', refresh: 1 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'POST',
    url: 'https://sms.321mh.com/user/v1/sendsms',
    data: {
      mobile: 0,
      service: 'kmn',
      countryCode: '',
      imgCode: '',
      refresh: 1, // 1表示刷新 0表示添加了imgCode
      'client-type': 'android',
      platformname: 'android',
      productname: 'mht',
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
 * POST 获取短信验证码
 *
 * @param {*} mobile 手机号
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const mobilebind = (
  data = { mobile: 0, vcode: 0 },
  success = () => {},
  fail = () => {},
) => {
  return wx.request({
    method: 'POST',
    url: 'http://mkxq.zymk.cn/user/v1/mobilebind/',
    data: {
      mobile: 0,
      vcode: 0,
      'client-type': 'android',
      platformname: 'android',
      productname: 'mht',
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
 * POST 获取用户的信息
 *
 * @param {string} token 用户的token
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getComicUserInfo = (data = {}, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: 'https://getuserinfo-globalapi.yyhao.com/app_api/v5/getuserinfo/',
    data: {
      type: 'mkxq',
      // token: undefined,
      // openid: undefined,
      // myuid: undefined,
      // autologo: undefined,
      'client-type': 'android',
      platformname: 'android',
      productname: 'mht',
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
  sendsms,
  mobilebind,
  getComicUserInfo,
};
