/**
 * GET | LIST 获取首页的推荐列表
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getBookList = (pytype = '', booktype = 132, success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    // url: 'https://kanmanapi-main.321mh.com/v1/book/getBookByType/',
    url: 'https://cms-booklist.321mh.com/api/v1/bookList/getBookByType',
    data: {
      pagesize: 40,
      page: 1,
      pytype, // book的拼音
      booktype, // book的id 132表示男版， 133表示女版
      platform: 8,
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail
  });
};

/**
 * GET | LIST 获取首页的排行列表
 * @param {*} success 请求成功后的回调函数
 * @param {*} fail 请求失败后的回调函数
 */
const getRankList = (success = () => {}, fail = () => {}) => {
  return wx.request({
    method: 'GET',
    url: 'https://rankdata-globalapi.321mh.com/app_api/v1/comic/getIndexRankData/',
    data: {
      platformname: 'android',
      productname: 'mht',
    },
    success,
    fail
  });
};

module.exports = {
  getBookList,
  getRankList
}
