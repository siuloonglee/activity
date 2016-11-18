/**
 * Gruntfile JS
 * dubao
 * 2015-08-19
 */

var Path = require('path');
var banner = '/**\n * laoluo - v1.0.1\n' +
        ' * author: Don\n' +
        ' * update: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * copyright: http://www.iflytek.com/\n */\n';

//var node_modules = '../../../../node_modules/';
var node_modules = '/disk1/node_modules/';
var imagemin_pngout = require(node_modules + 'imagemin-pngout')();
var imagemin_jpegtran = require(node_modules + 'imagemin-jpegtran')();
var imagemin_gifsicle = require(node_modules + 'imagemin-gifsicle')();
var imagemin_svgo = require(node_modules + 'imagemin-svgo')();

module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                options: {
                    banner: banner,
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'target/laoluo/js/index.js': ['js/jquery.min.js', 'js/adaptive.js', 'js/platform.js', 'js/index.js']
                }
            }
        },
        cssmin: {
            build: {
                options: {
                    banner: banner
                },
                files: {
                    'target/laoluo/css/index.css': ['css/index.css']
                }
            }
        },
        copy: {
            html: {
                expand: true,
                cwd: '',
                src: ['*.html'],
                dest: 'target/laoluo/'
            },
            img: {
                expand: true,
                cwd: 'img/',
                src: '**',
                dest: 'target/laoluo/img/'
            }
        },
        imagemin: {
            build: {
                options: {
                    use: [imagemin_pngout, imagemin_jpegtran, imagemin_gifsicle, imagemin_svgo]
                },
                files: [{
                        expand: true,
                        cwd: 'target/laoluo/img/',
                        src: '**/*.{png,jpg,gif,svg}',
                        dest: 'target/laoluo/img/'
                    }]
            },
        },
        usemin: {
            build: {
                src: ['target/laoluo/*.html'],
            },
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: 'target/laoluo/',
                src: ['*.html'],
                dest: 'target/laoluo/'
            }
        },
        replace: {
            build: {
                options: {
                    patterns: [{
                            match: 'timestamp',
                            replacement: '<%= grunt.template.today("yyyymmddHHMMss") %>'
                        }],
                },
                files: [
                    {expand: true, flatten: true, src: ['target/laoluo/*.html'], dest: 'target/laoluo/'},
                    {expand: true, flatten: true, src: ['target/laoluo/js/*.js'], dest: 'target/laoluo/js/'},
                    {expand: true, flatten: true, src: ['target/laoluo/css/*.css'], dest: 'target/laoluo/css/'},
                ]
            }
        },
        jshint: {
            debug: {
                options: {
                    force: true,
                    reporter: require(node_modules + 'jshint-html-reporter'),
                    reporterOutput: 'target/laoluo/cqa/jshint_debug.html',
                },
                files: {
                    src: ['js/*.js'],
                }
            },
            deploy: {
                options: {
                    force: true,
                    reporter: require(node_modules + 'jshint-html-reporter'),
                    reporterOutput: 'target/laoluo/cqa/jshint_deploy.html',
                },
                files: {
                    src: ['target/laoluo/js/*.js'],
                }
            }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-uglify", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-cssmin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-htmlmin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-copy", 'tasks'));

    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-imagemin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-newer", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-replace", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-usemin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-jshint", 'tasks'));

    grunt.registerTask('default', [
        'uglify', 'cssmin',
        'copy:html', 'copy:img',
        'newer:imagemin',
        'usemin',
        'htmlmin',
        'replace',
        'jshint:debug', 'jshint:deploy'
    ]);
};