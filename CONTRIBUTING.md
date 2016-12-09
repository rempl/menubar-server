## Git hooks
pre-push hook is recommended
```
$ cat .git/hooks/pre-push
#!/bin/sh

RED='\033[0;31m'
NC='\033[0m' # No Color

npm test

rc=$?
if [[ $rc != 0 ]] ; then
    # A non-zero return code means an error occurred, so tell the user and exit
    echo "\n${RED}Test failed${NC}, not pushing.\n"
    exit $rc
fi

exit 0
```

## Update app icon for Mac OS
png 1024x1024 is needed
http://blog.macsales.com/28492-create-your-own-custom-icons-in-10-7-5-or-later

## Debugging
check executables

```
~/menubar-server $ ls -al node_modules/.bin/
lrwxr-xr-x   1 username  group   18  1 01 12:00 electron -> ../electron/cli.js
lrwxr-xr-x   1 username  group   27  1 01 12:00 electron-packager -> ../electron-packager/cli.js
lrwxr-xr-x   1 username  group   23  1 01 12:00 eslint -> ../eslint/bin/eslint.js
lrwxr-xr-x   1 username  group   16  1 01 12:00 jscs -> ../jscs/bin/jscs
```