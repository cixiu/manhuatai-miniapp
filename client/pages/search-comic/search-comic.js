const apiSearchComic = require('../../api/search-comic');
const filter = require('../../utils/filter');
const util = require('../../utils/util');

Page({
  data: {
    imgHost: 'https://comment.yyhao.com/',
    search_key: '',
    comicListData: {},
    authorListData: {},
    postList: [],
  },
  onLoad: function(query) {
    console.log(query);
    const page = 1;
    const search_key = query.search_key;
    wx.setNavigationBarTitle({
      title: search_key,
    });
    this.setData({
      search_key: query.search_key,
    });
    this.getSearchComicList(page, search_key);
    this.getSearchAuthor(page, search_key);
    this.getSearchPostList(search_key);
  },
  // 获取搜索的相关漫画列表
  getSearchComicList: function(page, search_key) {
    apiSearchComic.getSortList(page, search_key, (res) => {
      const data = res.data.data;
      const comicListData = {};
      comicListData.count = data.length;
      comicListData.list = filter.fitlerM3x4Format(data).slice(0, 6);
      this.setData({
        comicListData,
      });
    });
  },
  // 获取搜索的相关作者列表
  getSearchAuthor: function(page, search_key) {
    apiSearchComic.getSearchAuthor(page, search_key, (res) => {
      // console.log(res.data);
      if (res.data.data && !res.data.data.count) {
        return;
      }
      const authorList = res.data.data.list.slice(0, 2).map((item) => {
        // webp格式的http图片链接 转成 https和jgp格式的图片外链
        item.sculpture = item.sculpture.replace(
          /^(http)(.*?)(\.webp)$/g,
          (match, ...arg) => {
            return `https${arg[1]}`;
          },
        );
        return item;
      });
      const authorListData = {
        count: res.data.data.count,
        list: authorList,
      };
      this.setData({
        authorListData,
      });
    });
  },
  // 获取搜索的相关帖子列表
  getSearchPostList: function(search_key) {
    apiSearchComic.getSearchPostList(search_key, (res) => {
      // console.log(res.data);
      const postListObj = {};
      const length = this.data.postList.length;

      const postList = res.data.data.forEach((item, index) => {
        item.Content = util.parseContent(item.Content);
        // 将图片转成200x200的小图  -- 图片展示的时候使用
        const Images = item.Images.replace(
          /@#de<!--IMG#\d+-->@#de\d+:\d+/g,
          '-200x200',
        );
        item.Images = JSON.parse(Images).map((imgItem) => {
          return this.data.imgHost + imgItem;
        });
        const pIndex = length + index;
        postListObj[`postList[${pIndex}]`] = item;
      });

      this.setData({
        ...postListObj,
      });
      // this.setData({
      //   postList: res.data.data,
      // });
    });
  },
});
