# add-commit-push

[![Build Status](https://travis-ci.org/dylandoamaral/add-commit-push.svg?branch=master)](https://travis-ci.org/dylandoamaral/add-commit-push)
[![Codecov](https://codecov.io/gh/dylandoamaral/add-commit-push/branch/master/graph/badge.svg)](https://codecov.io/gh/dylandoamaral/add-commit-push)
[![Version](https://img.shields.io/npm/v/add-commit-push.svg)](https://npmjs.org/package/add-commit-push)

## Description

acp is my own CLI to add, commit and push in one line.

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

install acp globally

```bash
npm -i add-commit-push -g
```

then run acp from your project folder

```bash
acp a p "my new commit"
```

it will add, commit then push the following message: "[target] add: my new commit"

the commit respect the following template "[target] action: message"

by default, acp will use the default preset

the first argument is the action, here is the mapping of this argument for the default preset:
- a => add
- d => delete
- r => refactor
- f => fix
- s => setup
- u => update

the second argument is the target, here is the mapping of this argument for the default preset:
- d => documentation
- t => test
- p => project

## Tags available

you can also add several **tags** into that command

### The flag -H or --help

the flag show the helper of acp.

it also can help you to see what is the current preset used by acp.

### The flag -S or --source 

the flag allow you to add only several source files inside the commit. 

for example: 

```bash
acp a p "my new commit" -S README.md --source packages.json
```

will only commit these two files.

if none of these flags are mentionned, then "git add ." will be used.

### The flag -Y or --yess 

the flag allow you to push without any confirmation to win even more time.

## Changelog

### v0.0.0

- add acp command
- add presets

### v0.1.0

- add source (-H/--help) flag
- add source (-S/--source) flag
- add source (-Y/--yes) flag
- fix branch to point to the current branc and not master