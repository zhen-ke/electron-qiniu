// app：控制应用生命周期的模块
// BrowserWindow：创建本地浏览器窗口的模块
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import template from "./config/menu";
// 加载地址
const loginURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

const homeURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080/#layout`
    : `file://${__dirname}/index.html#layout`;

// 创建新窗口的初始化配置
let defaultWindowConfig = {
  useContentSize: true,
  titleBarStyle: "hidden",
  resizable: false,
  webPreferences: {
    webSecurity: false
  }
};
let mainWin;

function createWindow(config) {
  // 创建一个新窗口
  mainWin = new BrowserWindow({
    ...defaultWindowConfig,
    width: 350,
    height: 500,
    ...config
  });
  // 默认加载登录界面
  mainWin.loadURL(loginURL);
  // 当窗口关闭时调用的方法
  mainWin.on("closed", () => {
    mainWin = null;
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// electron 初始化完成后
app.on("ready", () => {
  createWindow();
});
// 当所有窗口关闭时退出应用
app.on("window-all-closed", () => {
  // 在win下应用会退出，而在macOS下应用不会退出，需要用户手动退出（默认macOS也是这个机制）
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// 激活窗口
app.on("activate", () => {
  // 在macOS下应用会重新创建一个新窗口
  if (mainWin === null) {
    createWindow();
  }
});
// 监听渲染进程发送过来的消息
ipcMain.on("switchToHome", () => {
  mainWin.loadURL(homeURL);
  mainWin.setContentSize(980, 650);
  
});
ipcMain.on("switchToLogin", () => {
  mainWin.loadURL(loginURL);
  mainWin.setContentSize(350, 500);
});
