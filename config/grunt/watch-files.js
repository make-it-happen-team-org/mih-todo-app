module.exports = {
    clientViews: ['public/modules/**/views/**/*.html'],
    clientCSS: ['public/assets/**/*.css'],
    allES6: ['public/**/*.es6'],
    clientLESS: ['public/**/*.less', '!public/lib/**/*.less'],
    clientJS: [
        'public/js/**/*.js',
        'public/**/*.es6',
        '!public/**/*.compiled.js'
    ]
};
