const filterDataList = (data = [], start, end) => {
  let sliceList;
  if (end !== undefined) {
    sliceList = data.slice(start, end);
  } else {
    sliceList = data.slice();
  }
  const filterList = sliceList.map((comic) => {
    if (/^\//.test(comic.img_url)) {
      return comic;
    }
    comic.img_url = `/${comic.img_url}`;
    return comic;
  });
  return filterList;
};

module.exports = {
  filterDataList,
};
