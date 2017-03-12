# Make It Happen
>Is an online app, which helps you to plan your days and achieve more. When signing up to "Make It Happen", online organizer will get a schedule that is powerful & flexible enough to help you get much more done. This is an online calendar based solution for your total time management. Handy for tracking your progress and maintain life balance between family, health, friends and career.

## Step by step installation:
### Clone Git repository into local machine and configure user:
- Fork git repository ```https://github.com/make-it-happen-team-org/mih-todo-app.git``` ;
- Clone your repository ```git clone [``` your repository ```]``` ;
- Set git config:

    ```bash
    git remote add upstream https://github.com/make-it-happen-team-org/mih-todo-app.git
    git config --global user.name "John Doe"
    git config --global user.email johndoe@example.com
    ```

### System Configuration
- Install ```NodeJS ^6.91``` [download](https://nodejs.org/en/download/);
- Ensure that ```npm ^3``` ;
- Install ```MongoDB``` and create folder structure ```db/data```, check System Environment for ```mongod``` variable;
- Install ```JDK 1.8``` ;
- Install ```Android SDK``` and set ANDROID_HOME with path to your Android SDK folder in system variables;
- Run ```android.bat``` in root of Android SDK folder and install all from folder "Tools" and "Android 7.1.1 (API 25)". You cant choose another API level if you want.;
- Install Cordova ```npm install cordova -g```;
- Add android platform by running ```cordova platform add android```;
- Execute command: ``` npm install```;
- Command ```npm install -g eslint``` to install eslint;
- ```[optional]``` Command ```npm install -g karma-cli``` to install karma CLI for windows;
- ```[optional]``` Command ```npm install -g grunt-cli``` to install grunt CLI for windows;
- P.S. EditorConfig ```mih_editorconfig.xml``` (import to IDE config)

### Set up android emulator
- Go to root Android SDK folder;
- Run "android.bat" file;
- "Tools" -> "Manage AVDs...";
- Open "Device Definitions" tab to display all available devices;
- Pick device you want to emulate and click "Create AVD...";
- Go

### Running Application (common)
- Command ```mongod``` to run mongo server (to specify db path use --dbpath option);
- Command ```npm run build:web``` to build app for browser;
- Command ```npm run build:mobile``` to build app for android device;
- Command ```npm start``` run server;
- If running on browser, target endpoint [http://localhost:3000/](http://localhost:3000/).

### Running application on mobile device
- Run server;
- Set up server url as process environment variable: ```set MIH_URL=http://_your_ip_addres_:3000/```;
- Build application for android device;
- Connect android device to computer;
- Inside device open "Developers options" in "settings" and allow "USB debugging";
- Command ```cordova run --list``` to display all available devices to deploy;
- Command ```cordova run android --device``` to running application on real device;
- Command ```cordova run android --emulator``` to running application on emulator;
- If all is done correctly, you can find "Make It Happen" application on target device;

## GIT flow

  ```
    master
    ------------------------------------------------------------------->
                                               /
                                              /
    _________________________________________/develop
               \                /
                \              /
                 \____________/feature
  ```

##### Creating PR:
- git fetch --all
- git pull upstream develop
- git commit -m ‘Merging Comment ….’
- git push origin [ feature branch ]
- check if branch have no conflict with ```upstream develop```
- Create PR (Pull Request)

## LESS Code style notes

```
  public/
        |
         less/ => Public LESS directory
         |     |
         |     _app.mixins.less
         |     _app.override.less
         |     _app.variables.less
         |     app.main.less => Aggregate all LESS modules compiles to ./css/app.css
         |
         |
         modules/
                |
                --------[module]
                       |
                       ------less/
                              |
                              ------[less_module]
                              |           |
                              |           ----- _[module_name].[less_module_name].less|
                              |
                              ------------[module-name].less => Agrgregate less modules
```


##### Common Rules
```less
  .slots-table { max-height: 300px; }
  
  .overdue-badge {
    background: transparent;
    color: @base-color;
    border: 1px solid @base-color;
    border-radius: 50%;
    cursor: pointer;
    transition: all .5s;

    &:hover {
      background: @base-color;
      color: #FFF;
    }
  }
```

##### Pay attention on:
- single rule selector put in one line.
- cascade selectors if it possible
- last line of file should be empty
- after each cascade should be empty line except first
- use mixins if it possible
- use variables
- use shortcuts
- use HEX in uppercase
- use ```em, rm``` units if it possible
- use ```.1(em)``` instead of ```0(em)```
- don't use ```!important```, only in cases where no any other variants
- use media with ```screen```
- sort rules in order:

```less
  .selector {
    //--------------Positioning----------------
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
  
    //----------Display & Box Model------------
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 10px solid #333;
    margin: 10px;
    
    //------------------Color--------------------
    background: #000;
    color: #FFF;
    
    //-------------------Text---------------------
    font-family: sans-serif;
    font-size: 16rem;
    line-height: 1.4;
    text-align: right;
    
    //-------------------Other---------------------
    cursor: pointer;
  }
```
