/**
 * POST 获取测试用户的信息
 *
 * 此为漫画台测试的用户信息，目的是获取一些api接口需要的authcode
 *
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getComicUserInfo = (success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'POST',
    url: 'https://getuserinfo-globalapi.yyhao.com/app_api/v5/getuserinfo/',
    data: {
      type: 'device',
      openid: 'B9FFF508874DEB04C2FB4218F2444B66',
      productname: 'mht',
      platformname: 'android',
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success,
    fail
  });
};

module.exports = {
  getComicUserInfo
}
