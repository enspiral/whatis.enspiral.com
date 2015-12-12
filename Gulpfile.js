var Fs = require('fs')
var Path = require('path')
var gulp = require('gulp')
var File = require('vinyl')
var buffer = require('vinyl-buffer')
var parallel = require('run-parallel')
var through = require('through2')
var map = require('through2-map')
var assign = require('object-assign')
var Handlebars = require('handlebars')
var HandlebarsIntl = require('handlebars-intl')
var Yaml = require('js-yaml')

var srcDir = Path.join(__dirname, 'src')

function html (cb) {
  var Hbs = Handlebars.create()
  HandlebarsIntl.registerWith(Hbs)

  var data = {
    locales: {},
    context: {}
  }

  parallel([
    // for each partial, load
    loadPartials.bind(null, Hbs, Path.join(srcDir, 'partials')),
    loadLocales.bind(null, data.locales, Path.join(srcDir, 'locales')),
    loadContext.bind(null, data.context, Path.join(srcDir, 'context.yml'))
  ], function (err) {
    if (err) { return cb(err) }

    renderTemplates(Hbs, data, cb)
  })
}

gulp.task('build-html', html)
gulp.task('watch-html', ['build-html'], function () {
  gulp.watch('src/**/*.{hbs,yml}', ['build-html'])
})

function forEachFileInDirectory (directory, fn, cb) {
  Fs.readdir(directory, function (err, files) {
    if (err) { return cb(err) }
    parallel(
      files.map(function (file) {
        var path = Path.join(directory, file)
        return forFile.bind(null, path, fn)
      })
    , cb)
  })
}

function forFile (path, fn, cb) {
  var name = Path.basename(path, Path.extname(path))

  Fs.readFile(path, 'utf8', function (err, contents) {
    if (err) { return cb(err) }

    var maybeErr = fn(contents, name)

    if (maybeErr instanceof Error) {
      process.nextTick(function () { cb(maybeErr) })
    } else {
      process.nextTick(cb)
    }
  })
}

function loadPartials (Hbs, partialsDirectory, cb) {
  forEachFileInDirectory(partialsDirectory, function (partial, partialName) {
    Hbs.registerPartial(partialName, partial)
  }, cb)
}

function loadLocales (data, localesDirectory, cb) {
  forEachFileInDirectory(localesDirectory, function (locale, localeName) {
    try {
      var localeData = Yaml.safeLoad(locale)
    } catch (err) {
      return err
    }
    data[localeName] = localeData
  }, cb)
}

function loadContext (data, contextFile, cb) {
  forFile(contextFile, function (context) {
    try {
      var contextData = Yaml.safeLoad(context)
    } catch (err) {
      return err
    }
    assign(data, contextData)
  }, cb)
}

function renderTemplates (Hbs, data, cb) {
  return gulp.src(Path.join(srcDir, 'pages/*.hbs'))
    .pipe(buffer())
    //.pipe(data(getData))
    .pipe(through.obj(function (pageFile, enc, next) {
      var input = String(pageFile.contents)
      // for each locale,
      Object.keys(data.locales).forEach(function (localeName) {
        // create intl data
        var intlData = {
          locales: [localeName],
          messages: data.locales[localeName]
        }
        // create context data
        var context = assign({}, data.context, {
          lang: localeName
        })
        // render handlebars template
        try {
          var template = Hbs.compile(input)
          var contents = template(context, {
            data: { intl: intlData }
          })
        } catch (err) {
          console.error(err)
          return
        }
        // push new page file in locale directory
        this.push(new File({
          cwd: pageFile.cwd,
          base: pageFile.base,
          path: Path.join(pageFile.base, localeName,
            Path.basename(
              pageFile.path, Path.extname(pageFile.path)
            ) + '.html'
          ),
          contents: Buffer(contents)
        }))

        // if default locale, push to root
        if (localeName === context.defaultLocale) {
          this.push(new File({
            cwd: pageFile.cwd,
            base: pageFile.base,
            path: Path.join(pageFile.base,
              Path.basename(
                pageFile.path, Path.extname(pageFile.path)
              ) + '.html'
            ),
            contents: Buffer(contents)
          }))
        }
      }.bind(this))
      next()
    }))
    //.pipe(prettify())
    .pipe(gulp.dest('./build'))
    .on('end', cb)
}
