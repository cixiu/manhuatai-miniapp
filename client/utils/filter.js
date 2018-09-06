const app = getApp();

// 将 1:1 形式 转化为 1x1 根式
const convertRatioFormat = (ratioStr) => {
  let result = {};
  const ratioArr = ratioStr.split(':');
  const width = +ratioArr[0]; // 将数字字符串转成数字 + '1' => 1
  const height = +ratioArr[1];
  const ratio = width / height;

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

// 将要显示的图片列表数据过滤成需要的格式
const filterDataList = (dataObj = { comic_info: [] }, start, end) => {
  // 需要深拷贝一份dataObj 防止修改源数据造成一些意想不到的bug
  const data = JSON.parse(JSON.stringify(dataObj));
  const bookConfig = data.config;
  const { image_size_suffix, image_default_suffix } = app.globalData.config;
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

module.exports = {
  filterDataList,
  convertRatioFormat,
};
