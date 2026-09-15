// pages/plan/plan.js 智能行程规划
const { spots } = require('../../data/spots')

const dayOptions = [1, 2, 3]

const prefOptions = [
  { key: '古镇人文', name: '古镇人文', icon: '🏮' },
  { key: '非遗民俗', name: '非遗民俗', icon: '🐉' },
  { key: '田园农趣', name: '田园农趣', icon: '🌾' },
  { key: '园林休闲', name: '园林休闲', icon: '🎋' }
]

const groupOptions = [
  { key: 'self', name: '自由行', desc: '节奏紧凑，多看几处' },
  { key: 'family', name: '带娃出行', desc: '优先农事与研学体验' },
  { key: 'elder', name: '带长辈', desc: '每天少走一点更舒适' }
]

const TIME_SLOTS = ['09:00', '11:00', '14:00', '16:30']
const PER_DAY = { self: 3, family: 3, elder: 2 }

Page({
  data: {
    dayOptions,
    prefOptions,
    groupOptions,
    days: 1,
    prefs: [],
    prefMap: {},
    group: 'self',
    plan: [],
    generated: false,
    variant: 0,
    totalSpot: 0
  },

  onDayTap(e) {
    this.setData({ days: Number(e.currentTarget.dataset.value), generated: false })
  },

  onPrefTap(e) {
    const key = e.currentTarget.dataset.key
    const prefs = this.data.prefs.slice()
    const index = prefs.indexOf(key)
    if (index > -1) {
      prefs.splice(index, 1)
    } else {
      prefs.push(key)
    }
    this.setData({ prefs, prefMap: this.toMap(prefs), generated: false })
  },

  toMap(list) {
    const map = {}
    list.forEach(key => { map[key] = true })
    return map
  },

  onGroupTap(e) {
    this.setData({ group: e.currentTarget.dataset.key, generated: false })
  },

  reset() {
    this.setData({ days: 1, prefs: [], prefMap: {}, group: 'self', plan: [], generated: false, variant: 0, totalSpot: 0 })
  },

  buildPlan() {
    const { days, prefs, group } = this.data
    const perDay = PER_DAY[group] || 3

    let pool = spots.filter(item => prefs.length === 0 || prefs.indexOf(item.category) > -1)

    if (group === 'family') {
      pool = pool.slice().sort((a, b) => this.familyScore(b) - this.familyScore(a))
    } else {
      pool = pool.slice().sort((a, b) => b.rating - a.rating)
    }

    // 候选不足时，用其余景点补齐
    if (pool.length < days * perDay) {
      const rest = spots.filter(item => pool.indexOf(item) === -1)
      pool = pool.concat(rest)
    }

    // “换一版”时轮换候选顺序
    const rotate = this.data.variant % pool.length
    pool = pool.slice(rotate).concat(pool.slice(0, rotate))

    const plan = []
    let cursor = 0
    for (let d = 1; d <= days; d++) {
      const items = []
      for (let i = 0; i < perDay; i++) {
        const spot = pool[cursor]
        cursor += 1
        if (!spot) break
        items.push({ time: TIME_SLOTS[i] || '18:00', spot })
      }
      const categories = []
      items.forEach(item => {
        if (categories.indexOf(item.spot.category) === -1) categories.push(item.spot.category)
      })
      plan.push({
        day: d,
        title: '第' + d + '天 · ' + (categories.join(' · ') || '自由安排'),
        items
      })
    }

    this.setData({
      plan,
      generated: true,
      variant: this.data.variant + 1,
      totalSpot: plan.reduce((sum, day) => sum + day.items.length, 0)
    }, () => {
      wx.pageScrollTo({ selector: '#plan-result', duration: 300 })
    })
  },

  familyScore(spot) {
    let score = spot.rating
    if (spot.tags.indexOf('亲子') > -1) score += 2
    if (spot.tags.indexOf('采摘') > -1) score += 1
    if (spot.tags.indexOf('徒步') > -1) score -= 1
    return score
  },

  regenerate() {
    this.buildPlan()
  },

  goSpot(e) {
    wx.navigateTo({ url: '/pages/spot/detail?id=' + e.currentTarget.dataset.id })
  },

  openMap(e) {
    const { lat, lng, title, town } = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      name: title,
      address: town,
      scale: 14
    })
  },

  copyPlan() {
    const { plan, days, group, prefs } = this.data
    if (!plan.length) return
    const groupName = (groupOptions.find(item => item.key === group) || {}).name || ''
    const lines = [
      '【我的罗店镇 ' + days + ' 日行程】',
      '偏好：' + (prefs.length ? prefs.join('、') : '不限') + ' · 同行：' + groupName,
      ''
    ]
    plan.forEach(day => {
      lines.push('D' + day.day + ' ' + day.title)
      day.items.forEach(item => {
        lines.push('  ' + item.time + ' ' + item.spot.name + '（' + item.spot.town + '）')
      })
      lines.push('')
    })
    lines.push('—— 由「游罗店」小程序智能生成')

    wx.setClipboardData({
      data: lines.join('\n'),
      success: () => wx.showToast({ title: '行程已复制', icon: 'none' })
    })
  },

  onShareAppMessage() {
    return { title: '用「游罗店」一键规划罗店镇行程', path: '/pages/plan/plan' }
  }
})
