var fileService = angular.module('fileService', []);

fileService.factory ('Request', request);

function request ($http) {

    var request = {};
    request.get = function (url) {
        return $http.get(url);
    };
    request.post = function (url, data) {
        return $http.post(url, data);
    };
    request.put = function (url, data) {
        return $http.put(url, data);
    };
    request.delete = function (url) {
        return $http.delete(url);
    }

    return request;
}
