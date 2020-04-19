# add-commit-push

[![Build Status](https://travis-ci.org/dylandoamaral/add-commit-push.svg?branch=master)](https://travis-ci.org/dylandoamaral/add-commit-push)
[![codecov](https://codecov.io/gh/dylandoamaral/add-commit-push/branch/master/graph/badge.svg)](https://codecov.io/gh/dylandoamaral/add-commit-push)

## Description

acp is my own CLI to add, commit and push in one line.

## How it works

install acp globally

```bash
npm -i add-commit-push -g
```

then run acp from your project folder

```bash
acp a p "my new commit"
```

it will add, commit then push the following message: "[project] add: my new commit"

the commit respect the following template "[project] action: message"

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

