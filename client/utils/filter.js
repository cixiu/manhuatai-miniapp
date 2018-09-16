const app = getApp();

// 将 1:1 形式 转化为 1x1 根式
const convertRatioFormat = (ratioStr) => {
  let result = {};
  const ratioArr = ratioStr.split(':');
  const width = +ratioArr[0]; // 将数字字符串转成数字 + '1' => 1
  const height = +ratioArr[1];
  const ratio = width / height;

  result.ratio = ratio;

  // 如果比例是2:1 则需要_2_1.jpg的图片
  if (ratio === 2) {
    result.cover = '_2_1';
  }

  if (ratio % 1 === 0) {
    result.sizeFix = `m${ratio}x1`;
  } else {
    result.sizeFix = `m${width}x${height}`;
  }
  return result;
};

// 深克隆对象
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

// 将要显示的图片列表数据过滤成需要的格式
const filterDataList = (dataObj = { comic_info: [] }, start, end) => {
  // 需要深拷贝一份dataObj 防止修改源数据造成一些意想不到的bug
  const data = deepClone(dataObj);
  const bookConfig = data.config;
  // jpg格式
  // const { image_size_suffix, image_default_suffix } = app.globalData.config;

  // webp格式
  const { image_size_webp: image_size_suffix } = app.globalData.config;
  const image_default_suffix = image_size_suffix.default_webp;

  const ratioResult = convertRatioFormat(bookConfig.horizonratio);
  const suffix_value = image_size_suffix[ratioResult.sizeFix];
  const cover = ratioResult.cover;
  let sliceList;

  if (end !== undefined) {
    sliceList = data.comic_info.slice(start, end);
  } else {
    sliceList = data.comic_info.slice();
  }

  const filterList = sliceList.map((comic) => {
    if (!comic.img_url) {
      comic.img_url = `/mh/${comic.comic_id}${cover ? cover : ''}.jpg${suffix_value}`;
      return comic;
    }
    if (/^\//.test(comic.img_url)) {
      comic.img_url = `${comic.img_url}${image_default_suffix}`;
      return comic;
    }
    comic.img_url = `/${comic.img_url}${image_default_suffix}`;
    return comic;
  });

  return filterList;
};

// 根据粉丝的uid 拼出粉丝头像的url
const filterFansList = (fansList = []) => {
  let resultFansList = [];
  // 需要深拷贝一份fansList 防止修改源数据造成一些意想不到的bug
  const fansListCopy = deepClone(fansList);
  const LEN = 9;
  resultFansList = fansListCopy.map((item) => {
    let fansUidStr = '' + item.uid;
    // 在数字字符串前补0至9位数字的字符串  '1234567' => '001234567'
    for (let i = fansUidStr.length; i < LEN; i = fansUidStr.length) {
      fansUidStr = '0' + fansUidStr;
    }
    // 将补0后的字符串数字切成千分位 001234567 => 001,234,567
    fansUidStr = fansUidStr.replace(/\d{1,3}(?=(\d{3})+$)/g, (match) => {
      return match + ',';
    });
    // 将千分位的字符串数字按照','切分成['001', '234', '567']
    const fansUidArr = fansUidStr.split(',');
    const fansAvatarImgHost = 'https://image.samanlehua.com/file/kanmanhua_images/head/';
    item.img_url = `${fansAvatarImgHost}${fansUidArr[0]}/${fansUidArr[1]}/${fansUidArr[2]}.jpg-100x100.webp`;

    return item;
  });

  return resultFansList;
};

module.exports = {
  filterDataList,
  convertRatioFormat,
  filterFansList,
  deepClone,
};
