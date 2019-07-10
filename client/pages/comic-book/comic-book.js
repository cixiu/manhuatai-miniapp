const apiComicBook = require('../../api/comic-book');
const filter = require('../../utils/filter');

const app = getApp();

Page({
  data: {
    bookCoverImage: '',
    bookData: {},
    loading: true,
  },
  onLoad: function(query) {
    const book_id = query.book_id;
    this.getBookCoverImage(book_id);
    this.getBookInfo(book_id);
  },
  // 获取书籍列表信息
  getBookInfo: function(book_id) {
    apiComicBook.getBookInfo(book_id, (res) => {
      if (res.data.status === 0) {
        const bookList = filter.fitlerM3x4Format(res.data.data.book_list);
        this.setData({
          bookList: bookList,
          loading: false,
        });
        wx.setNavigationBarTitle({
          title: res.data.data.book_name,
        });
      }
    });
  },
  // 获取书籍的封面图--根据book_id 拼出图片url
  getBookCoverImage: function(book_id) {
    const imgHost = `${app.globalData.imgHost}/file/kanmanhua_images/book/`;
    const bookCoverImage = filter.makeImgUrlById(book_id, imgHost, 'm2x1');
    this.setData({
      bookCoverImage,
    });
  },
});
