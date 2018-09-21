const apiComicRank = require('../../api/comic-rank');
const filter = require('../../utils/filter');

Page({
  data: {
    loading: true,
    rankTypes: {},
    rankList: [],
    sort_type: '',
  },
  onLoad: function(query) {
    console.log(query);
    this.setData({
      sort_type: query.sort_type,
    });
    const params = {
      sort_type: query.sort_type,
      rank_type: 'heat',
      time_type: 'week',
    };
    this.getRankTypes();
    this.getRankDataDetials(params);
  },
  choseSortType: function(e) {
    const typeItem = e.currentTarget.dataset.type;
    this.setData({
      sort_type: typeItem.name,
      loading: true,
    });
    const params = {
      sort_type: typeItem.name,
      rank_type: 'heat',
      time_type: 'week',
    };
    this.getRankDataDetials(params);
  },
  // 排行榜类型
  getRankTypes: function() {
    apiComicRank.getRankTypes((res) => {
      if (res.data.status === 0) {
        this.setData({
          rankTypes: res.data.data,
        });
      }
    });
  },
  // 获取排行榜类型的详细信息
  getRankDataDetials: function(params) {
    apiComicRank.getRankDataDetials(params, (res) => {
      if (res.data.status === 0) {
        const rankList = filter.fitlerM3x4Format(res.data.data);
        rankList.forEach((item) => {
          item.sort_typelist = item.sort_typelist
            .replace(/\w+,/g, '')
            .replace(/\|/g, ' ');
        });
        this.setData({
          rankList,
          loading: false,
        });
      }
    });
  },
});
