<p align="center">
  <img
    src="https://raw.githubusercontent.com/dylandoamaral/qush/master/assets/qush.svg"
    alt="Qush"
    width="500"
  />
</p>


[![Build Status](https://travis-ci.org/dylandoamaral/qush.svg?branch=master)](https://travis-ci.org/dylandoamaral/qush)
[![Codecov](https://codecov.io/gh/dylandoamaral/qush/branch/master/graph/badge.svg)](https://codecov.io/gh/dylandoamaral/qush)
[![Version](https://img.shields.io/npm/v/qush.svg)](https://npmjs.org/package/qush)

## Description

qush is my own CLI to add, commit and push in one line.

## Why this project

- because I was boring
- because I was lazy and using add then commit then push was not optimized
- because it forces me to respect a line of conduct for my commits
- because I can
- because I wanted to use typescript for one of my project

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

the commit respect the following template "[target] action: message"

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

the flag show the helper of qush.

it also can help you to see what is the current preset used by qush.

### The flag -P or --preset

the flag show the current preset used by qush.

### The flag -S or --source 

the flag allow you to add only several source files inside the commit. 

for example: 

```bash
qush a p "my new commit" -S README.md --source packages.json
```

will only commit these two files.

if none of these flags are mentionned, then "git add ." will be used.

### The flag -Y or --yes

the flag allow you to push without any confirmation to win even more time.

## Changelog

### v1.0.0

- rename acp to qush
- everything is functionnal

#### v1.0.1

- (fix) the flag -P prompted the default preset instead of the local preset in sub directories of a project

#### v1.0.2

- (fix) errors were not properly sequenced
- (fix) correction of some grammatical errors

#### v1.0.3

- (fix) Unix compatibility

#### v1.0.4

- remove "For UNIX user" section in README
