/* global __dirname */

const path = require('path');
const electron =  require('electron');
const {app, BrowserWindow} = electron;

const maxWidth = 1280;
const maxHeight = 800;

const minWidth = 800;
const minHeight = 600;


const debug = /--debug/.test(process.argv[2]);

let mainWindow = null;

let ignoreCertificateError = true;

function initialize () {
  makeSingleInstance();

  function createWindow () {
    var screen = electron.screen;  
    var mainScreen = screen.getPrimaryDisplay();

    var dimensions = mainScreen.workArea; // dimension without the screen task bar 

    var desiredWidth = dimensions.width * 0.9;
    var desiredHeight = dimensions.height * 0.9;

    desiredWidth = Math.floor(desiredWidth); //remove decimal part otherwise electron will produce wrong result in the display
    desiredHeight = Math.floor(desiredHeight); //remove decimal part otherwise electron will produce wrong result in the display

    if(desiredWidth > maxWidth){
        desiredWidth = maxWidth;
    }

    if(desiredHeight > maxHeight){
        desiredHeight = maxHeight;
    }


    if(desiredWidth < minWidth){
        desiredWidth = dimensions.width;
    }

    if(desiredHeight < minHeight){
        desiredHeight = dimensions.height;
    }

    //console.log(dimensions.width, desiredWidth);
    //console.log(dimensions.height, desiredHeight);
      
    const windowOptions = {
      width: desiredWidth,
      minWidth: minWidth,
      height: desiredHeight,
      minHeight: minHeight,
      frame: false,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true
      }
    };

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png');
    }

    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools();
      //mainWindow.maximize();
      require('devtron').install();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.on('ready', () => {
    createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
    
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    
    if(ignoreCertificateError){
        
        console.warn('WARNIING!!! Certificate error ignored for "'+url+'" - Is this intentional?');
        
        event.preventDefault();
        callback(true);
    }
    
    
  });
  
  
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

initialize();



