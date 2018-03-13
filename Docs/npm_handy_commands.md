# To search for what versions of a package there are at npmjs.com
```
npm show (packagename)@* version
```

# To show only top-level modules (ng is global, nl is local)
```
alias ng="npm list -g --depth=0 2>/dev/null"
alias nl="npm list --depth=0 2>/dev/null"
```

# To list all dependencies and their dependencies and so on ad infinitum
```
npm list
```

# To list packages that are outdated
```
npm outdated
```

