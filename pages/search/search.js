// pages/search/search.js
const { spots } = require('../../data/spots')
const { routes } = require('../../data/routes')
const { products } = require('../../data/products')
const { toTagList } = require('../../utils/tagTone')

// 热门搜索词：覆盖非遗、景点、好物几类，点一下直接搜
const hots = ['龙船', '花神', '美兰湖', '宝山寺', '天花玉露霜', '罗店鱼圆', '古桥', '采摘']

function hit(text, kw) {
  return String(text || '').indexOf(kw) > -1
}

function anyHit(list, kw) {
  return (list || []).some(item => hit(item, kw))
}

/* ---------- 各类型命中哪些字段 ---------- */

function matchSpot(s, kw) {
  return hit(s.name, kw) || hit(s.category, kw) || hit(s.town, kw) || hit(s.intro, kw) ||
    anyHit(s.tags, kw) || anyHit(s.highlights, kw) || anyHit(s.foods, kw)
}

function matchRoute(r, kw) {
  return hit(r.name, kw) || hit(r.summary, kw) || hit(r.suitable, kw) || hit(r.bestSeason, kw) ||
    anyHit(r.tags, kw)
}

function matchProduct(p, kw) {
  return hit(p.name, kw) || hit(p.category, kw) || hit(p.origin, kw) || hit(p.intro, kw) ||
    anyHit(p.tags, kw)
}

/**
 * 匹配强度：名称 3 分 > 标签 2 分 > 只在正文里提到 1 分。
 * 搜“罗店”这种词时三条都中，靠它把名字里带“罗店”的排到前面，
 * 免得正文里顺带提及的条目冒到最上面
 */
function scoreOf(item, kw) {
  if (hit(item.name, kw)) return 3
  if (anyHit(item.tags, kw)) return 2
  return 1
}

/* ---------- 字段归一化：三类数据字段不同，统一成一套好让 WXML 复用同一个模板 ---------- */

function normSpot(s) {
  return {
    id: s.id,
    name: s.name,
    theme: s.theme,
    cover: s.cover,
    meta: s.town || s.category || '',
    tagList: toTagList((s.tags || []).slice(0, 2))
  }
}

function normRoute(r) {
  const who = String(r.suitable || '').split('、')[0]
  return {
    id: r.id,
    name: r.name,
    theme: r.theme,
    cover: r.cover,
    meta: r.days + ' 日行程' + (who ? ' · 适合' + who : ''),
    tagList: toTagList((r.tags || []).slice(0, 2))
  }
}

function normProduct(p) {
  return {
    id: p.id,
    name: p.name,
    theme: p.theme,
    cover: p.cover,
    meta: p.origin || p.category || '',
    price: p.price,
    tagList: toTagList((p.tags || []).slice(0, 2))
  }
}

// 过滤 → 按匹配强度排序 → 归一化
function pick(list, kw, match, norm) {
  return list
    .filter(item => match(item, kw))
    .map(item => ({ item, score: scoreOf(item, kw) }))
    .sort((a, b) => b.score - a.score)
    .map(entry => norm(entry.item))
}

Page({
  data: {
    keyword: '',
    autoFocus: true,
    hots,
    // 分组结果：[{ key, name, items }]
    groups: [],
    total: 0
  },

  onLoad(options) {
    // 支持带词进入：/pages/search/search?kw=龙船
    const kw = options && options.kw ? decodeURIComponent(options.kw) : ''
    // 带词进来就别再弹键盘了，用户是来看结果的
    if (kw) this.setData({ keyword: kw, autoFocus: false }, () => this.search())
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value }, () => this.search())
  },

  onHotTap(e) {
    this.setData({ keyword: e.currentTarget.dataset.key }, () => this.search())
  },

  onSearch() {
    this.search()
  },

  clearKeyword() {
    this.setData({ keyword: '' }, () => this.search())
  },

  search() {
    const kw = this.data.keyword.trim()
    if (!kw) {
      this.setData({ groups: [], total: 0 })
      return
    }

    const spotList = pick(spots, kw, matchSpot, normSpot)
    const routeList = pick(routes, kw, matchRoute, normRoute)
    const productList = pick(products, kw, matchProduct, normProduct)

    // 分组顺序固定跟底部导航一致（景点 → 路线 → 农产品），不随命中数变来变去
    this.setData({
      groups: [
        { key: 'spot', name: '景点', items: spotList },
        { key: 'route', name: '路线', items: routeList },
        { key: 'product', name: '农产品', items: productList }
      ],
      total: spotList.length + routeList.length + productList.length
    })
  },

  goDetail(e) {
    const { type, id } = e.currentTarget.dataset
    const path = type === 'spot'
      ? '/pages/spot/detail'
      : type === 'route'
        ? '/pages/route/detail'
        : '/pages/product/detail'
    wx.navigateTo({ url: path + '?id=' + id })
  },

  goBack() {
    // 从分享或扫码直接进搜索页时没有上一页，兜底回首页
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  onShareAppMessage() {
    return { title: '游罗店 · 搜点什么', path: '/pages/search/search' }
  }
})
