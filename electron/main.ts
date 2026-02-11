import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
  webviewTag: true,
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true
}

  });
  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile("dist/index.html");
  }
}

app.whenReady().then(createWindow);
