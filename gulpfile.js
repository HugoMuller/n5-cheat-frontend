'use strict';
/*eslint-env node*/
/*eslint strict: [2, "safe"]*/
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const openURL = require('open');
const lazypipe = require('lazypipe');
const rimraf = require('rimraf');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const yeoman = {
  app: require('./bower.json').appPath || 'app',
  bowerDir: 'bower_components',
  dist: 'dist',
  tmp: '.tmp'
};

const paths = {
  fonts: [`${yeoman.app}/fonts/**/*`, `${yeoman.bowerDir}/bootstrap/fonts/**/*`],
  scripts: [`${yeoman.app}/scripts/**/*.js`, `${yeoman.app}/config/*.js`, `${yeoman.app}/app.js`, `${yeoman.app}/app.module.js`],
  styles: [`${yeoman.app}/styles/main.less`],
  allStyles: {
    less: [`${yeoman.app}/styles/*.less`],
    css: [`${yeoman.app}/styles/*.css`],
  },
  views: {
    main: `${yeoman.app}/index.html`,
    directives: `${yeoman.app}/scripts/**/*.html`
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

const styles = lazypipe()
  .pipe($.less)
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, `${yeoman.tmp}/styles`);

const allStyles = () => gulp.src(paths.styles).pipe(styles());

///////////
// Tasks //
///////////

gulp.task('styles', allStyles);

gulp.task('clean:tmp', (cb) => {
  rimraf(`./${yeoman.tmp}`, cb);
});

gulp.task('start:client', ['start:server', 'styles'], () => {
  openURL('http://localhost:9000');
});

gulp.task('start:server', () => {
  $.connect.server({
    root: [yeoman.app, yeoman.tmp, '.'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});

gulp.task('watch', () => {
  $.watch(paths.allStyles.less)
    .pipe($.plumber())
    .pipe(allStyles())
    .pipe($.connect.reload());

  $.watch(paths.allStyles.css)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.views.main)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.views.directives)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe($.connect.reload());

  gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', (cb) => {
  runSequence(
    'clean:tmp',
    'start:client',
    'watch',
    cb
  );
});

gulp.task('serve:prod', () => {
  $.connect.server({
    root: [yeoman.dist],
    livereload: true,
    port: 9000
  });
});

// inject bower components
gulp.task('bower', () =>
  gulp
    .src(paths.views.main)
    .pipe(wiredep({
      ignorePath: '../'
    }))
    .pipe(gulp.dest(yeoman.app))
);

///////////
// Build //
///////////

gulp.task('clean:dist', (cb) => {
  rimraf(`./${yeoman.dist}`, cb);
});

gulp.task('client:build', ['html', 'styles'], () => {
  const jsFilter = $.filter('**/*.js');
  const cssFilter = $.filter('**/*.css');
  const refFilter = $.filter(['**/*.js', '**/*.css']);
  const babelConfig = {
    presets: ['es2015']
  };

  const babelify = $.if('scripts/scripts.js', $.babel(babelConfig));

  return gulp
    .src(paths.views.main)
    .pipe($.useref({searchPath: [yeoman.app, yeoman.tmp]}))
    .pipe(babelify)
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.cssnano())
    .pipe(cssFilter.restore())
    .pipe(refFilter)
    .pipe($.rev())
    .pipe(refFilter.restore())
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('html', () => {
  gulp
    .src(paths.views.directives)
    .pipe(gulp.dest(`${yeoman.dist}/scripts`));
});

gulp.task('copy:fonts', () =>
  gulp.src(paths.fonts)
    .pipe(gulp.dest(`${yeoman.dist}/fonts`))
);

gulp.task('copy:dev', ['copy:devStyles'], () =>
  gulp
    .src(`${yeoman.bowerDir}/**/*`)
    .pipe(gulp.dest(`app/${yeoman.bowerDir}`))
);

gulp.task('copy:devStyles', ['styles'], () =>
  gulp
    .src(`${yeoman.tmp}/styles/*.css`)
    .pipe(gulp.dest(`${yeoman.app}/styles`))
);

gulp.task('build', ['clean:dist'], () => {
  runSequence(['copy:fonts', 'client:build']);
});

gulp.task('default', ['build']);

gulp.task('dev', ['copy:dev']);
gulp.task('prod', ['build']);
