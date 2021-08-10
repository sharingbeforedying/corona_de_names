function fileDropzoneDirective($parse) {
    return {
        restrict: 'A',
        link: fileDropzoneLink
    };
    function fileDropzoneLink(scope, element, attrs) {
        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        element.bind('dragend', endDragOver);
        element.bind('dragleave', endDragOver);
        element.bind('drop', dropHandler);

        var onDropCallback = $parse(attrs.onItemsDrop);

        function dropHandler(angularEvent) {
            console.log("dropHandler");

            var evt = angularEvent.originalEvent || angularEvent;
            evt.preventDefault();
            evt.stopPropagation();

            // var items = evt.dataTransfer.items;
            // console.log(items);
            // onDropCallback(scope, {$items: items});
            onDropCallback(scope, {dataTransfer: evt.dataTransfer});
        }
        function processDragOverOrEnter(angularEvent) {
            console.log("processDragOverOrEnter");

            var evt = angularEvent.originalEvent || angularEvent;
            if (evt) {
                evt.preventDefault();
            }
            evt.dataTransfer.effectAllowed = 'move';
            //evt.dataTransfer.dropEffect = "move";

            /*
            evt.dataTransfer.effectAllowed = 'copy';
            evt.dataTransfer.dropEffect = "copy";
            */

            element.addClass('dragging');
            return false;
        }

        function endDragOver() {
            console.log("endDragOver");

            element.removeClass('dragging');
        }
    }
}

(function(){
var app = angular.module('fileDropzone', []);
app.directive("fileDropzone", fileDropzoneDirective);
})();
