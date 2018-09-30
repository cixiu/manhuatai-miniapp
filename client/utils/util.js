const wxDiscode = require('../wxParse/wxDiscode');

/**
 * 将数字转化为相应的单位
 *
 * 100000以下不转换，100000以上转为以“万”为单位，超过1亿的转为以“亿”为单位
 */
const formatNumber = (number) => {
  number = +number; // 将 字符串类型的数字转成数字类型
  const WAN = 10000;
  const TEN_WAN = WAN * 10;
  const YI = 100000000;
  let resultNumber = '';
  // 如果数字小于100000 直接返回
  if (number < TEN_WAN) {
    resultNumber = '' + number;
  }
  // 如果数字 100000 < number < 100000000  返回 以“万”为单位
  if (number > TEN_WAN && number < YI) {
    const ratioWan = number / WAN;
    // 是否超过100万
    if (ratioWan >= 100) {
      resultNumber = Math.floor(ratioWan) + '万';
    } else {
      resultNumber = (number / WAN).toFixed(1) + '万';
    }
  }
  // 如果 number > 100000000  返回 以“亿”为单位
  if (number > YI) {
    const ratioYi = number / YI;
    // 是否超过100亿
    if (ratioYi >= 100) {
      resultNumber = Math.floor(ratioYi) + '亿';
    } else {
      resultNumber = ratioYi.toFixed(1) + '亿';
    }
  }
  return resultNumber;
};

// 解析contentStr 除去特殊的字符
const parseContent = (content) => {
  // 将html标签去掉
  const htmlReg = /<[^>]+>/g;
  // 将自定义的emoji去掉
  const emojiReg = /\[.*?\]|\{emoji\:(馒头仔\/\d+)\}/g;
  const contentStr = content.replace(htmlReg, '').replace(emojiReg, ' ');
  // 将特殊符号的HTML源码转成特殊符号
  return wxDiscode.strDiscode(contentStr).substring(0, 50);
};

module.exports = {
  formatNumber,
  parseContent,
};
