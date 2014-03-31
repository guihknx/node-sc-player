module.exports = function (grunt) {

    require('time-grunt')(grunt);


    require('load-grunt-tasks')(grunt, ['grunt-*']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        namespace: 'BadAssPlayer',

        jshint: {
            files: ['app/javascripts/*.js'],
            options: {
                curly:   true,
                eqeqeq:  true,
                immed:   true,
                latedef: true,
                newcap:  true,
                noarg:   true,
                sub:     true,
                undef:   true,
                boss:    true,
                eqnull:  true,
                browser: true,

                globals: {
                    module:     true,
                    require:    true,
                    requirejs:  true,
                    define:     true,
                    console:    true,
                    $:          true,
                    jQuery:     true,
                    sinon:      true,
                    describe:   true,
                    it:         true,
                    expect:     true,
                    beforeEach: true,
                    afterEach:  true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            missing: {
              src: ['app/javascripts/*.js'],
              dest: '../public/javascripts/scripts.js',
              nonull: true,
            },
        },
        watch: {
            files: ['app/javascripts/*.js'],
            tasks: 'auto'
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.namespace %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '../public/javascripts/scripts.min.js': ['../public/javascripts/scripts.js']
                }
            }
        },

    });


    grunt.registerTask('auto', ['jshint', 'concat', 'uglify']);



    grunt.registerTask('release', ['jshint']);
    grunt.loadNpmTasks('grunt-contrib-concat'); 
    grunt.loadNpmTasks('grunt-contrib-uglify');

};
