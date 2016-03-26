#!/usr/bin/env node
var adventure = require('adventure')
var fs = require('fs')
var path = require('path')
var verify = require('adventure-verify')

var workshop = adventure(require('./package.json').name)

workshop.add('Introdution', function() {
  return {
    problem: readContent('Introduction'),
    verify: function(args, cb) {
      cb(true) } } })

workshop.add('Set License Metadata', function() {
  return {
    problem: '...',
    verify: verify(
      { modeReset: true },
      function(arguments, test) {
        test.end() }) } })

workshop.add('Make a LICENSE File', function() {
  return {
    problem: '...',
    verify: verify(
      { modeReset: true },
      function(arguments, test) {
        test.end() }) } })

function readContent(basename) {
  return function() {
    return fs.readFileSync(
      path.join(__dirname, 'content', basename),
      'ascii') } }

workshop.execute(process.argv.slice(2))
