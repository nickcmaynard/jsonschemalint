function readSchemaFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        // bind to AngularJS model
        var scope = angular.element(document.getElementById("mainbody")).scope();
        scope.$apply(function () {
            scope.ctrl.schema = contents
        });
    };
    reader.readAsText(file);
}

function readDocumentFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        // bind to AngularJS model
        var scope = angular.element(document.getElementById("mainbody")).scope();
        scope.$apply(function () {
            scope.ctrl.document = contents
        });
    };
    reader.readAsText(file);
}

document.getElementById('json-schema-input').addEventListener('change', readSchemaFile, false);
document.getElementById('json-document-input').addEventListener('change', readDocumentFile, false);