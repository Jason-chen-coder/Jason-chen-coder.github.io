// Project descriptions follow each public repository's README; media comes from the projects themselves.
const copy = {
  labware: {
    summary: ['用对话与表单定义实验室耗材，在同一份数据上检查 JSON、2D 孔位和 3D 结构。', 'Define laboratory consumables with conversation and forms, and inspect JSON, 2D well layouts and 3D geometry from the same definition.'],
    features: ['表单参数编辑 · 2D / 3D 联动预览 · Definition 导出', 'Parameter editing · Linked 2D / 3D previews · Definition export'],
    note: ['在线体验提供表单与本地预览；真实 Agent 对话需要本地前后端服务。', 'The online demo provides forms and local previews. Live Agent conversations require the local frontend and backend.'],
    caption: ['产品宣传片：耗材结构与模拟创建流程', 'Product film: labware structures and the simulated creation workflow']
  },
  easyui: {
    summary: ['面向 Flutter Web、桌面与移动端的组件工作台，把设计 token、常用交互和示例页面沉淀为可复用的 UI 层。', 'A Flutter component workbench for web, desktop and mobile, bringing design tokens, interaction patterns and examples into a reusable UI layer.'],
    features: ['表单与数据展示 · 浅色 / 深色主题 · 中英文示例 · AI 视图构建 Skill', 'Forms and data display · Light / dark themes · Bilingual examples · AI view-building skill'],
    note: ['打开在线工作台，浏览组件和示例页面，切换主题与语言。', 'Open the live workbench to explore components and example pages, and switch themes and languages.'],
    caption: ['产品宣传片：组件工作台与主题切换', 'Product film: component workbench and theme switching']
  },
  flutterflow: {
    summary: ['使用 Flutter 构建的流程图工具，探索跨平台画布上的节点编排和连线交互。', 'A flowchart tool built with Flutter, exploring node composition and connections on a cross-platform canvas.'],
    features: ['Flutter 画布 · 流程图交互 · Web 在线演示', 'Flutter canvas · Flowchart interactions · Live web demo'],
    note: ['与 mxGraph 编辑器采用不同的技术路线，可在在线演示中体验。', 'Explore a different implementation approach from the mxGraph editor in the live demo.'],
    caption: ['Flutter EasyFlow 应用图标', 'Flutter EasyFlow app icon']
  },
  microfrontends: {
    summary: ['Webpack 5 模块联邦、Node.js 与 Nacos 的微前端实践，探索前端模块拆分与服务发现的协作方式。', 'A microfrontend experiment with Webpack 5 Module Federation, Node.js and Nacos, exploring frontend module composition and service discovery.'],
    features: ['Module Federation · Node.js · Nacos 服务发现', 'Module Federation · Node.js · Nacos service discovery'],
    note: ['这是需要配套服务运行的工程案例；查看源码与 README 了解启动方式。', 'This engineering example requires supporting services. See the source and README for setup instructions.'],
    caption: ['Webpack 技术标识', 'Webpack technology mark']
  },
  jsplumb: {
    summary: ['基于 jsPlumb 的流程图编辑器探索，展示另一种节点与连线的编排实现。', 'A flowchart editor experiment using jsPlumb, demonstrating another approach to composing nodes and connections.'],
    features: ['jsPlumb · 节点编排 · 流程连线', 'jsPlumb · Node composition · Flow connections'],
    note: ['作为流程编辑系列的补充项目保留，详细实现与运行方式见源码。', 'Retained as a companion project in the flow-editing series. See the repository for implementation and setup.'],
    caption: ['JsPlumb 项目标识', 'JsPlumb project icon']
  }
};
export const projectCopy: Record<string, Record<string, string>> = { 'zh-CN': {}, en: {} };
for (const [id, fields] of Object.entries(copy)) {
  for (const [field, translations] of Object.entries(fields)) {
    projectCopy['zh-CN'][`${id}.${field}`] = translations[0];
    projectCopy.en[`${id}.${field}`] = translations[1];
  }
}
Object.assign(projectCopy['zh-CN'], { 'detail.features': '核心能力', 'detail.demo': '打开在线体验', 'detail.source': '查看源码', 'detail.archived': '更多探索' });
Object.assign(projectCopy.en, { 'detail.features': 'Core capabilities', 'detail.demo': 'Try the live demo', 'detail.source': 'View source', 'detail.archived': 'More explorations' });
const demos = { labware: 'labware-creator-agent/', easyui: 'EasyUI/', flutterflow: 'Flutter-EasyFlow/' };
export function createProjectDetail(app: { id: string; hash: string; repo: string }, t: (key: string) => string, icon: string) {
  const article = document.createElement('article');
  article.id = app.hash;
  article.className = 'mac-extra-project mac-detail';
  article.dataset.projectDetail = app.id;
  const text = (tag: string, key: string) => `<${tag} data-desktop-text="${key}">${t(key)}</${tag}>`;
  const hasFilm = ['labware', 'easyui'].includes(app.id);
  const filmRevision = app.id === 'labware' ? '7' : '2';
  const media = hasFilm
    ? `<video controls playsinline preload="metadata" poster="./assets/videos/${app.id}-poster.jpg?v=${filmRevision}"><source src="./assets/videos/${app.id}.mp4?v=${filmRevision}" type="video/mp4" /></video>`
    : `<img src="./assets/project-icons/${icon}" alt="${app.repo}" loading="lazy" decoding="async" />`;
  const demo = demos[app.id];
  article.innerHTML = `<header><p class="eyebrow">${app.repo}</p><h2>${t(app.id)}</h2>${text('p', `${app.id}.summary`)}</header>
    <figure class="mac-detail-media ${hasFilm ? '' : 'mac-detail-brand'}">${media}${text('figcaption', `${app.id}.caption`)}</figure>
    <section>${text('h3', 'detail.features')}${text('p', `${app.id}.features`)}</section>
    ${text('p', `${app.id}.note`)}
    <nav class="mac-detail-links">${demo ? `<a class="text-link" href="https://jason-chen-coder.github.io/${demo}" target="_blank" rel="noopener noreferrer">${text('span', 'detail.demo')} ↗</a>` : ''}<a class="text-link" href="https://github.com/Jason-chen-coder/${app.repo}" target="_blank" rel="noopener noreferrer">${text('span', 'detail.source')} ↗</a></nav>`;
  article.querySelector('h2')!.dataset.desktopText = app.id;
  return article;
}
