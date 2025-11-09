const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
let grpcServer;

// Start gRPC server
function startGrpcServer() {
    try {
        const grpcServerModule = require(path.join(__dirname, "../src/grpc/coordinate/server.js"));
        // Pass mainWindow reference to server for IPC communication
        grpcServer = grpcServerModule.main(mainWindow);
        console.log("gRPC server started from Electron");
    } catch (error) {
        console.error("Failed to start gRPC server:", error);
    }
}

// Stop gRPC server
function stopGrpcServer() {
    if (grpcServer) {
        grpcServer.tryShutdown((error) => {
            if (error) {
                console.error("Error shutting down gRPC server:", error);
            } else {
                console.log("gRPC server stopped");
            }
        });
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 1200, 
        height: 800,
        icon: "",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
     

    mainWindow.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
    createWindow();
    // Start server after window is created so mainWindow is available
    startGrpcServer();
});

app.on("window-all-closed", () => {
    stopGrpcServer();
    if (process.platform !== "darwin") {
    app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
    createWindow();
    }
});

app.on("before-quit", () => {
    stopGrpcServer();
});