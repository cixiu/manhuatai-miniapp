const wxDiscode = require('../wxParse/wxDiscode');

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
  formatTime,
  parseContent,
};
