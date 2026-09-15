// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: 'home' },
      { pagePath: '/pages/spot/list', text: '景点', icon: 'spot' },
      { pagePath: '/pages/route/list', text: '路线', icon: 'route' },
      { pagePath: '/pages/product/list', text: '农产品', icon: 'goods' },
      { pagePath: '/pages/mine/mine', text: '我的', icon: 'mine' }
    ]
  },

  methods: {
    onTabTap(e) {
      const index = Number(e.currentTarget.dataset.index)
      const item = this.data.list[index]
      if (!item) return
      if (index === this.data.selected) return
      wx.switchTab({ url: item.pagePath })
    }
  }
})
