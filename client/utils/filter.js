const filterDataList = (data = [], start, end) => {
  const sliceList = data.slice(start, end)
  const filterList = sliceList.map((comic) => {
    if (/^\//.test(comic.img_url)) {
      return comic
    }
    comic.img_url = `/${comic.img_url}`;
    return comic
  })
  return filterList
}

module.exports = {
  filterDataList
}
