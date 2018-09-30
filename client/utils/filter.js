const app = getApp();

// 将时间转成 yyyy-mm-dd 格式
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('-');
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

// 计算宽高比
const computedRatio = (ratioStr) => {
  const ratioArr = ratioStr.split(':');
  const width = +ratioArr[0]; // 将数字字符串转成数字 + '1' => 1
  const height = +ratioArr[1];
  const ratio = width / height;

  return ratio;
}

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
  const { image_size_suffix, image_default_suffix } = app.globalData.config;

  // webp格式
  // const { image_size_webp: image_size_suffix } = app.globalData.config;
  // const image_default_suffix = image_size_suffix.default_webp;

  const ratioResult = convertRatioFormat(bookConfig.horizonratio);
  const suffix_value = image_size_suffix[ratioResult.sizeFix] || ''; // 图片的后缀
  let cover = ratioResult.cover;
  if (!suffix_value) {
    cover = '_2_1';
  }
  let sliceList;
  // console.log(`${data.title}: ${suffix_value}`)

  if (end !== undefined) {
    sliceList = data.comic_info.slice(start, end);
  } else {
    sliceList = data.comic_info.slice();
  }

  const filterList = sliceList.map((comic) => {
    if (!comic.img_url || comic.img_url === '/') {
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

/**
 * 通过id 拼出图片的url
 * @param {*} id
 * @param {*} imgHost
 * @param {*} size m2x1 m3x4 ...
 */
const makeImgUrlById = (id, imgHost, size = 'm3x4') => {
  let idStr = '' + id;
  const LEN = 9;
  // 在数字字符串前补0至9位数字的字符串  '1234567' => '001234567'
  for (let i = idStr.length; i < LEN; i = idStr.length) {
    idStr = '0' + idStr;
  }
  // 将补0后的字符串数字切成千分位 001234567 => 001,234,567
  idStr = idStr.replace(/\d{1,3}(?=(\d{3})+$)/g, (match) => {
    return match + ',';
  });
  // 将千分位的字符串数字按照','切分成['001', '234', '567']
  const idStrArr = idStr.split(',');
  const idStrArr0 = idStrArr[0];
  const idStrArr1 = idStrArr[1];
  const idStrArr2 = idStrArr[2];
  const suffix = app.globalData.config.image_size_suffix[size];  // jpg格式后缀
  // const suffix = app.globalData.config.image_size_webp[size]; // webp格式后缀
  const imgUrl = `${imgHost}${idStrArr0}/${idStrArr1}/${idStrArr2}.jpg${suffix}`;

  return imgUrl;
}

// 根据粉丝的uid 拼出粉丝头像的url
const filterFansList = (fansList = []) => {
  let resultFansList = [];
  // 需要深拷贝一份fansList 防止修改源数据造成一些意想不到的bug
  const fansListCopy = deepClone(fansList);
  const LEN = 9;
  const fansAvatarImgHost = 'https://image.samanlehua.com/file/kanmanhua_images/head/';
  resultFansList = fansListCopy.map((item) => {
    const id = item.uid || item.Uid || item.useridentifier;
    item.img_url = makeImgUrlById(id, fansAvatarImgHost, 'l1x1');

    return item;
  });

  return resultFansList;
};

// 根据漫画id 拼出m3x4格式的图片url
const fitlerM3x4Format = (list = []) => {
  if (list.length === 0) {
    return list;
  }
  const imgHost = app.globalData.imgHost;
  // jpg格式
  const { image_size_suffix, image_default_suffix } = app.globalData.config;

  // webp格式
  // const { image_size_webp: image_size_suffix } = app.globalData.config;
  const m3x4 = image_size_suffix['m3x4'];
  return list.map((item) => {
    const comic_id = item.comic_id;
    item.img_url = `${imgHost}/mh/${comic_id}.jpg${m3x4}`;
    return item;
  });
};

// 根据漫画id 拼出m2x1格式的图片url
const fitlerM2x1Format = (list = [], img_url_key = 'img_url') => {
  if (list.length === 0) {
    return list;
  }
  const imgHost = app.globalData.imgHost;
  // jpg格式
  const { image_size_suffix, image_default_suffix } = app.globalData.config;

  // webp格式
  // const { image_size_webp: image_size_suffix } = app.globalData.config;
  const m2x1 = image_size_suffix['m2x1'];
  return list.map((item) => {
    const comic_id = item.comic_id;
    if (!item[img_url_key]) {
      item[img_url_key] = `${imgHost}/mh/${comic_id}_2_1.jpg${m2x1}`;
    }
    return item;
  });
};

module.exports = {
  formatTime,
  computedRatio,
  filterDataList,
  convertRatioFormat,
  filterFansList,
  deepClone,
  fitlerM3x4Format,
  fitlerM2x1Format,
  makeImgUrlById
};
