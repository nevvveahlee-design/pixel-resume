/* 全部简历数据 —— 唯一数据源。房间热点、简历模式、面板内容都从这里读取。
   不用 fetch/JSON 文件，是为了保证双击 index.html 也能直接打开（file:// 下 fetch 会被 CORS 拦截）。 */
window.RESUME_DATA = {
  meta: {
    name: '李梦媛（Miranda）',
    nameEn: 'Li Mengyuan',
    tagline: '用户洞察 × 业务判断 × 0→1 产品探索',
    intro:
      '国际关系科班出身，习惯先拆问题再下结论；在京东零售做采销的一年里，把这套结构化分析用在了真实的商业决策上——' +
      '看数据、找用户、定策略、跑结果。没有正式的产品岗经历，但用一个从 0 到 1 独立搭建的 AI 产品项目证明了自己真的能做产品：' +
      '会拆需求、会画流程、会跟 AI 工具协作把想法变成能跑起来的东西。房间里的每件道具都是一段真实经历，点点看就知道了——' +
      '或者点右上角「简历模式」直接看文字版。'
  },

  contact: {
    // 拼接后再展示，避免直接以明文出现在页面源码里
    phoneParts: ['187', '0217', '5637'],
    emailUser: '957212007',
    emailDomain: 'qq.com'
  },

  sections: [
    {
      id: 'career',
      prop: { label: '显示器', icon: '🖥️', image: 'assets/room/sprites/monitor.png', rect: [82, 49, 6, 11] },
      title: '职业经历',
      tabs: [
        {
          label: '京东零售 · 口腔电器采销',
          blocks: [
            { type: 'meta', items: [
              ['公司', '京东零售 · 家电家居事业群 · 个护电器业务部'],
              ['岗位', '口腔电器采销'],
              ['时间', '2025.07 – 2026.04']
            ]},
            { type: 'metrics', items: [
              { value: '34.33%', label: '品牌用户转化率提升' },
              { value: '42%', label: 'J6 单品转化率提升' },
              { value: '20w→80w', label: 'J6 月销售额增长' },
              { value: 'ROI 18.72%', label: '搜索快车' },
              { value: '−12.3%', label: 'CPC 下降' },
              { value: '+1228%', label: 'usmile 活动用户数爆发' }
            ]},
            { type: 'heading', text: '品类策略制定' },
            { type: 'paragraph', text:
              '基于行业数据、用户消费趋势及品类发展现状拆解口腔电器品类增长机会，从渗透（共建行业标准、丰富自营选品、提升沟通、打造品类日）、' +
              '升级（提升用户权益、降低下单门槛、补齐双支装）、场景（礼赠货盘、企业购增量、跨界合作、全渠道战略）三个层面制定策略。' +
              '部门战略自 9 月稳定至今，连续 6 个月实现销售额和市占同比双增长。' },
            { type: 'heading', text: '产品策略优化' },
            { type: 'paragraph', text:
              '针对重点单品 J6 做用户搜索路径分析，定位"核心关键词承接不足 + 竞品流失严重"问题，重新设计关键词体系，' +
              '协同站内外种草、搜索承接和广告投放，形成"内容触达—搜索承接—权益升级—商品转化"完整链路。' },
            { type: 'heading', text: '广告投放与数据分析' },
            { type: 'paragraph', text:
              '搭建组内核心品/包销品数据检测看板；以 Y10 为例，双十一期间调整关键词策略与广告占比，' +
              '带动搜索流量整体提升 28%，并将分析框架沉淀为可复用方法论。' },
            { type: 'heading', text: '营销活动策划' },
            { type: 'paragraph', text:
              '主导策划 usmile 明星官宣活动，分析粉丝画像与消费数据，策划差异化礼盒、互动机制及传播节奏。' +
              '活动实现 2 秒售罄 1 万套礼盒，复盘输出 SOP，已在部门内推广使用。' }
          ]
        },
        {
          label: '欧莱雅 · 修丽可',
          blocks: [
            { type: 'meta', items: [
              ['公司', '欧莱雅集团 · 修丽可'],
              ['岗位', '京东渠道电商实习生'],
              ['时间', '2024.09 – 2025.02']
            ]},
            { type: 'metrics', items: [
              { value: '137%', label: '大促 GMV 超额达成' },
              { value: '+30%', label: '新用户会员注册' },
              { value: '+67%', label: '老客回购率提升' },
              { value: '+10%', label: '生意分析驱动销售额增长' }
            ]},
            { type: 'bullets', items: [
              '**大促策划**：参与策划双十一、双旦促销活动，深度参与目标拆解、流量分配、广告投放、活动机制确定，跟进各平台头部主播直播间提高转化率。',
              '**生意分析**：负责评估产品销售表现、用户行为及活动效果，利用 SQL、vlookup 等进行数据分析，发现用户流量来源与偏好，及时调整销售策略。',
              '**竞品分析**：监控竞品活动、价格策略、上新动态，归纳分析后撰写竞品分析报告，帮助团队优化推广资源分配。',
              '**案头研究**：参与品牌白皮书制作，收集行业数据与竞品分析，协助撰写消费者洞察章节。'
            ]}
          ]
        },
        {
          label: '懿奈 · 优时颜',
          blocks: [
            { type: 'meta', items: [
              ['公司', '懿奈（上海）生物科技有限公司 · 优时颜'],
              ['岗位', '渠道销售实习'],
              ['时间', '2024.05 – 2024.08']
            ]},
            { type: 'metrics', items: [
              { value: '+30%', label: '账号粉丝增长' },
              { value: '+40%', label: '互动量涨幅' },
              { value: '300+', label: 'KOL/KOC 合作' },
              { value: '+65%', label: '进店 UV 增长' }
            ]},
            { type: 'bullets', items: [
              '**媒体运营**：运营官方得物、小红书账号，结合流行趋势与热点话题输出专业内容，通过线上活动提高品牌声量。',
              '**竞品分析**：梳理韩束、珀莱雅等竞品在中免日和得物内容进行分析，调整销售策略，成功提高销售率 70%。',
              '**达人投放**：与 300+ 博主进行商务合作或新品测评，负责撰写 brief、内容审核及数据分析。'
            ]}
          ]
        }
      ]
    },

    {
      id: 'education',
      prop: { label: '书架', icon: '🎓', image: 'assets/room/sprites/bookshelf.png', rect: [1, 34, 12, 40] },
      title: '教育背景',
      tabs: [{
        label: '同济大学',
        blocks: [
          { type: 'meta', items: [
            ['学校', '同济大学 · 政治与国际关系学院'],
            ['专业', '国际关系（本科）'],
            ['时间', '2021.09 – 2025.06'],
            ['GPA', '4.66 / 5.0']
          ]},
          { type: 'tags', title: '核心课程', items: [
            'Business Strategy', 'Initial Product Strategy and Plan in Product Management',
            '网络文化产业与管理', '文化社会学', '逻辑学'
          ]},
          { type: 'paragraph', text: '具备较强的研究、信息整合、结构化分析和商业问题拆解能力。' }
        ]
      }]
    },

    {
      id: 'ai-project',
      prop: { label: '笔记本', icon: '💻', image: 'assets/room/sprites/laptop.png', rect: [89, 53, 5, 7] },
      title: 'AI 战略分析溯源助手',
      tabs: [{
        label: 'Vibe-Coding & 产品设计',
        blocks: [
          { type: 'meta', items: [['角色', 'Vibe-Coding & 产品设计'], ['时间', '2026.07 – 至今']]},
          { type: 'metrics', items: [
            { value: '27', label: '处理真实机构报告' },
            { value: '75', label: '沉淀经溯源校验的分析方法' },
            { value: '−33%', label: 'Prompt Caching 降低 token 成本' }
          ]},
          { type: 'heading', text: '需求洞察' },
          { type: 'paragraph', text:
            '从自身研究新公司/新赛道时的信息检索痛点出发，观察到 LLM 给出的分析结论信息全但无法验证依据，且属于一次性产出、无法复用；' +
            '区别于 ChatGPT/CC 等 AI 工具信息全面但易出现 AI 幻觉的问题，把"证据可溯源、方法可复用"作为产品差异化切入点。' },
          { type: 'heading', text: '产品设计与 MVP 定义' },
          { type: 'paragraph', text:
            '设计"权威报告→抽取候选方法→证据溯源校验→沉淀可复用方法库→按公司检索应用"的核心链路；核算真实 API 成本后，' +
            '判断该成本不适合作为默认高频体验，据此将 MVP 拆分为"确定性方法检索"（免费、即时）与"联网深度分析"（按需触发、验证案例）两层，完成功能取舍。' },
          { type: 'heading', text: 'AI 能力设计' },
          { type: 'paragraph', text:
            '针对通用大模型结论无据可查、无法复用的问题，设计 Framework 识别、Logic Pattern 沉淀、Evidence Grounding 三层 workflow，' +
            '要求每条提取结论必须能在原文中定位到出处，无法定位则拒绝入库，将可信度校验从"模型自评"改为确定性规则；' +
            '并用文本相似度算法对方法库做去重校验，确认规模扩展后未出现语义重复。' },
          { type: 'heading', text: '产品落地' },
          { type: 'paragraph', text:
            '独立完成需求定义、pipeline 设计、prompt 设计与迭代，使用 Vibe-Coding 工具推进工程实现；' +
            '定位并推动修复编码乱码、输出截断、接口限流无重试等真实生产问题；' +
            '处理 27 份真实机构报告，沉淀 75 条经溯源校验的分析方法；通过 Prompt Caching 降低约 33% 重复上下文的 token 成本。' }
        ]
      }]
    },

    {
      id: 'cosplay',
      prop: { label: '衣柜', icon: '👗', image: 'assets/room/sprites/wardrobe.png', rect: [50, 42, 19, 32] },
      title: '二次元 · 账号主理人 & Coser',
      tabs: [
        {
          label: '账号运营',
          blocks: [
            { type: 'meta', items: [['平台', '小红书'], ['定位', '二次元垂类账号'], ['时间', '2023.12 – 2024.12']]},
            { type: 'metrics', items: [
              { value: '5000+', label: '账号粉丝' },
              { value: '+60%', label: '发布笔记平均赞比提升' },
              { value: '100+', label: '私域核心用户' },
              { value: '8万', label: '定制服务转化收入' }
            ]},
            { type: 'bullets', items: [
              '**账号定位**：针对乙女游戏用户群体开展市场调研，对比小红书、抖音、B 站等平台生态，确定"cosplay 内容 + 技能"细分方向。',
              '**内容实验**：从 0 到 1 搭建个人博主账号及矩阵账号，负责选题策划、内容创作、图片拍摄、私域运营、数据分析，持续追踪并优化封面/标题/内容结构。',
              '**社群维护**：建立用户私域社群，通过持续互动深层了解用户需求，设计定制化服务、语 C 服务等方案，累计沉淀 100+ 核心用户。'
            ]}
          ]
        },
        {
          label: '接委托日常',
          blocks: [
            { type: 'paragraph', text: '账号运营之外的真实一面——接 cosplay 委托、拍照、后期，把兴趣变成一份可以做成生意的技能。' },
            { type: 'heading', text: '从委托里沉淀出的用户洞察' },
            { type: 'bullets', items: [
              '**情绪价值洞察**：要求"男友皮" > 角色皮，单主更希望为被认真对待的体验付费，不仅为委托功能本身付费。',
              '**关系深度留存**：单主对角色的情感投入会外溢到线下互动，同时委托老师本身也具有一定程度的不可替代性，会给单主以熟悉和亲密感。',
              '**安全表达空间**：在委托过程中，单主自述会比日常更敢说出真实想法与需求，无论是面对乙游男主还是委托老师，本质都是安全的、不被批判的社交环境。',
              '**情绪发泄场景**：委托通常发生在单主需要感情出口的节点（包括积极的与消极的）。'
            ]},
            { type: 'gallery', dir: 'assets/photos/raw', files: ['cos-01.jfif', 'cos-02.jfif', 'cos-03.jfif'], caption: '接委托实拍' }
          ]
        }
      ]
    },

    {
      id: 'photocards',
      prop: { label: '收纳盒', icon: '🃏', image: 'assets/room/sprites/dresser.png', rect: [14, 56, 14, 18] },
      title: '小卡交易日常',
      tabs: [{
        label: '追星卖小卡',
        blocks: [
          { type: 'paragraph', text: '追星圈子里的"小生意"：选品、定价、供需判断、和陌生人建立信任——这些能力其实和电商采销异曲同工。' },
          { type: 'tags', title: '这段经历练到的能力', items: ['选品定价', '供需判断', '信任建立', '交易履约'] },
          { type: 'gallery', dir: 'assets/photos', files: ['photocard-1.jpg', 'photocard-2.jpg', 'photocard-3.jpg'] }
        ]
      }]
    },

    {
      id: 'skills',
      prop: { label: '台灯', icon: '💡', image: 'assets/room/sprites/trophies.png', rect: [83, 40, 12, 7] },
      title: '其他信息',
      tabs: [
        { label: 'AI 能力', blocks: [
          { type: 'paragraph', text: '具备 AI 产品 0 到 1 实践经验，能够完成需求定义、PRD、workflow 设计、prompt 设计、结构化输出及产品迭代。' },
          { type: 'tags', title: '熟练工具', items: ['codex', 'claude code', 'cursor', 'google AI studio'] }
        ]},
        { label: '数据分析', blocks: [
          { type: 'paragraph', text: '熟悉 SQL、Excel 等分析工具，可独立完成业务数据清洗、分析和可视化。' }
        ]},
        { label: '语言能力', blocks: [
          { type: 'metrics', items: [
            { value: 'CET6 588', label: '英语六级' },
            { value: 'IELTS 7.5', label: '雅思' }
          ]}
        ]}
      ]
    },

    {
      id: 'contact',
      prop: { label: '信箱', icon: '✉️', rect: [41, 17, 7, 9], wallPhoto: true },
      title: '联系方式',
      isContact: true,
      tabs: [{ label: '联系我', blocks: [] }]
    },

    {
      id: 'about',
      prop: { label: '李梦媛', icon: '🧍‍♀️', sprite: true, rect: [43, 68, 10, 32], isEasterEgg: true },
      title: '关于我',
      tabs: [{
        label: '自我介绍',
        blocks: [
          { type: 'paragraph', text:
            '国际关系专业出身，却一路做进了电商采销和 AI 产品——喜欢拆问题、找规律，也喜欢把兴趣（追番、cosplay、跳舞）活成正经的生活方式。' +
            '这个小房间里的每一件道具背后都是一段真实经历，点点看就知道了。' }
        ]
      }]
    }
  ]
};
