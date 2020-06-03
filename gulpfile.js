const gulp = require('gulp');
const rename = require('gulp-rename');   //文件重命名
const uglify = require('gulp-uglify');   //JS代码压缩
const minCSS = require('gulp-clean-css'); //css文件压缩
const autoprefixer = require('gulp-autoprefixer');  //添加浏览器前缀
const clean   = require('gulp-clean');     //清空文件
const cleanDest = require('gulp-clean-dest'); //清空dist目录指定文件
const changed = require('gulp-changed');  //仅仅传递更改过的文件
const imagemin = require('gulp-imagemin');  //图片压缩
const filter = require('gulp-filter');   //js压缩过滤器，排除已压缩过的
const less = require('gulp-less');  //处理sass文件
const babel = require('gulp-babel');  //处理sass文件
const concat = require('gulp-concat');  //合并
const browserSync = require('browser-sync'); //拥有实时重载服务器
const reload = browserSync.reload;  //编译后重新刷新浏览器

const jsSrc = 'static/dev/js/*.js';
const jsDist = 'static/dest/js/';
const cssSrc = 'static/dev/css/*.css';
const cssDist = 'static/dest/css/';
const lessSrc = 'static/dev/less/*.less';
const lessDist = 'static/dev/css/';
const imgSrc = 'static/dev/images/*';
const imgDist = 'static/dest/images/';

gulp.task('less', function () {  //将less文件编译成css
    return gulp.src(lessSrc)
        // .pipe(changed(lessSrc))
        .pipe(cleanDest(lessDist))//先清空后生成
        .pipe(less())
        .pipe(gulp.dest(lessDist))
        .pipe(reload({ stream:true }));
});

gulp.task('css', function() {  //拷贝压缩css
    return gulp.src([
        'static/dev/css/style.css',
    ])
        // .pipe(changed(cssDist))
        .pipe(concat('style.css'))
        .pipe(cleanDest(cssDist))//先清空后生成
        .pipe(autoprefixer())
        // 这会输出一个未压缩过的版本
        .pipe(gulp.dest(cssDist))
        .pipe(minCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(cssDist))
        .pipe(reload({ stream:true }));
});


gulp.task('img', function() {  //拷贝压缩图片
    return gulp.src([imgSrc])
        .pipe(changed(imgSrc))
        .pipe(cleanDest(imgDist))//先清空后生成
        // 这会输出一个未压缩过的版本
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(imgDist))
        .pipe(reload({ stream:true }));
});

var  jsFilter = filter([jsSrc], {restore: true});
gulp.task('js', function() {  //拷贝压缩js
    // return gulp.src(jsSrc)
    return gulp.src([
        'static/dev/js/style.js',
    ])
        .pipe(concat('style.js'))
        // .pipe(changed(jsDist))
        // .pipe(cleanDest(jsDist))//先清空后生成
        .pipe(jsFilter)
        // 这会输出一个未压缩过的版本
        .pipe(babel())
        .pipe(gulp.dest(jsDist))
        // 这会输出一个压缩过的并且重命名未 foo.min.js 的文件
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(jsFilter.restore)
        .pipe(gulp.dest(jsDist))
        .pipe(reload({ stream:true }));
});


//清除dist目录
gulp.task('clean', function () {
    return gulp.src([
        'static/dist/js',
        'static/dist/css'
    ], {read: false})
        .pipe(clean());
});

// gulp.task('default', gulp.series('less','css', 'js','img'));
gulp.task('default', gulp.series('less','css', 'js'));

gulp.task('watch',function () {
    gulp.watch(lessSrc,gulp.series('less'))
    gulp.watch(cssSrc,gulp.series('css'))
    gulp.watch(jsSrc,gulp.series('js'))
    // gulp.watch(imgSrc,gulp.series('img'))
})
