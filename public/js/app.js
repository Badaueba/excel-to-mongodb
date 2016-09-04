var excelUploader = angular.module('excel-uploader', ['ui.router','filesCtrl', 'fileService']);

excelUploader.config(function ($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('home', {
            url : '/home',
            templateUrl : 'views/home.html'
        })
        .state('files', {
            url : '/files',
            templateUrl : 'views/files.html',
            controller : 'filesController',
            controllerAs : 'files'
        });
    $urlRouterProvider.otherwise('/home');
})
