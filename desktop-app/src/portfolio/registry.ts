import { ui } from "./ui.svelte";
import { createProjectDetail, projectCopy } from "./project-details";
  const strings = {
    "zh-CN": { desktop: "桌面", about: "关于我", projects: "开源作品", craft: "构建方法", ai: "AI 工作室", contact: "联系我", github: "GitHub", greeting: "你好，我是 Jason。", role: "高级前端工程师 · 深圳", headline: "把复杂系统，\n做成好用的产品。", subtitle: "可视化编辑器、跨平台应用与 AI 工作流。\n这里是我的数字工作台，欢迎随意探索。", explore: "打开我的作品", hint: "从下方 Dock，打开一个新想法。", file: "认识 Jason", folder: "开源项目", note: "联系我", close: "关闭窗口", minimize: "最小化窗口", maximize: "切换窗口大小", navigation: "应用程序", external: "在新标签页打开 GitHub", windowhint: "拖动标题栏移动 · 双击放大", home: "显示桌面", made: "一个关于探索与构建的个人空间" },
    en: { desktop: "Desktop", about: "About me", projects: "Open source", craft: "How I build", ai: "AI Studio", contact: "Contact", github: "GitHub", greeting: "Hello, I’m Jason.", role: "Senior Frontend Engineer · Shenzhen", headline: "Complex systems.\nThoughtful products.", subtitle: "Visual editors, cross-platform apps & AI workflows.\nWelcome to my digital workbench. Make yourself at home.", explore: "Explore my work", hint: "A new idea is just a Dock icon away.", file: "Meet Jason", folder: "Open source", note: "Get in touch", close: "Close window", minimize: "Minimize window", maximize: "Toggle window size", navigation: "Applications", external: "Open GitHub in a new tab", windowhint: "Drag to move · Double-click to expand", home: "Show desktop", made: "A personal space for exploring & building" }
  };
  Object.assign(strings["zh-CN"], { mxgraph: "mxGraph 流程编辑器", d3: "D3 流程渲染", speech: "离线语音识别", monaco: "Monaco 代码编辑器", jsplumb: "JsPlumb 流程编辑器", microfrontends: "微前端与服务发现", devskills: "dev-skills", yourdream: "YourDream Studio", dockScroll: "左右滑动 Dock，探索全部作品", directory: "选择一个作品，在独立窗口中打开。" });
  Object.assign(strings.en, { mxgraph: "mxGraph Flow Editor", d3: "D3 Flow Renderer", speech: "Speech Recognition", monaco: "Monaco Code Editor", jsplumb: "JsPlumb Flow Editor", microfrontends: "Microfrontends & Discovery", devskills: "dev-skills", yourdream: "YourDream Studio", dockScroll: "Swipe the Dock to explore every project", directory: "Choose a project to open in its own window." });
  Object.assign(strings["zh-CN"], projectCopy["zh-CN"], { labware: "Labware Creator", easyui: "EasyUI", flutterflow: "Flutter EasyFlow", projects: "全部项目" });
  Object.assign(strings.en, projectCopy.en, { labware: "Labware Creator", easyui: "EasyUI", flutterflow: "Flutter EasyFlow", projects: "All projects" });
  export const t = (key: string) => strings[ui.locale === "en" ? "en" : "zh-CN"][key] || key;
  const svg = paths => `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${paths}</svg>`;
  export const icons = {
    about: svg('<path d="M5 10a6 6 0 0 1 6-6h13v40H11a6 6 0 0 1-6-6Z" fill="#8cdcff"/><path d="M24 4h13a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H24Z" fill="#f2f4ef"/><path d="M24 4c-5 8-8 17-5 22h8v12" stroke="#2475b0" stroke-width="2"/><path d="M12 16v3m23-3v3m-23 10c6 7 17 7 23 0" stroke="#1d4674" stroke-width="2.3" stroke-linecap="round"/>'),
    projects: svg('<path d="M3 13a4 4 0 0 1 4-4h12l5 5h17a4 4 0 0 1 4 4v22H3Z" fill="#8be0ff"/><path d="M3 20a4 4 0 0 1 4-4h34a4 4 0 0 1 4 4v17a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z" fill="#3aaff1"/><path d="m19 24-5 5 5 5m10-10 5 5-5 5" stroke="#e7f8ff" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>'),
    craft: svg('<rect x="5" y="4" width="38" height="40" rx="8" fill="#fff8dd"/><path d="M5 12a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v3H5Z" fill="#ffd657"/><path d="M13 23h23m-23 7h23m-23 7h15" stroke="#a7a391" stroke-width="2" stroke-linecap="round"/><path d="m29 33 10-10 3 3-10 10-5 2Z" fill="#e79c30"/>'),
    ai: svg('<rect x="3" y="3" width="42" height="42" rx="12" fill="#9b67db"/><path d="m24 9 4.3 10.7L39 24l-10.7 4.3L24 39l-4.3-10.7L9 24l10.7-4.3Z" fill="#fff5fa"/><path d="m36 7 1.4 3.6L41 12l-3.6 1.4L36 17l-1.4-3.6L31 12l3.6-1.4Z" fill="#f5d387"/>'),
    contact: svg('<rect x="3" y="6" width="42" height="36" rx="9" fill="#398ef5"/><path d="M8 13h32v24H8Z" fill="#fafcff"/><path d="m8 13 16 13 16-13M8 37l12-14m20 14L28 23" stroke="#85b7ee" stroke-width="1.6" stroke-linejoin="round"/>'),
    github: svg('<rect x="3" y="3" width="42" height="42" rx="12" fill="#292d38"/><path d="M16 35c-1-5 0-7 3-8-7-1-9-8-6-12l-1-6 7 3a19 19 0 0 1 10 0l7-3-1 6c3 4 1 11-6 12 3 1 4 4 3 10H16" fill="#faf8f4"/><path d="M17 32c-7 2-6-5-10-4" stroke="#faf8f4" stroke-width="2" stroke-linecap="round"/>')
  };
  export const projectApps: any[] = [
    { id: "yourdream", hash: "yourdream", key: "yourdream", repo: "YourDream Studio", content: document.getElementById("yourdream") },
    { id: "labware", hash: "labware", key: "labware", repo: "labware-creator-agent" },
    { id: "easyui", hash: "easyui", key: "easyui", repo: "EasyUI" },
    { id: "mxgraph", hash: "project-0", key: "mxgraph", repo: "Mxgraph-EasyFlowEditor", content: document.getElementById("project-0")!.closest("article") },
    { id: "speech", hash: "project-2", key: "speech", repo: "Flutter-EasySpeechRecognition", content: document.getElementById("project-2")!.closest("article") },
    { id: "devskills", hash: "dev-skills", key: "devskills", repo: "dev-skills", content: document.getElementById("dev-skills") },
    { id: "flutterflow", hash: "flutterflow", key: "flutterflow", repo: "Flutter-EasyFlow", dock: false },
    { id: "d3", hash: "project-1", key: "d3", repo: "D3-EasyFlowRender", dock: false, content: document.getElementById("project-1")!.closest("article") },
    { id: "microfrontends", hash: "microfrontends", key: "microfrontends", repo: "Webpack5Mfp-Node-Nacos", dock: false },
    { id: "monaco", hash: "project-3", key: "monaco", repo: "Monaco-EasyCodeEditor", dock: false, archived: true, content: document.getElementById("project-3")!.closest("article") },
    { id: "jsplumb", hash: "jsplumb", key: "jsplumb", repo: "JsPlumb-EasyFlowEditor", dock: false, archived: true }
  ];
  // Product assets are copied byte-for-byte from their real projects; D3 uses its official technology mark.
  const projectIconFiles: Record<string, string> = {
    mxgraph: 'mxgraph.png', d3: 'd3.svg', speech: 'speech.jpg', monaco: 'monaco.jpg',
    labware: 'labware.png', easyui: 'easyui.png', flutterflow: 'flutterflow.png', jsplumb: 'jsplumb.ico', microfrontends: 'webpack.png', devskills: 'devskills.png', yourdream: 'yourdream.png'
  };
  projectApps.forEach(app => {
    icons[app.id] = `<span class="mac-project-icon mac-project-icon--${app.id}" data-project-icon="${app.id}"><img src="./assets/project-icons/${projectIconFiles[app.id]}" alt="" draggable="false" decoding="async" /></span>`;
    if (!app.content) {
      app.content = createProjectDetail(app, t, projectIconFiles[app.id]);
    }
    app.content!.classList.add("mac-project-content");
  });
  const overview = document.getElementById("opensource")!;
  const directory = document.createElement("div");
  directory.className = "mac-project-directory";
  directory.innerHTML = `<p data-desktop-text="directory">${t("directory")}</p><div class="mac-project-launchers">${projectApps.filter(app => !app.archived).map(app => `<button data-app-open="${app.id}" class="mac-project-launcher"><span class="mac-directory-icon">${icons[app.id]}</span><span><strong data-desktop-text="${app.key}">${t(app.key)}</strong><small>${app.repo}</small></span><span aria-hidden="true">↗</span></button>`).join("")}</div>`;
  overview.querySelector(".project-ledger")!.after(directory);
  overview.querySelector(".more-projects")!.remove();
  export const appList = [
    { id: "about", hash: "about", key: "about" },
    { id: "projects", hash: "opensource", key: "projects", dock: false },
    ...projectApps,
    { id: "craft", hash: "craft", key: "craft", dock: false },
    { id: "contact", hash: "contact", key: "contact" }
  ];
  export const dockApps = [...appList.filter(app => app.dock !== false), { id: "github", key: "github" }];

export const apps_config: Record<string, any> = Object.fromEntries(appList.map(app => [app.id, { ...app, should_open_window: true, expandable: true, width: 1050, height: 720 }]));
