// 操作本地缓存
// wx.getStorage(Object object)
// wx.setStorage(Object object)
// wx.removeStorage(Object object)
// wx.clearStorage(Object object)

// 历史阅读的key
const HISTORY_READ_KEY = '__history__';
// 历史阅读最多存储20条数据
const HISTORY_READ_MAX_LENGTH = 20;

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

// 将阅读过的漫画存入storage中
const saveHistoryRead = (comic) => {
  let historyReads = wx.getStorageSync(HISTORY_READ_KEY) || [];
  insertArray(historyReads, comic, (item) => {
    return item.comic_id === comic.comic_id
  }, HISTORY_READ_MAX_LENGTH);
  wx.setStorageSync(HISTORY_READ_KEY, historyReads);
  return historyReads;
};

const loadHistoryRead = () => {
  return wx.getStorageSync(HISTORY_READ_KEY) || [];
}

module.exports = {
  saveHistoryRead,
  loadHistoryRead
}
