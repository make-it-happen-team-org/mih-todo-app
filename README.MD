# Make It Happen
>Is an online app, which helps you to plan your days and achieve more. When signing up to "Make It Happen", online organizer will get a schedule that is powerful & flexible enough to help you get much more done. This is an online calendar based solution for your total time management. Handy for tracking your progress and maintain life balance between family, health, friends and career.

## Step by step installation:
#####1. Clone Git repository into local machine and configure user:
- Fork git repository ```https://github.com/make-it-happen-team-org/mih-todo-app.git``` ;
- Clone your repository ```git clone [``` your repository ```]``` ;
- Set git config:

    ```bash
    git remote add upstream https://github.com/make-it-happen-team-org/mih-todo-app.git
    git config --global user.name "John Doe"
    git config --global user.email johndoe@example.com
    ```

#####2. System Configuration
- Install ```NodeJS ^6.91``` [download](https://nodejs.org/en/download/);
- Ensure that ```npm ^3``` ;
- Install ```MongoDB``` and create folder structure ```db/data```, check System Environment for ```mongod``` variable;
- Execute command: ``` npm install```
- Command ```npm install -g eslint``` to install eslint;
- ```[optional]``` Command ```npm install -g karma-cli``` to install karma CLI for windows;
- ```[optional]``` Command ```npm install -g grunt-cli``` to install grunt CLI for windows;
- P.S. EditorConfig ```mih_editorconfig.xml``` (import to IDE config)

#####3. Running Application
- Command ```mongod --dbpath "d:/db/data"``` to run mongo server;
- Command ```npm run client``` compile files;
- Command ```npm run server``` starts server and gets static;

#####4. Open in browser link [http://localhost:3000/](http://localhost:3000/).

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
