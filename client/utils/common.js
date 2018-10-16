const cache = require('./cache.js');

const navigateToLogin = () => {
  return wx.navigateTo({
    url: '/pages/login/login',
  });
};

// 是否登录了
const hasLogin = () => {
  // 如果storage中没有userInfo的信息（即用户没有登录）,则跳转去登录
  const userInfo = cache.loadUserInfo();
  if (!userInfo.Uid) {
    return false;
  }
  return true;
};

module.exports = {
  navigateToLogin,
  hasLogin,
};
