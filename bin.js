#!/usr/bin/env node
var adventure = require('adventure')
var fs = require('fs')
var mit = require('./data/mit')
var parseJSON = require('json-parse-errback')
var path = require('path')
var replace = require('stream-replace')
var verify = require('adventure-verify')

var title = require('./package.json').name
var workshop = adventure(title)

workshop.add('Welcome!', function() {
  return {
    problem: readContent('Welcome'),
    verify: function(args, cb) {
      cb(true) } } })

workshop.add('Using The MIT License for Your Work', function() {
  return {
    problem: readContent('MIT'),
    verify: verify(
      { modeReset: true },
      function(arguments, test) {
        test.test('package.json File', function(test) {
          test.plan(5)
          var packageJSON = path.join(process.cwd(), 'package.json')
          // Have a package.json file.
          fs.stat(packageJSON, function(error, stats) {
            test.ifError(error, 'Can stat package.json')
            if (stats) {
              test.equal(
                stats.isFile(), true,
                'Have a package.json file') } })
          // package.json is valid JSON ...
          fs.readFile(packageJSON, 'utf8', function(error, data) {
            test.ifError(error, 'CAn read package.json')
            parseJSON(data, function(error, data) {
              test.ifError(error, 'package.json is valid JSON')
              // with "license" of "MIT"
              if (data) {
                test.equal(
                  data.license, 'MIT',
                  '"license" is "MIT" in package.json') } }) }) })
        test.test('LICENSE File', function(test) {
          test.plan(6)
          var licenseFile = path.join(process.cwd(), 'LICENSE')
          // Have a LICENSE file.
          fs.stat(licenseFile, function(error, stats) {
            test.ifError(error, 'Can stat LICENSE')
            if (stats) {
              test.equal(
                stats.isFile(), true,
                'Have a LICENSE file') } })
          // LICENSE file content is correct.
          fs.readFile(licenseFile, 'utf8', function(error, data) {
            test.ifError(error, 'Can read LICENSE')
            var lines = data
              .replace(/\n+/, '\n')
              .split('\n')
            var currentYear = new Date().getFullYear().toString()
            // License identification.
            test.assert(
              /^MIT License$/.test(lines[0]),
              'First line says "MIT License"')
            // Copyright notice.
            test.assert(
              new RegExp('^Copyright \\(c\\) ' + currentYear + ' .+$')
                .test(lines[1]),
              'Second line is a copyright notice')
            // License terms.
            test.equal(
              lines.slice(2).join('\n').replace(/\n+/g, '\n').trim(),
              mit.join('\n'),
              'Remaining lines contain standard MIT terms') }) }) }) } })

workshop.add('Using The MIT License with Contributors', function() {
  return {
    problem: readContent('MIT-with-Friends'),
    verify: verify(
      { modeReset: true },
      function(arguments, test) {
        test.test('package.json File', function(test) {
          test.plan(5)
          var packageJSON = path.join(process.cwd(), 'package.json')
          // Have a package.json file.
          fs.stat(packageJSON, function(error, stats) {
            test.ifError(error, 'Can stat package.json')
            if (stats) {
              test.equal(
                stats.isFile(), true,
                'Have a package.json file') } })
          // package.json is valid JSON ...
          fs.readFile(packageJSON, 'utf8', function(error, data) {
            test.ifError(error, 'CAn read package.json')
            parseJSON(data, function(error, data) {
              test.ifError(error, 'package.json is valid JSON')
              // with "license" of "MIT"
              if (data) {
                test.equal(
                  data.license, 'MIT',
                  '"license" is "MIT" in package.json') } }) }) })
        var author
        test.test('LICENSE File', function(test) {
          test.plan(6)
          var licenseFile = path.join(process.cwd(), 'LICENSE')
          // Have a LICENSE file.
          fs.stat(licenseFile, function(error, stats) {
            test.ifError(error, 'Can stat LICENSE')
            if (stats) {
              test.equal(
                stats.isFile(), true,
                'Have a LICENSE file') } })
          // LICENSE file content is correct.
          fs.readFile(licenseFile, 'utf8', function(error, data) {
            test.ifError(error, 'Can read LICENSE')
            var lines = data
              .replace(/\n+/, '\n')
              .split('\n')
            var currentYear = new Date().getFullYear().toString()
            // License identification.
            test.assert(
              /^MIT License$/.exec(lines[0]),
              'First line says "MIT License"')
            // Copyright notice.
            var re = new RegExp(
              ( '^Copyright \\(c\\) ' + currentYear +
                ' (.+) and contributors$' ))
            var match = re.exec(lines[1])
            test.assert(
              !!match,
              'Copyright notice has "and contributors"')
            author = ( match ? match[1] : undefined )
            // License terms.
            test.equal(
              lines.slice(2).join('\n').replace(/\n+/g, '\n').trim(),
              mit.join('\n'),
              'Remaining lines contain standard MIT terms') }) })
        test.test('AUTHORS File', function(test) {
          test.plan(5)
          var licenseFile = path.join(process.cwd(), 'AUTHORS')
          // Have an AUTHORS file.
          fs.stat(licenseFile, function(error, stats) {
            test.ifError(error, 'Can stat AUTHORS')
            if (stats) {
              test.equal(
                stats.isFile(), true,
                'Have an AUTHORS file') } })
          // AUTHORS file content is correct.
          fs.readFile(licenseFile, 'utf8', function(error, data) {
            test.ifError(error, 'Can read AUTHORS')
            var lines = data
              .replace(/\n+/, '\n')
              .split('\n')
            // Mentions LICENSE.
            test.assert(
              /^#.*LICENSE file/.test(data),
              'AUTHORS mentions the LICENSE file')
            // Has line for author.
            test.assert(
              lines.some(function(line) {
                return ( line.indexOf(author) > -1 ) }),
              'AUTHORS has a line for the author') }) }) }) } })

function readContent(basename) {
  return function() {
    return fs.createReadStream(
      path.join(__dirname, 'content', basename),
      'ascii')
      .pipe(replace(/\$title/g, title)) } }

workshop.execute(process.argv.slice(2))
