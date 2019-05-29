import { app } from "electron";

export default [
  {
    label: "Application",
    submenu: [
      {
        label: "关于七牛",
        selector: "orderFrontStandardAboutPanel:"
      },
      { type: "separator" },
      {
        label: "退出",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "编辑",
    submenu: [
      { label: "剪切", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "粘贴", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      {
        label: "全选",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  },
  {
    role: "help",
    label: "开发者工具",
    submenu: [
      { id: "help.toggle-dev-tools", role: "toggledevtools" }
    ]
  }
];
