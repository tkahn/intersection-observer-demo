var gulp = require('gulp'),
	connect = require('gulp-connect');

gulp.task('connect', function () {
	connect.server({
		root: './',
		livereload: true,
		port: 3000
	});
});

gulp.task('html', function () {
	gulp.src('./*.html')
		.pipe(gulp.dest('./'))
		.pipe(connect.reload());
});

gulp.task('css', function () {
	gulp.src('./css/*.css')
		.pipe(gulp.dest('./css'))
		.pipe(connect.reload());
});

gulp.task('js', function () {
	gulp.src('./js/*.js')
		.pipe(gulp.dest('./js'))
		.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(['./*.html'], ['html']);
	gulp.watch(['./css/*.css'], ['css']);
	gulp.watch(['./js/*.js'], ['js']);
});

gulp.task('default', ['connect', 'watch']);