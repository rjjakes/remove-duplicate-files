#!/usr/bin/env node

let command = require('./index')

try {
  command()
}
catch (e) {
  console.log(e)
  process.exit(1)
}