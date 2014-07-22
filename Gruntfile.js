module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            sass: {
                files: ['sass/{,*/}*.{scss,sass}'],
                tasks: ['sass:dev', 'notify:sass']
            },
            livereload: {
                options: {
                    livereload: true,
                },
                files: [
                    'web/Css/*.css'
                ]
            }
        },
        sass: {
            dev: {
                options: {
                    debugInfo: true,
                    sourcemap: true
                },
                files: {
                    'www/styles/styles.css': 'sass/styles.scss'
                }
            },
            stage: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'www/styles/styles.css': 'sass/styles.scss'
                }
            }
        },
        notify: {
            sass: {
                options: {
                    title: 'SASS',
                    message: 'SASS has compiled!'
                }
            }
        }
    });

    grunt.registerTask('default', [
        'watch',
        'sass:dev',
    ]);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
}