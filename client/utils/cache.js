// 操作本地缓存
// wx.getStorage(Object object)
// wx.setStorage(Object object)
// wx.removeStorage(Object object)
// wx.clearStorage(Object object)

// 历史阅读的key
const HISTORY_READ_KEY = '__history__';
// 历史阅读最多存储20条数据
const HISTORY_READ_MAX_LENGTH = 20;

// 收藏的漫画的key
const COLLECTION_KEY = '__collection__';
const COLLECTION_MAX_LENGTH = 20;

// 搜索词
const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

// 登录用户
const USER_INFO_KEY = '__userinfo__';

const insertArray = (arr, val, compare, maxLen) => {
  const index = arr.findIndex(compare);
  // 如果已经存在 则需要更新一下已经存在的数据
  if (index === 0) {
    arr[index] = val;
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
};

const deleteFromArray = (arr, compare) => {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
};

// 将阅读过的漫画存入storage中
const saveHistoryRead = (comic) => {
  let historyReads = wx.getStorageSync(HISTORY_READ_KEY) || [];
  insertArray(
    historyReads,
    comic,
    (item) => {
      return item.comic_id === comic.comic_id;
    },
    HISTORY_READ_MAX_LENGTH,
  );
  wx.setStorageSync(HISTORY_READ_KEY, historyReads);
  return historyReads;
};

// 读取阅读过的漫画列表
const loadHistoryRead = () => {
  return wx.getStorageSync(HISTORY_READ_KEY) || [];
};

// 删除一条阅读历史记录
const deleteHistoryRead = (comic) => {
  let historyReads = wx.getStorageSync(HISTORY_READ_KEY) || [];
  deleteFromArray(historyReads, (item) => {
    return item.comic_id === comic.comic_id;
  });
  wx.setStorageSync(HISTORY_READ_KEY, historyReads);
  return historyReads;
};

// 收藏漫画
const saveComic = (comic) => {
  if (Array.isArray(comic)) {
    wx.setStorageSync(COLLECTION_KEY, comic);
    return collections;
  }

  let collections = wx.getStorageSync(COLLECTION_KEY) || [];
  insertArray(
    collections,
    comic,
    (item) => {
      return item.comic_id === comic.comic_id;
    },
    COLLECTION_MAX_LENGTH,
  );
  wx.setStorageSync(COLLECTION_KEY, collections);
  return collections;
};

// 读取收藏过的漫画列表
const loadCollections = () => {
  return wx.getStorageSync(COLLECTION_KEY) || [];
};

// 删除一条收藏过的漫画
const deleteCollection = (comic) => {
  let collections = wx.getStorageSync(COLLECTION_KEY) || [];
  deleteFromArray(collections, (item) => {
    return item.comic_id === comic.comic_id;
  });
  wx.setStorageSync(COLLECTION_KEY, collections);
  return collections;
};

const clearCollection = () => {
  wx.removeStorageSync(COLLECTION_KEY);
  return [];
};

// 保存搜索历史进storage中
const saveSearch = (query) => {
  let searches = wx.getStorageSync(SEARCH_KEY) || [];
  insertArray(
    searches,
    query,
    (item) => {
      return item === query;
    },
    SEARCH_MAX_LENGTH,
  );
  wx.setStorageSync(SEARCH_KEY, searches);
  return searches;
};

// 读取搜索历史的storage中
const loadSearch = () => {
  return wx.getStorageSync(SEARCH_KEY) || [];
};

// 删除一条搜索历史记录
const deleteSearch = (query) => {
  let searches = wx.getStorageSync(SEARCH_KEY) || [];
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  wx.setStorageSync(SEARCH_KEY, searches);
  return searches;
};

// 清空搜索历史和本地缓存
const clearSearch = () => {
  wx.removeStorageSync(SEARCH_KEY);
  return [];
};

// 存储登录用户信息
const saveUserInfo = (userInfo = {}) => {
  wx.setStorageSync(USER_INFO_KEY, userInfo);
  return userInfo;
};

// 读取登录的用户信息
const loadUserInfo = () => {
  return wx.getStorageSync(USER_INFO_KEY) || {};
};

// 清空登录的用户信息 => 退出登录
const clearUserInfo = () => {
  wx.removeStorageSync(USER_INFO_KEY);
  return {};
};

module.exports = {
  saveHistoryRead,
  loadHistoryRead,
  deleteHistoryRead,
  saveComic,
  loadCollections,
  deleteCollection,
  clearCollection,
  saveSearch,
  loadSearch,
  deleteSearch,
  clearSearch,
  saveUserInfo,
  loadUserInfo,
  clearUserInfo,
};
