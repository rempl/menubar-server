
# tl;dr
```
npm install electron -g

git clone https://github.com/tyanas/menubar-server
cd menubar-server
npm install

npm start
```


# do later

```sh
# Install the `electron` command globally in your $PATH
npm install electron -g
```

https://github.com/szwacz/electron-boilerplate

https://github.com/maxogden/menubar


# example menubar app

## instructions

- run `npm install`
- run `npm run build` to make Example.app
- run `npm start` to run app from CLI without building Example.app

# debug

check executables

```
~/menubar-server $ ls -al node_modules/.bin/
total 24
drwxr-xr-x  5 username  group  170  5 дек 14:17 .
drwxr-xr-x  7 username  group  238  5 дек 14:00 ..
lrwxr-xr-x  1 username  group   26  5 дек 14:00 basis -> ../basisjs-tools/bin/basis
lrwxr-xr-x  1 username  group   53  5 дек 14:05 electron -> ../electron/dist/Electron.app/Contents/MacOS/Electron
lrwxr-xr-x  1 username  group   27  5 дек 14:17 electron-packager -> ../electron-packager/cli.js
```