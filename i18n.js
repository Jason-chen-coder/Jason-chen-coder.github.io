(function publishPortfolioI18n(global) {
  "use strict";
  const STORAGE_KEY = "jason-chen.portfolio.locale";
  const SUPPORTED_LOCALES = Object.freeze(["zh-CN", "en"]);
  const zh = {
    "meta.title": "Jason Chen · 把复杂系统做成好用的产品",
    "meta.description":
      "Jason Chen，高级前端工程师。构建可视化编辑器、跨平台应用、互联设备与 AI 工作流，把复杂系统做成好用的产品。",
    "a11y.skip": "跳到主要内容",
    "brand.sub": "前端工程 · 深圳",
    "a11y.nav": "主导航",
    "nav.top": "首页",
    "nav.opensource": "开源项目",
    "nav.work": "产品实践",
    "nav.about": "关于我",
    "nav.contact": "聊一聊",
    "nav.open": "打开导航",
    "nav.close": "关闭导航",
    "hero.identity": "工程师，也是构建者。",
    "hero.eyebrow": "FRONTEND ENGINEERING · AI & AUTOMATION",
    "hero.line1": "把复杂系统",
    "hero.line2": "做成好用的",
    "hero.accent": "产品",
    "hero.body":
      "你好，我是 Jason，一名在深圳工作的高级前端工程师。从可视化编辑器到实验室自动化，从跨平台设备到 AI 工作流，我关注的不只是界面，更是界面背后真实运转的系统。",
    "hero.explore": "看看我的开源项目",
    "hero.about": "认识一下",
    "hero.areas": "实践领域",
    "hero.pillopensource": "可视化与 Web",
    "hero.pillwork": "跨平台与设备",
    "hero.pillai-workflows": "AI 工作流",
    "hero.scroll": "向下探索",
    "approach.label": "思考与构建",
    "approach.title1": "从真实问题",
    "approach.title2": "到可用系统",
    "approach.intro":
      "好的工程，不止于实现一个界面。我习惯把需求、状态、协议和执行连起来，让每一次设计选择都有来处，每一个交付结果都能被验证。",
    "approach.tabs": "工程工作方式",
    "method.0.name": "需求",
    "method.0.title": "先理解问题，再确定边界。",
    "method.0.body":
      "从用户要完成的任务出发，理清场景、约束与验收标准。让需求成为可以讨论、可以验证的共同语言。",
    "method.1.name": "建模",
    "method.1.title": "把隐含的规则，变成明确的状态。",
    "method.1.body":
      "梳理设备、协议、权限和运行状态，在界面与真实执行之间建立一致的模型。复杂度需要被理解，而不是被藏起来。",
    "method.2.name": "实现",
    "method.2.title": "从系统到界面，让意图可以操作。",
    "method.2.body":
      "用合适的技术把模型变成清晰的交互，连接 Web、桌面、移动端和设备，让人能够理解系统，也能推动系统。",
    "method.3.name": "验证",
    "method.3.title": "用真实行为，检验每一次交付。",
    "method.3.body":
      "沿着用户路径验证交互、数据和执行结果。保留测试和集成证据，也明确模拟环境与真实设备之间的边界。",
    "opensource.label": "开源作品",
    "opensource.title1": "写在代码里的",
    "opensource.title2": "长期主义",
    "opensource.intro":
      "把重复遇到的问题，做成可以复用的工具。这里是我持续探索可视化、开发体验与跨平台交互的几个开源项目。",
    "opensource.snapshot": "GitHub 公开数据 · 2026.10.31 快照",
    "project.index": "开源",
    "project.0.title": "可视化流程编辑器",
    "project.0.body":
      "基于 Vue 与 mxGraph 的流程编辑器，探索从节点、连线到业务流程的可视化编排。让复杂逻辑拥有可以直接操作的形状。",
    "project.0.link": "查看项目",
    "project.1.title": "数据驱动的流程渲染",
    "project.1.body":
      "用 D3.js 将流程数据变成可阅读的图形，在结构与呈现之间建立连接，探索更灵活的可视化表达。",
    "project.1.link": "查看项目",
    "project.2.title": "端侧实时语音识别",
    "project.2.body":
      "基于 Flutter 与 Sherpa-ONNX 的端侧实时语音识别应用，支持按需下载模型、音频流处理与识别结果展示，让声音在本地变成文字。",
    "project.2.link": "查看项目",
    "project.3.title": "可嵌入的代码编辑器",
    "project.3.body":
      "基于 Monaco Editor 封装的代码编辑器组件，连接编辑能力与业务界面，探索可复用的开发者工具体验。",
    "project.3.link": "查看项目",
    "film.watch": "观看项目短片",
    "film.download": "下载短片",
    "film.fallback": "直接打开视频",
    "film.error": "暂时无法播放，可以直接打开或下载短片。",
    "film.mxgraph.label": "Mxgraph-EasyFlowEditor 宣传短片",
    "film.d3.label": "D3-EasyFlowRender 宣传短片",
    "film.speech.label": "Flutter-EasySpeechRecognition 宣传短片",
    "film.monaco.label": "Monaco-EasyCodeEditor 宣传短片",
    "film.yourdream.label": "YourDream Studio 宣传短片",
    "film.mxgraph.caption": "从拖拽节点到流程编排。",
    "film.d3.caption": "布局、关系与节点详情，一眼看清。",
    "film.speech.caption": "从模型准备到端侧语音识别。",
    "film.monaco.caption": "从代码输入到差异对比。",
    "film.yourdream.caption": "从灵感、素材到画布的创作流程。",
    "studio.label": "个人产品探索",
    "studio.title": "让创作的每一步，连接起来。",
    "studio.body": "围绕 AI 创作探索桌面工作空间，把灵感发现、素材整理与画布编排放在同一条创作路径里。",
    "studio.note": "观看产品短片",
    "more.label": "还有这些探索",
    "more.JsPlumb-EasyFlowEditor": "另一种流程编排实现",
    "more.Webpack5Mfp-Node-Nacos": "微前端与服务发现",
    "more.dev-skills": "AI 协作开发工作流",
    "opensource.all": "去 GitHub 看更多",
    "work.label": "走进真实场景",
    "work.title1": "软件与物理世界",
    "work.title2": "相遇的地方",
    "work.intro":
      "在真实产品中，界面要与设备、协议和运行状态保持一致。我的工作，是把这些复杂关系转化成清晰、可信、可以操作的体验。",
    "work.alab.title": "实验室自动化",
    "work.alab.body":
      "协议编排、设备执行与实验进程，连接成一个可操作的工作空间。参与前端架构、协议工具与设备执行界面的建设。",
    "work.alab.link": "了解产品",
    "work.primegen.title": "AI 辅助实验工作流",
    "work.primegen.body":
      "从意图、工具到实验状态，让 AI 生成的计划进入真实工作流。参与 Agent 交互、可视化编排与运行监控。",
    "work.primegen.link": "了解产品",
    "work.oxygen.title": "氧生未来",
    "work.oxygen.body":
      "移动触控端、小程序和设备屏，共同承载设备控制与状态呈现。覆盖 BLE、OTA、云端同步及跨平台界面。",
    "work.oxygen.link": "了解产品",
    "work.imaging.title": "远程医疗影像",
    "work.imaging.body":
      "跨桌面、Web 与移动端的远程协作，连接实时音视频与硬件通信。参与共享界面、多窗口架构与媒体集成。",
    "work.imaging.link": "了解产品",
    "about.label": "关于我",
    "about.title1": "不只是写代码",
    "about.title2": "更喜欢造东西",
    "about.body":
      "我是一名高级前端工程师，工作与生活在深圳。关注可视化编辑、跨平台应用、设备交互和 AI 工具，也喜欢把项目中的真实问题，沉淀成可以分享的代码与方法。",
    "about.toolbox": "常用的工具箱",
    "experience.label": "走过的路",
    "experience.0.company": "MGI",
    "experience.0.role": "前端开发负责人",
    "experience.0.body":
      "围绕实验室、医疗影像与互联设备产品，参与架构、实现、集成与工程实践。",
    "experience.1.company": "长亮科技",
    "experience.1.role": "前端工程师",
    "experience.1.body": "企业产品、公共组件、微前端基础与交付流程。",
    "experience.2.company": "深圳",
    "experience.2.role": "Web 工程开发",
    "experience.2.body": "业务系统与面向用户的 Web、移动端交互。",
    "contact.label": "保持连接",
    "contact.title1": "有想法，",
    "contact.title2": "一起做出来。",
    "contact.body": "关于产品、工程、开源，或一个值得解决的问题。",
    "contact.email": "写封邮件",
    "contact.copy": "复制邮箱",
    "contact.copied": "邮箱已复制",
    "contact.copyFailed": "请直接选择邮箱地址复制",
    "footer.statement": "把复杂系统，做成好用的产品。",
    "footer.explore": "站内探索",
    "footer.opensource": "开源作品",
    "footer.work": "产品实践",
    "footer.about": "关于我",
    "footer.elsewhere": "在别处",
    "footer.github": "GitHub",
    "footer.email": "电子邮件",
    "footer.locationLabel": "此时此地",
    "footer.location": "中国 · 深圳",
    "footer.inspired": "设计灵感：",
    "footer.reference": "朱宸课题组",
    "footer.top": "回到顶部",
  };
  const en = {
    "meta.title": "Jason Chen · Interfaces for complex systems",
    "meta.description":
      "Jason Chen is a senior frontend engineer building visual editors, cross-platform applications, connected-device interfaces, and AI workflows.",
    "a11y.skip": "Skip to content",
    "brand.sub": "Frontend engineer · Shenzhen",
    "a11y.nav": "Primary navigation",
    "nav.top": "Home",
    "nav.opensource": "Open source",
    "nav.work": "Practice",
    "nav.about": "About",
    "nav.contact": "Let’s talk",
    "nav.open": "Open navigation",
    "nav.close": "Close navigation",
    "hero.identity": "An engineer. A builder.",
    "hero.eyebrow": "FRONTEND ENGINEERING · AI & AUTOMATION",
    "hero.line1": "Complex systems,",
    "hero.line2": "made ",
    "hero.accent": "human.",
    "hero.body":
      "Hi, I’m Jason, a senior frontend engineer based in Shenzhen. From visual editors and laboratory automation to connected devices and AI workflows, I build interfaces that make complex systems easier to understand and operate.",
    "hero.explore": "Explore my work",
    "hero.about": "About me",
    "hero.areas": "Areas of practice",
    "hero.pillopensource": "Visual tools & Web",
    "hero.pillwork": "Devices & platforms",
    "hero.pillai-workflows": "AI workflows",
    "hero.scroll": "Scroll to explore",
    "approach.label": "HOW I BUILD",
    "approach.title1": "From real problems",
    "approach.title2": "to working systems",
    "approach.intro":
      "Good engineering goes beyond the interface. I connect user intent, state, protocols, and execution, so design decisions have a clear reason and shipped behavior can be verified.",
    "approach.tabs": "Engineering workflow",
    "method.0.name": "Understand",
    "method.0.title": "Start with the problem.",
    "method.0.body":
      "Understand the job, the constraints, and what success looks like. Turn requirements into a shared language the team can discuss and verify.",
    "method.1.name": "Model",
    "method.1.title": "Make the state explicit.",
    "method.1.body":
      "Model devices, protocols, permissions, and runtime state consistently. Make complexity understandable before building the interface.",
    "method.2.name": "Build",
    "method.2.title": "Turn intent into interaction.",
    "method.2.body":
      "Build clear interactions across web, desktop, mobile, and devices. Help people understand the system and operate it with confidence.",
    "method.3.name": "Verify",
    "method.3.title": "Verify what actually happens.",
    "method.3.body":
      "Check interactions, data, and execution along the user journey. Keep useful test and integration evidence, and be clear about what remains unverified.",
    "opensource.label": "SELECTED OPEN SOURCE",
    "opensource.title1": "Ideas made useful,",
    "opensource.title2": "shared in code.",
    "opensource.intro":
      "When a problem keeps coming back, I turn it into a reusable tool. These projects explore visual programming, developer experience, and cross-platform interaction.",
    "opensource.snapshot": "Public GitHub data · Snapshot: 31 Oct 2026",
    "project.index": "PROJECT",
    "project.0.title": "Visual flow editor",
    "project.0.body":
      "A Vue and mxGraph flow editor exploring visual orchestration through nodes, connections, and business workflows. Give complex logic a shape people can work with.",
    "project.0.link": "View repository",
    "project.1.title": "Data-driven flow rendering",
    "project.1.body":
      "Turn structured flow data into readable graphics with D3.js, connecting data and presentation through flexible visual rendering.",
    "project.1.link": "View repository",
    "project.2.title": "On-device speech recognition",
    "project.2.body":
      "An on-device speech recognition app built with Flutter and Sherpa-ONNX, supporting on-demand model downloads, audio-stream processing, and real-time transcription.",
    "project.2.link": "View repository",
    "project.3.title": "An embeddable code editor",
    "project.3.body":
      "A code editor component built around Monaco Editor, bringing editing capabilities into application interfaces through reusable developer tooling.",
    "project.3.link": "View repository",
    "film.watch": "Watch the project film",
    "film.download": "Download film",
    "film.fallback": "Open the video directly",
    "film.error": "Playback is unavailable. Open or download the film to watch it.",
    "film.mxgraph.label": "Mxgraph-EasyFlowEditor product film",
    "film.d3.label": "D3-EasyFlowRender product film",
    "film.speech.label": "Flutter-EasySpeechRecognition product film",
    "film.monaco.label": "Monaco-EasyCodeEditor product film",
    "film.yourdream.label": "YourDream Studio product film",
    "film.mxgraph.caption": "From draggable nodes to visual workflows.",
    "film.d3.caption": "A closer look at layouts, relationships, and node details.",
    "film.speech.caption": "From model preparation to on-device speech recognition.",
    "film.monaco.caption": "From writing code to comparing changes.",
    "film.yourdream.caption": "A creative flow from inspiration and materials to the canvas.",
    "studio.label": "PERSONAL PRODUCT EXPLORATION",
    "studio.title": "Connect each step of the creative process.",
    "studio.body": "An exploration of a desktop workspace for AI creation, connecting inspiration discovery, material organization, and canvas composition in one creative path.",
    "studio.note": "Watch the product film",
    "more.label": "MORE EXPLORATIONS",
    "more.JsPlumb-EasyFlowEditor": "Another approach to flow editing",
    "more.Webpack5Mfp-Node-Nacos": "Micro-frontends & service discovery",
    "more.dev-skills": "AI-assisted development workflows",
    "opensource.all": "More on GitHub",
    "work.label": "PROFESSIONAL PRACTICE",
    "work.title1": "Where software meets",
    "work.title2": "the physical world.",
    "work.intro":
      "In real products, the interface must stay aligned with devices, protocols, and live state. My work turns those relationships into clear, reliable, operable experiences.",
    "work.alab.title": "Laboratory automation",
    "work.alab.body":
      "Connect protocol design, device execution, and experiment progress in an operable workspace. Contributions span frontend architecture, protocol tooling, and execution interfaces.",
    "work.alab.link": "Explore the product",
    "work.primegen.title": "AI-assisted experimental workflows",
    "work.primegen.body":
      "Connect intent, tools, and experiment state so AI-generated plans can enter a working process. Contributions include agent interactions, visual editing, and live monitoring.",
    "work.primegen.link": "Explore the product",
    "work.oxygen.title": "Oxygen Future",
    "work.oxygen.body":
      "Mobile touch clients, a mini program, and device screens share control and state. Work includes BLE, OTA, cloud synchronization, and cross-platform interfaces.",
    "work.oxygen.link": "Explore the product",
    "work.imaging.title": "Remote medical imaging",
    "work.imaging.body":
      "Remote collaboration across desktop, web, and mobile, connecting live media and hardware communication. Contributions cover shared UI, multi-window architecture, and media integration.",
    "work.imaging.link": "Explore the product",
    "about.label": "A LITTLE ABOUT ME",
    "about.title1": "Not a coder.",
    "about.title2": "A builder.",
    "about.body":
      "I’m a senior frontend engineer based in Shenzhen. My work spans visual editors, cross-platform applications, device interfaces, and AI tools. I like turning practical problems into code and methods others can build on.",
    "about.toolbox": "MY TOOLBOX",
    "experience.label": "EXPERIENCE",
    "experience.0.company": "MGI",
    "experience.0.role": "Frontend Development Lead",
    "experience.0.body":
      "Frontend architecture, implementation, integration, and engineering practice across laboratory, imaging, and connected-device products.",
    "experience.1.company": "Changliang Technology",
    "experience.1.role": "Frontend Engineer",
    "experience.1.body":
      "Enterprise products, shared components, micro-frontend foundations, and release workflows.",
    "experience.2.company": "Shenzhen",
    "experience.2.role": "Web Engineering",
    "experience.2.body":
      "Business systems and customer-facing products across web and mobile.",
    "contact.label": "LET’S CONNECT",
    "contact.title1": "An idea worth",
    "contact.title2": "building together.",
    "contact.body":
      "A product, an engineering challenge, an open-source idea, or a problem worth solving.",
    "contact.email": "Send an email",
    "contact.copy": "Copy email",
    "contact.copied": "Email copied",
    "contact.copyFailed": "Select the email address to copy it",
    "footer.statement": "Making complex systems easier to use.",
    "footer.explore": "EXPLORE",
    "footer.opensource": "Open source",
    "footer.work": "Practice",
    "footer.about": "About",
    "footer.elsewhere": "ELSEWHERE",
    "footer.github": "GitHub",
    "footer.email": "Email",
    "footer.locationLabel": "BASED IN",
    "footer.location": "Shenzhen, China",
    "footer.inspired": "Design inspiration: ",
    "footer.reference": "Zhu Research Group",
    "footer.top": "Back to top",
  };

  function normalizeLocale(value) {
    if (typeof value !== "string") return null;
    const locale = value.toLowerCase().replaceAll("_", "-");
    if (locale === "zh" || locale.startsWith("zh-")) return "zh-CN";
    if (locale === "en" || locale.startsWith("en-")) return "en";
    return null;
  }
  function resolveLocale({ savedLocale } = {}) {
    return normalizeLocale(savedLocale) || "zh-CN";
  }
  function translate(key, locale) {
    return (
      COPY[normalizeLocale(locale) || "zh-CN"][key] || COPY["zh-CN"][key] || key
    );
  }
  function applyLocale(locale, { persist = true } = {}) {
    const selected = normalizeLocale(locale) || "zh-CN";
    if (!global.document) return selected;
    const doc = global.document;
    doc.documentElement.lang = selected;
    doc.documentElement.dataset.locale = selected;
    for (const element of doc.querySelectorAll("[data-i18n]"))
      element.textContent = translate(element.dataset.i18n, selected);
    for (const [dataKey, attribute] of [
      ["i18nContent", "content"],
      ["i18nAriaLabel", "aria-label"],
    ]) {
      for (const element of doc.querySelectorAll(
        `[data-${dataKey.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}]`,
      ))
        element.setAttribute(
          attribute,
          translate(element.dataset[dataKey], selected),
        );
    }
    for (const button of doc.querySelectorAll("button[data-locale]"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.locale === selected),
      );
    if (persist) {
      try {
        global.localStorage.setItem(STORAGE_KEY, selected);
      } catch {}
    }
    doc.dispatchEvent(
      new CustomEvent("portfolio:localechange", {
        detail: { locale: selected },
      }),
    );
    return selected;
  }
  const COPY = Object.freeze({
    "zh-CN": Object.freeze(zh),
    en: Object.freeze(en),
  });
  global.PortfolioI18n = Object.freeze({
    STORAGE_KEY,
    SUPPORTED_LOCALES,
    COPY,
    normalizeLocale,
    resolveLocale,
    translate,
    applyLocale,
  });
})(globalThis);
