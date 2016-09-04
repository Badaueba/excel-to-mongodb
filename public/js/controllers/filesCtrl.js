var filesCtrl = angular.module('filesCtrl', ['ngFileUpload',
'angularUtils.directives.dirPagination','file-model', 'fileService']);

filesCtrl.controller('filesController', filesController);

function filesController (Upload, Request) {
    var ctrl = this;
    ctrl.msg = '';
    ctrl.sheets =[];
    ctrl.endPoint = '';
    ctrl.data = [];

    ctrl.getData = function () {
        Request.get('/files')
            .then(function (res){
                console.log(res.data);
                ctrl.data = res.data;
            })
            .catch(function (err){
                ctrl.msg = err;
            });
    };

    ctrl.getData();

    ctrl.upload = function (files) {
        console.log('upload')
        if (!files)  {
            ctrl.msg = 'Nenhum arquivo selecionado!';
            return ;
        }
        else {

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: "/files",
                    file : file,
                    progress: function(e){
                        console.log(e);
                    }
                })
                .then(function(response, status, headers, config) {
                    console.log(JSON.stringify(response.data));
                    ctrl.msg = response.data.message;
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
            document.getElementById('uploadField').value = null;
        }
    };
}
