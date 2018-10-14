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

module.exports = {
  setComicUserInfo,
};
