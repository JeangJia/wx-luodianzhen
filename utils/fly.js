/**
 * 加购抛物线动画
 *
 * 小球是两层结构：
 *   .fly-wrap   定位在起点，只做「横向」位移（linear）
 *   .fly-inner  只做「纵向」位移（缓动带负控制点 → 先往上飘，再落到目标）
 * 两个方向一合成就是一条抛物线。整个动画由 CSS 过渡完成，
 * 不用逐帧 setData，开销几乎为零。
 *
 * 页面需要做三件事：
 *   1. data 里放一份 fly（初始值见 HIDDEN）
 *   2. WXML 里放小球节点（结构见 pages/index/index.wxml）
 *   3. 调用 throwToCart 时传入起点 / 终点选择器
 */

// 必须与 app.wxss 里 .fly-wrap / .fly-inner 的 transition 时长一致
const DURATION = 620

const HIDDEN = { show: false, x: 0, y: 0, dx: 0, dy: 0 }

/**
 * @param {object}   page      页面实例
 * @param {string}   fromSel   起点选择器
 * @param {number}   fromIndex 起点在匹配结果里的下标（选择器会命中多个时用）
 * @param {string}   toSel     终点（购物车）选择器
 * @param {function} onArrive  小球落下后执行：真正写入购物车、角标 +1、弹提示
 */
function throwToCart(page, fromSel, fromIndex, toSel, onArrive) {
  wx.createSelectorQuery()
    .selectAll(fromSel)
    .boundingClientRect()
    .select(toSel)
    .boundingClientRect()
    .exec(res => {
      const fromList = res[0] || []
      const from = fromList[Number(fromIndex) || 0]
      const to = res[1]

      // 拿不到位置就跳过动画直接落库 —— 功能不能因为动画失败而丢掉
      if (!from || !to) {
        if (onArrive) onArrive()
        return
      }

      const startX = from.left + from.width / 2
      const startY = from.top + from.height / 2
      const dx = to.left + to.width / 2 - startX
      const dy = to.top + to.height / 2 - startY

      const fly = { show: true, x: startX, y: startY, dx: 0, dy: 0 }

      // 第一步：小球先出现在起点（此时位移为 0，所以不会产生过渡）
      page.setData({ fly }, () => {
        // 第二步：等这一帧真的渲染完再给位移量，过渡才会跑起来。
        // 两次 setData 挨在一起会被合并成一次渲染，小球就直接闪到终点了
        setTimeout(() => {
          page.setData({ fly: { show: true, x: startX, y: startY, dx, dy } })

          setTimeout(() => {
            page.setData({ fly: Object.assign({}, HIDDEN) })
            if (onArrive) onArrive()
          }, DURATION)
        }, 30)
      })
    })
}

module.exports = { throwToCart, DURATION, HIDDEN }
