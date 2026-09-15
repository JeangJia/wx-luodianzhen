/**
 * 标签配色工具
 * 按标签语义分配「淡色底 + 彩色字」，对应 app.wxss 中的 .tag / .tag-gold / .tag-red / .tag-green / .tag-blue
 * 规则从上到下匹配，命中即返回
 */
const RULES = [
  { tone: 'gold', keys: ['经典首推', '首推', '必玩'] },
  { tone: 'red', keys: ['非遗', '民俗', '节庆', '夜游'] },
  { tone: 'green', keys: ['亲子', '农事体验', '研学', '花海'] },
  { tone: 'blue', keys: ['园林休闲', '慢生活', '湖畔', '摄影'] }
]

/**
 * @param {string} tag 原始标签文本
 * @returns {string} tone：gold / red / green / blue / teal
 */
function tagTone(tag) {
  const text = String(tag || '')
  const hit = RULES.find(rule => rule.keys.some(key => text.indexOf(key) > -1))
  return hit ? hit.tone : 'teal'
}

/**
 * 把 ['非遗', '经典首推'] 转成 [{ text: '非遗', tone: 'red' }, ...]
 * 便于在 WXML 里直接绑定 class="tag tag-{{t.tone}}"
 */
function toTagList(tags) {
  return (tags || []).map(text => ({ text, tone: tagTone(text) }))
}

module.exports = { tagTone, toTagList, TONE_RULES: RULES }
