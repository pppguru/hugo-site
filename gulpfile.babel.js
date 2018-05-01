import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import del from "del";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task("build", ["scss", "js", "fonts"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["scss", "js", "fonts"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile SCSS files to CSS
gulp.task("scss", () => {

  //Delete our old css files
  del(["./src/css/**/*"]);

  gulp.src("./src/scss/**/*.scss")
    .pipe(sass({
      outputStyle : "compressed"
    }))
    .pipe(autoprefixer({
      browsers : ["last 20 versions"]
    }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
});

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Move all fonts in a flattened directory
gulp.task("fonts", () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

//Clean the dist directory
gulp.task("clean:dist", () => {
  return del.sync("dist/*");
})

// Development server with browsersync
gulp.task("server", ["hugo", "clean:dist", "scss", "js", "fonts"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("src/scss/**/*", ["scss"]);
  gulp.watch("./src/fonts/**/*", ["fonts"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
