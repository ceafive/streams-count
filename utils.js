exports.MAX_NO_STREAMS = 3;

exports.testUsers = [
  {
    id: "123456",
    name: "Castro Agbo",
    createdAt: new Date("2022-09-12"),
  },
];

var CUSTOMEPOCH = 1300000000000;
exports.generateRowId = function (shardId) {
  var ts = new Date().getTime() - CUSTOMEPOCH;
  var randid = Math.floor(Math.random() * 512);
  ts = ts * 64;
  ts = ts + shardId;
  return ts * 512 + randid;
};
