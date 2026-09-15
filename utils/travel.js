/**
 * 出行指南（首页快捷入口与「我的」页共用一份，避免文案两处维护）
 */

const GUIDE =
  '罗店镇位于上海市宝山区西北部，地处宝山、嘉定与江苏太仓交界处，是上海的北大门。\n' +
  '地铁：乘 7 号线至美兰湖站，出站步行或换乘公交前往古镇。\n' +
  '公交：840 路、841 路、宝山 16 路、宝山 93 路等可达镇区。\n' +
  '自驾：导航至「罗店古镇」，经沪太路、月罗公路进入镇区。\n' +
  '提示：古镇老街路段较窄、车位有限，节假日建议公共交通前往。'

// 罗店古镇坐标：演示坐标，请按实际位置校准后替换
const DESTINATION = {
  latitude: 31.4091,
  longitude: 121.3502,
  name: '罗店古镇',
  address: '上海市宝山区罗店镇亭前街、塘西街一带',
  scale: 14
}

function showTravelGuide() {
  wx.showModal({
    title: '出行指南',
    content: GUIDE,
    confirmText: '打开导航',
    cancelText: '知道了',
    success: res => {
      if (res.confirm) wx.openLocation(DESTINATION)
    }
  })
}

module.exports = { showTravelGuide, GUIDE, DESTINATION }
