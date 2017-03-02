var gulp = require( 'gulp' ),
    gp_sass = require( 'gulp-sass' ),
	gp_rename = require( 'gulp-rename' );

var sass_options = {
	outputStyle: 'expanded'
};

gulp.task( 'styles', function() {
	gulp.src( 'sass/*.scss' )
		.pipe( gp_sass( sass_options ) )
		.pipe( gp_rename( 'style.css' ) )
		.pipe( gulp.dest( './css/' ) );
} );

gulp.task( 'watch', function() {
	gulp.watch( 'sass/**/*.scss', [ 'styles' ] );
} );

gulp.task( 'default', [ 'styles' ] );