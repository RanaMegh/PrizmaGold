// main.js
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // AU LIEU DE : win.loadFile('index.html')
  // UTILISEZ L'URL DE VITE :
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);