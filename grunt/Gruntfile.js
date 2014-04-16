module.exports = function (grunt) {

    require('time-grunt')(grunt);


    require('load-grunt-tasks')(grunt, ['grunt-*']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        application: {
            namespace: 'BadAssPlayer',
            dirs: {
                app: 'app',
                front: '../public'
            },    
        }

        ,

        jshint: {
            files: ['<%= application.dirs.app %>/javascripts/main.js'],
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
              src: ['<%= application.dirs.app %>/javascripts/*.js'],
              dest: '<%= application.dirs.front %>/javascripts/scripts.js',
              nonull: true,
            },
        },
        watch: {
            files: ['<%= application.dirs.app %>/javascripts/*.js'],
            tasks: 'auto'
        },
        uglify: {
            options: {
                banner: '/*! <%= application.namespace %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= application.dirs.front %>/javascripts/scripts.min.js': ['<%= application.dirs.front %>/javascripts/scripts.js']
                }
            }
        },

    });


    grunt.registerTask('auto', ['jshint', 'concat', 'uglify']);



    grunt.registerTask('release', ['jshint']);
    grunt.loadNpmTasks('grunt-contrib-concat'); 
    grunt.loadNpmTasks('grunt-contrib-uglify');

};
