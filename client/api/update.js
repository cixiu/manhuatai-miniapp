/**
 * GET 获取更新列表
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getUpdateList = (success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://getconfig-globalapi.yyhao.com/app_api/v5/updatelist/',
    data: {
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail,
  });
};

module.exports = {
  getUpdateList,
};
