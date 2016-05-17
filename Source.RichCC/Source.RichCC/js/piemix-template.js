
    (function () {
        "use strict";

        var peiMixTemplates = {"pieMixMasterTmpl":"        <div class=\"pie-mix-holder\" ng-style=\"{'height': piemixctrl.svgHolderHeight + 'px'}\">            <svg height=\"{{piemixctrl.svgHeight}}\" width=\"{{piemixctrl.svgWidth}}\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">                <path tabindex=\"0\" ng-attr-fill=\"{{path.activecolor}}\" ng-attr-d=\"{{path.d}}\" ng-attr-priority=\"{{path.priority}}\" style=\"fill: {{path.activecolor}}\" ng-repeat=\"path in piemixctrl.generatedPies  | orderBy:'priority':'false'\" ng-click=\"piemixctrl.pieSliceClicked(path.id)\" ng-mouseenter=\"path.activecolor = '#000'\" ng-mouseleave=\"path.activecolor = path.color\"/>                <rect ng-attr-x=\"{{path.colorBox.x}}\" ng-attr-y=\"{{path.colorBox.y}}\" width=\"15\" height=\"15\" style=\"fill-opacity:0;\" ng-click=\"piemixctrl.pieSliceClicked(path.id)\" ng-style=\"{'fill': path.activecolor, 'fill-opacity': path.fillOpacity}\" ng-repeat=\"path in piemixctrl.generatedPies  | orderBy:'priority':'false'\" ng-mouseenter=\"path.activecolor = '#000'\" ng-mouseleave=\"path.activecolor = path.color\"/>                <text ng-attr-x=\"{{path.textBox.x}}\" ng-attr-y=\"{{path.textBox.y}}\" ng-repeat=\"path in piemixctrl.generatedPies  | orderBy:'priority':'false'\">{{path.title}}</text>                <polyline ng-attr-points=\"{{path.ptr}}\" fill=\"none\" stroke=\"#000\" ng-attr-stroke-width=\"{{path.activecolor != '#000' ? 1 : 2}}\" ng-attr-stroke-opacity=\"{{path.activecolor != '#000' ? 0.50 : 1}}\" stroke-linecap=\"round\" stroke-dasharray=\"1, 5\" ng-repeat=\"path in piemixctrl.generatedPies  | orderBy:'priority':'false'\"/>            </svg>        </div>    "};

        angular.module('piemix.modules')
         .run(["$templateCache", function ($templateCache) {
             $templateCache.put("template/piemix/template.html", peiMixTemplates.pieMixMasterTmpl);
         }])
    })();
