<p align="center">
  <img
    src="https://raw.githubusercontent.com/dylandoamaral/qush/master/assets/qush.svg"
    alt="Qush"
    width="300"
  />
</p>

<p align="center">
  <a href="https://travis-ci.org/github/dylandoamaral/qush">
    <img src="https://travis-ci.org/dylandoamaral/qush.svg?branch=master" alt="Build status"/>
  </a>
    <a href="https://codecov.io/gh/dylandoamaral/qush">
    <img src="https://codecov.io/gh/dylandoamaral/qush/branch/master/graph/badge.svg" alt="Codecov"/>
  </a>
    <a href="https://npmjs.org/package/qush">
    <img src="https://img.shields.io/npm/v/qush.svg" alt="NPM version"/>
  </a>
</p>

## Description

qush is my own CLI to add, commit and push in one line.

## Why use it

- it helps you to push a commit faster  (one single line instead of three)
- it helps you to push a commit cleaner (a preset system to write consistent commits)

## Requirements

- [nodejs](https://nodejs.org/en/)
- [git](https://git-scm.com/downloads) 

## How it works

install qush globally

```bash
npm i qush -g
```

then run qush from your project folder

```bash
qush a p "my new commit"
```

it will add, commit then push the following message: "[project] add: my new commit"

the commit respects the following template "[target] action: message"

by default, qush will use the default preset

the first argument is the action, here is the mapping of this argument for the default preset:
- a → add
- d → delete
- r → refactor
- f → fix
- s → setup
- u → update

the second argument is the target, here is the mapping of this argument for the default preset:
- d → documentation
- t → test
- p → project

## Preset

you can add your own preset in the root of your github project to customise the commit message template.

the file should be named "qush.config.json", you can see an example in the github repository of this project.

## Tags available

you can also add several **tags** into that command

### The flag -H or --help

the flag shows the helper of qush.

it also can help you to see what is the current preset used by qush.

### The flag -P or --preset

the flag shows the current preset used by qush.

### The flag -S or --source 

the flag allows you to add only several source files inside the commit. 

for example: 

```bash
qush a p "my new commit" -S README.md --source packages.json
```

will only commit these two files.

if none of these flags are mentionned, then "git add ." will be used.

### The flag -Y or --yes

the flag allows you to push without any confirmation to win even more time.