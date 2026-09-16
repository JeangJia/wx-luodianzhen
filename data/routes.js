/**
 * 旅游路线数据 —— 上海市宝山区罗店镇
 * spotId 对应 data/spots.js 中的景点 id
 */
const routes = [
  {
    id: 'r1',
    name: '古镇古桥 · 非遗寻根一日游',
    cover: '/images/routes/r1.jpg',
    theme: 1,
    days: 1,
    tags: ['古镇人文', '非遗', '经典首推'],
    bestSeason: '全年（避开周一，部分展馆闭馆）',
    budget: '人均约 90 元（含午餐、交通）',
    suitable: '首次到访、亲子家庭、摄影爱好者',
    summary: '一天走完罗店最经典的“金罗店”底色：先逛三湾九街十八弄的老街，再沿着市河一座座古桥走过去，午后看晚唐风格的宝山寺，最后在龙船馆里读一读端午划龙船的百年习俗。',
    itinerary: [
      {
        day: 1,
        title: '古镇老街 · 市河古桥 · 非遗收尾',
        items: [
          { time: '09:00', spotId: 's1', title: '罗店古镇老街', note: '沿亭前街、塘西街慢走，先熟悉水乡街巷格局' },
          { time: '10:30', spotId: 's2', title: '大通桥', note: '登桥俯瞰市河，老街最经典的取景机位' },
          { time: '11:15', spotId: 's3', title: '丰德桥', note: '沿河串游古桥群，感受“一河多桥”的水乡旧貌' },
          { time: '12:00', title: '老街午餐', note: '推荐罗店鱼圆、草头塌饼' },
          { time: '14:00', spotId: 's4', title: '宝山寺', note: '晚唐宫殿式纯木结构殿宇，安静走一圈' },
          { time: '16:00', spotId: 's5', title: '罗店龙船文化展示馆', note: '听懂“重观赏、轻竞渡”的罗店龙船' },
          { time: '17:00', spotId: 's13', title: '“东西巷里”文旅商城', note: '旧厂房改造的文创街区，晚餐与逛店都合适' },
          { time: '19:00', title: '返程', note: '可顺路带一份天花玉露霜当伴手礼' }
        ]
      }
    ]
  },
  {
    id: 'r2',
    name: '千亩田园 · 花海亲子一日游',
    cover: '/images/routes/r2.jpg',
    theme: 2,
    days: 1,
    tags: ['亲子', '农事体验', '花海'],
    bestSeason: '3-4 月油菜花、6-8 月向日葵与荷花',
    budget: '人均约 80 元（采摘另计）',
    suitable: '亲子家庭、周末短途、同学结伴',
    summary: '把一整天交给罗店的千亩农田：上午在远景村的花海里坐小火车，中午在塘湾村吃一顿农家菜饭，下午到东方假日田园下地采摘，走的时候顺手把新米和菜籽油装进后备箱。',
    itinerary: [
      {
        day: 1,
        title: '花海 · 田园 · 采摘环线',
        items: [
          { time: '09:00', spotId: 's8', title: '远景村千亩花田', note: '油菜花/向日葵花海、花海小火车，春季还有花田集市' },
          { time: '12:00', title: '田头午餐', note: '花田集市小吃、灶头菜饭' },
          { time: '13:30', spotId: 's9', title: '塘湾村美丽田园', note: '沿稻田绿道散步，看看水乡村落的松弛日常' },
          { time: '15:00', spotId: 's14', title: '四方村乡村文创园', note: '从“工业锈带”改造而来的文创园，喝杯咖啡再走' },
          { time: '16:30', spotId: 's10', title: '东方假日田园', note: '当季果蔬采摘，孩子可参加农事小课堂' },
          { time: '18:00', title: '返程', note: '园区可带走本地产大米、菜籽油' }
        ]
      }
    ]
  },
  {
    id: 'r3',
    name: '古镇夜色 · 湖畔休闲二日游',
    cover: '/images/routes/r3.jpg',
    theme: 6,
    days: 2,
    tags: ['园林休闲', '夜游', '慢生活'],
    bestSeason: '全年（春节灯会期间夜景最佳）',
    budget: '人均约 380 元（含住宿、餐饮）',
    suitable: '情侣出游、朋友结伴、周末放松',
    summary: '第一天不赶时间：下午到古镇老街慢慢逛，傍晚在桥上等夕阳，入夜看灯彩亮起，住在湖边的酒店；第二天环湖骑行，再去闻道园看徽派古建与苗木园林。',
    itinerary: [
      {
        day: 1,
        title: '古镇老街 · 灯彩夜游',
        items: [
          { time: '14:00', spotId: 's1', title: '罗店古镇老街', note: '午后老街人少，适合慢慢逛沿街小铺' },
          { time: '16:00', spotId: 's2', title: '大通桥', note: '夕阳时分上桥，市河一带光线最好' },
          { time: '17:00', spotId: 's3', title: '丰德桥', note: '沿河步道串起古镇石桥群' },
          { time: '18:00', title: '古镇晚餐', note: '罗店鱼圆、草头塌饼、本地小炒' },
          { time: '19:30', spotId: 's6', title: '罗店彩灯工坊', note: '入夜看彩灯亮起，灯会期间还有大型主题灯组' },
          { time: '21:00', title: '入住美兰湖周边酒店', note: '湖景房夜间可散步环湖步道' }
        ]
      },
      {
        day: 2,
        title: '环湖慢生活 · 徽派园林',
        items: [
          { time: '09:00', spotId: 's11', title: '美兰湖景区', note: '环湖骑行、草坪发呆，地铁 7 号线美兰湖站就在附近' },
          { time: '12:00', title: '湖畔午餐', note: '沿湖餐饮选择较多，可点一份湖景咖啡' },
          { time: '14:00', spotId: 's12', title: '闻道园', note: '徽派古建筑群与苗木园林，人少安静' },
          { time: '16:30', title: '返程', note: '' }
        ]
      }
    ]
  },
  {
    id: 'r4',
    name: '端午龙船 · 非遗文化二日游',
    cover: '/images/routes/r4.jpg',
    theme: 1,
    days: 2,
    tags: ['非遗', '民俗', '节庆'],
    bestSeason: '端午前后、春节灯会期间',
    budget: '人均约 360 元',
    suitable: '文化爱好者、亲子家庭、摄影与短视频创作者',
    summary: '为罗店的两项“看家本领”排一条线路：龙船与灯彩。先读懂端午划龙船习俗的来龙去脉，再进灯彩工坊看一门手艺怎么扎出来；第二天回到老街与古刹，把古镇的日常也补上。',
    itinerary: [
      {
        day: 1,
        title: '龙船 · 灯彩 · 花神堂',
        items: [
          { time: '09:30', spotId: 's5', title: '罗店龙船文化展示馆', note: '看亭台式龙船与绣旗装饰，了解划龙船习俗的百年脉络' },
          { time: '12:00', title: '午餐', note: '罗店鱼圆、公大酱菜配饭' },
          { time: '14:00', spotId: 's6', title: '罗店彩灯工坊', note: '看扎灯、糊纸、描金，可预约手作体验' },
          { time: '16:00', spotId: 's7', title: '罗店花神堂', note: '从花业与棉业的角度理解“金罗店”的由来' },
          { time: '17:30', title: '古镇晚餐', note: '老街沿河小馆' },
          { time: '19:00', title: '古镇夜景', note: '春节灯会期间老街与美兰湖同步布展' }
        ]
      },
      {
        day: 2,
        title: '老街 · 古桥 · 古刹',
        items: [
          { time: '09:00', spotId: 's1', title: '罗店古镇老街', note: '清晨的老街最适合拍照，游客也少' },
          { time: '10:30', spotId: 's2', title: '大通桥', note: '在桥上拍一张水街全景' },
          { time: '11:30', title: '午餐', note: '草头塌饼、天花玉露霜当甜品' },
          { time: '13:30', spotId: 's4', title: '宝山寺', note: '晚唐风格纯木殿宇，行程收尾' },
          { time: '16:00', title: '返程', note: '' }
        ]
      }
    ]
  },
  {
    id: 'r5',
    name: '罗店亲子研学二日游',
    cover: '/images/routes/r5.jpg',
    theme: 4,
    days: 2,
    tags: ['亲子', '研学', '农事体验'],
    bestSeason: '春耕与秋收季、暑假',
    budget: '人均约 420 元（含住宿、体验项目）',
    suitable: '6-14 岁孩子家庭、学校研学团队',
    summary: '让孩子用两天时间认识一座古镇：第一天在龙船馆和灯彩工坊里动手做一盏灯、听一段龙船鼓；第二天下到千亩农田里，看一粒米从田里到饭碗的全程。',
    itinerary: [
      {
        day: 1,
        title: '非遗手作 · 古桥寻访',
        items: [
          { time: '09:00', spotId: 's5', title: '罗店龙船文化展示馆', note: '研学第一课：为什么罗店的龙船不比赛速度' },
          { time: '11:00', spotId: 's6', title: '罗店彩灯工坊', note: '花灯手作体验，亲手扎一盏带回家' },
          { time: '12:30', title: '午餐', note: '' },
          { time: '14:00', spotId: 's1', title: '罗店古镇老街', note: '拿着任务单在老街找一找“三湾九街十八弄”' },
          { time: '16:00', spotId: 's2', title: '大通桥', note: '认识古石桥的结构与作用' },
          { time: '17:30', title: '入住镇上民宿', note: '' }
        ]
      },
      {
        day: 2,
        title: '千亩农田课堂',
        items: [
          { time: '09:00', spotId: 's8', title: '远景村千亩花田', note: '农事课堂：看节气与农作物的关系' },
          { time: '12:00', title: '田头午餐', note: '灶头菜饭、现磨豆浆' },
          { time: '13:30', spotId: 's9', title: '塘湾村美丽田园', note: '稻田绿道散步，认识水乡村落' },
          { time: '15:30', spotId: 's10', title: '东方假日田园', note: '当季采摘，把课堂上的作物带回家' },
          { time: '17:00', title: '返程', note: '' }
        ]
      }
    ]
  },
  {
    id: 'r6',
    name: '花神故里 · 春日民俗一日游',
    cover: '/images/routes/r6.jpg',
    theme: 5,
    days: 1,
    tags: ['民俗', '非遗', '春季'],
    bestSeason: '春季（花神庙会集中在农历二月十二前后）',
    budget: '人均约 90 元（含午餐、交通）',
    suitable: '民俗爱好者、亲子家庭、摄影爱好者',
    summary: '罗店素有“花神故里”之称，花神庙会的传统在 2017 年得以恢复。春天来罗店，可以赶上花神节的热闹：逛花神庙会、看古镇春日街景，再学一段彩灯扎制，带走一份春日的非遗好物。',
    itinerary: [
      {
        day: 1,
        title: '花神节 · 古镇春日',
        items: [
          { time: '09:00', spotId: 's7', title: '罗店花神堂', note: '花神节主场，感受农历二月十二的花神庙会' },
          { time: '11:00', spotId: 's1', title: '罗店古镇老街', note: '春日老街最适合慢慢走，沿街有非遗小吃' },
          { time: '12:30', title: '老街午餐', note: '罗店鱼圆、草头塌饼' },
          { time: '14:00', spotId: 's6', title: '罗店彩灯工坊', note: '看竹木为骨的彩灯怎么扎出来，可预约手作体验' },
          { time: '16:00', spotId: 's13', title: '“东西巷里”文旅商城', note: '文创零售与咖啡，顺手带一份春日伴手礼' },
          { time: '18:00', title: '返程', note: '' }
        ]
      }
    ]
  }
]

function getRouteById(id) {
  return routes.find(item => item.id === id)
}

module.exports = { routes, getRouteById }
