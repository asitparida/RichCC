(function () {
    "use strict";

    /*  VX GRID 
        LAST UPDATE - 29-10-2015 16:38 
        LAST UPDATE BY - ASPARIDA
        
        VX GRID CONFIG (BOUND TO 'config=') IN DIRECTIVE CALL
        -----------------------------------------------------------       
        <CONFIG>.enableDropdownsInHeader        <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO ENABLE DROPDOWNS ON C0LUMNS, ELSE DEFAULT SORT ON HEADER CLICK
        <CONFIG>.selectionEnabled               <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLE ROW SELECTION
        <CONFIG>.multiSelectionEnabled          <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLE MULTI ROW SELECTION - DEPENDENT ON 
        <CONFIG>.showGridStats                  <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLE ROW SELECTION
        <CONFIG>.showGridOptions                <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLE ROW SELECTION
        <CONFIG>.selectAllOnRenderAll           <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLE SELECT ONLY WHEN ALL ROWS ARE RENDERED
        <CONFIG>.multiSelectionDependentCol     <SUPPORTED : Y>    :   <STRING>    SET TO COLUMN ON WHICH MULTI SELECTION IS DEPENDENT OR SET TO '' OR NULL
        <CONFIG>.onSelectionReturnCol           <SUPPORTED : Y>    :   <STRING>    SET TO COLUMN WHICH POPERTY IS RETURNED ON ROW SELECTION CHANGE
        <CONFIG>.showTable                      <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLE SELECT ONLY WHEN ALL ROWS ARE RENDERED
        <CONFIG>.data                           <SUPPORTED : Y>    :   <ARRAY>
        <CONFIG>.xsRowTitleTemplate             <SUPPORTED : Y>    :   <STRING>    SET TO XS ONLY TEMPLATE - DEFAULTS TO PRIMARY COLUMN HEADER
		<CONFIG>.virtualization					<SUPPORTED : Y>    :   <BOOLEAN>   SET TO FALSE TO DISABLE VIRTUALIZATION AND ENABLE PAGINATION
		<CONFIG>.pageLength						<SUPPORTED : Y>    :   <NUMBER>	   SET PAGINATION LENGTH AND DEFUALTS TO 20
        <CONFIG>.inlineEditingEnabled			<SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLING INLINE EDITING OPTION
        <CONFIG>.inlineAddRowEnabled			<SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE FOR ENABLING ADDING ROW
        <CONFIG>.newRowTemplate			        <SUPPORTED : Y>    :   <STRING>    SET TO NEW TEMPLATE
        
        VX GRID COLUMN CONFIG (BOUND TO EACH ITEM IN  'vxConfig.columnDefConfigs') IN DIRECTIVE DEFINTION
        -----------------------------------------------------------------------------------------------------
        <COLUMN>.dropDownEnabled                <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO ENABLE COLUMN DROPDOWN
        <COLUMN>.ddSort                         <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO ADD SORT OPTION TO COLUMN DROPDOWN
        <COLUMN>.ddFilters                      <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO ADD FILTERS TO COLUMN DROPDOWN
        <COLUMN>.ddGroup                        <SUPPORTED : N>    :   <BOOLEAN>   SET TO TRUE TO ADD GROUP OPTION TO COLUMN DROPDOWN
        <COLUMN>.hidden                         <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO HIDE COLUMN ON DEFAULT
        <COLUMN>.xsHidden                       <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO HIDE COLUMN ON DEFAULT ON XS RESOLUTION
        <COLUMN>.locked                         <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO FIX COLUMN VISIBILITY, COLUMN ORDER, COLUMN WIDTH
        <COLUMN>.primary                        <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO ENABLE THIS COLUMN AS PRIMARY
        <COLUMN>.width                          <SUPPORTED : Y>    :   <STRING>    SET WIDTH FOR COLUMN - DEFUALT '200'
        <COLUMN>.renderDefn                     <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE ENABLE CUSTOM TEMEPLATE
        <COLUMN>.headerDefn                     <SUPPORTED : N>    :   <STRING>    SET CUSTOM HEADER TEMPLATE
        <COLUMN>.cellDefn                       <SUPPORTED : Y>    :   <STRING>    SET CUSTOM CELL TEMPLATE - USE 'VX_ROW_POINT' FOR ROW LEVEL PROPERTY & 'VX_DATA_POINT' FOR ROW CELL LEVEL PROPERTY
        <COLUMN>.inlineEditOnColumnEnabled      <SUPPORTED : Y>    :   <BOOLEAN>   SET TO TRUE TO ENABLE COLUMN INLINE EDITING
        <COLUMN>.editDefn                       <SUPPORTED : Y>    :   <STRING>    SET CUSTOM CELL TEMPLATE - USE 'VX_ROW_POINT' FOR ROW LEVEL PROPERTY & 'VX_DATA_POINT' FOR ROW CELL LEVEL PROPERTY
        <COLUMN>.editDefnTemplate               <SUPPORTED : Y>    :   <STRING>    SET EDIT TEMPLATE TYPE - USE 'VX_ROW_POINT' FOR ROW LEVEL PROPERTY & 'VX_DATA_POINT' FOR ROW CELL LEVEL PROPERTY - SUPPORTED TYPES - 'INPUT', 'TEXTAREA'

        VX GRID EVENTS
        ----------------------
        'vxGridRowSelectionChange'                  <OUT>   EVENT ON ROW SELECTION CHANGE EMITING DATA :   {'key': <ROW_VALUE_'onSelectionReturnCol'>, 'value': <BOOLEAN_NEW_SELECTION_STATE>, '_pKey': <PRIMARY_ID_VXGRID> }
        'vxGridRowMultiSelectionChange'             <OUT>   EVENT ON MULTIROW SELECTION CHANGE EMITING DATA COLLECTION OF :   {'key': <ROW_VALUE_'onSelectionReturnCol'>, 'value': <BOOLEAN_NEW_SELECTION_STATE>, '_pKey': <PRIMARY_ID_VXGRID> }
        'vxPartiallyRendered'                       <OUT>   EVENT ON VX GRID PARTIAL RENDERED
        'vxCompletelyRendered'                      <OUT>   EVENT ON VX GRID COMPLETE RENDERED
        'vxPartiallyRenderedSelectAllDisabled'      <OUT>   EVENT ON VX GRID PARTIAL RENDERED AND SELECT ALL DISABLED - ONLY ON  <CONFIG>.selectAllOnRenderAll SET TO TRUE
        'vxCompletelyRenderedSelectAllEnabled'      <OUT>   EVENT ON VX GRID COMPLETE RENDERED AND SELECT ALL ENABLED - ONLY ON  <CONFIG>.selectAllOnRenderAll SET TO TRUE
        'vxGridSettingsChanged'                     <OUT>   EVENT ON VX GRID SETTINGS CHANGED
        'vxGridSettingsBuilt'                       <OUT>   EVENT ON VX GRID COL SETTINGS BUILT
        'vxGridChangeRowClass'                      <IN>    ON EVENT, ROW CLASS CHANGED AS PER PARAMETER - ACCPETS { ID : VXGRID_ID, DATA : []} , DATA IS COLLECTION OF {'key': 'ROW PRIMARY ID VALUE', 'value', '<NEW ROW CLASS NAMES>'}
        'vxGridResetRowClass'                       <IN>    ON EVENT, RESETS ALL CLASS NAMES ADDED AS PART OF 'vxGridChangeRowClass'
        'vxGridDisableRowSelection'                 <IN>    ON EVENT, ENABLES/DISABLES ROW SELECTION - ACCEPTS { ID : VXGRID_ID, DATA : []} , DATA IS COLLECTION OF {'key': 'ROW PRIMARY ID VALUE', 'value': <BOOLEAN>}
        'vxGridResetDisableRowSelection'            <IN>    ON EVENT, ENABLES ALL ROW FOR SELECTION
        'vxGridOpenManageColumns',                  <IN>    ON EVENT, OPENS MANAGE COLUMNS MODAL
        'vxGridResetVxInstance',                    <IN>    ON EVENT, RESETS THE TABLE INSTANCE 
        'vxGridClearFilters',                       <IN>    ON EVENT, CLEARS ALL FILTERS APPLIED
        'vxGridSelectAllFiltered',                  <IN>    ON EVENT, SELECTS ALL ROWS WITH FILTES APPLIED 
        'vxGridClearSelection',                     <IN>    ON EVENT, CLEARS SELECTION OF ALL ROWS
        'vxGridRevealWrapToggle'                    <IN>    ON EVENT, TOGGLES WRAP ON COLUMNS

        VX GRID CONFIG EXTENSIONS
        ----------------------------
        <CONFIG>.getVxCounts()                  <NO PARAMS>         RETURNS COUNT - {'vxAllDataLength': <LENGTH OF ALL DATA> , 'vxFilteredDataLength' : <LENGTH OF FILTERED DATA SET>, 'vxSelectedDataLength' : <LENGTH OF SELECTED DATA SET>
        <CONFIG>.getData()                      <NO PARAMS>         RETURNS CURRENT DATA STATE
        <CONFIG>.setRowFieldValidation()        <ID, COL, VALID>    SETS ROW AND FEILD VALIDATION TO 'VALID' VALUE
    */

    /* CAPITALIZE FIRST LETTER - STRING PROTOTYPE*/
    String.prototype.capitalizeFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    String.prototype.replaceAll = function (find, replaceWith) {
        var regex = new RegExp(find, 'g');
        return this.replace(regex, replaceWith);
    }

    function _GUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
        }
        return s4() + s4() + "_" + s4();
    }

    angular.module('rich.cc.modules', ['ngSanitize', 'ui.bootstrap'])
    .directive("richCc", function () {
        return {
            restrict: 'AEC',
            scope: {
                config: '=',
                scrollParent: '='
            },
            controller: ["$scope", "$modal", "$sce", "$timeout", "$rootScope", "$window", "$filter", function ($scope, $modal, $sce, $timeout, $rootScope, $window, $filter) {
                
            }],
            replace: true,
            templateUrl: 'template/vx-grid/vx-grid.html',
            link: function ($scope, element, attributes) {
                $scope.selfEle = element;
                /* BUILD COL SETTINGS */
                $scope.$watchCollection('config.data', function (n) {
                    if (n.length == 0)
                        n = [{ 'fillEmptyElement': true }];
                    $scope.config.vxData = n;
                    $scope.resetVxInstance();
                });

                $scope.$watchCollection('vxConfig.vxFilteredData', function (n) {
                    if (n.length > 0) {
                        /* PROCESS FOR PAGINATION IF VIRTUALIZATION IS FALSE */
                        if ($scope.vxConfig.virtualization == false) {
                            $scope.vxColSettings.pages = _.range(Math.ceil(n.length / parseInt($scope.vxConfig.pageLength)));
                            $scope.vxColSettings.vxPageEnabled = $scope.vxColSettings.pages.length > 1;
                            $scope.vxColSettings.activePage = 0;
                            $scope.vxColSettings.vxPageStartPosition = 0;
                        }
                    }
                });

                var container = angular.element($(element).find('.scrollTableContainer')[0]);
                container.on('scroll', function () {
                    lazyScrollHeaderPositioning();
                });
                var lazyScrollHeaderPositioning = _.debounce(function () {
                    $scope.$apply(function () {
                        $scope.posLeft = container.scrollLeft() > 1 ? -container.scrollLeft() : 1;
                        $scope.posTop = container.scrollTop();
                    });
                }, 50);

                $scope.getNonHiddenColCount = function () {
                    var result = 1;
                    if (typeof $scope.vxConfig.columnDefConfigs !== 'undefined' && $scope.vxConfig.columnDefConfigs.length > 0)
                        result = _.filter($scope.vxConfig.columnDefConfigs, function (header) { return header.hidden == false }).length;
                    return result;
                }
            }
        };
    })
    .directive("vxCompile", ["$compile", function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.vxCompile);
                },
          function (value) {
              element.html(value);
              $compile(element.contents())(scope);
          }
            );
        }
    }])
    .directive("vxCompileCloneLink", ["$compile", function ($compile) {
        var compileCache = {};
        var evalCache = {};
        return function (scope, element, attrs) {
            var forEvaled = null;
            if (attrs.vxCompileCloneLink in compileCache) {
                forEvaled = evalCache[attrs.vxCompileCloneLink];
            }
            else {
                evalCache[attrs.vxCompileCloneLink] = scope.$eval(attrs.vxCompileCloneLink);
                forEvaled = evalCache[attrs.vxCompileCloneLink];
            }
            var forLink = null;
            if (forEvaled in compileCache) {
                forLink = compileCache[forEvaled];
            }
            else {
                compileCache[forEvaled] = $compile(forEvaled);
                forLink = compileCache[forEvaled];
            }
            forLink(scope, function (clonedElement, scope) {
                element.append(clonedElement);
            })
        }
    }])
    .directive("vxKey", function () {
        return {
            restrict: 'AEC',
            link: function ($scope, elem, attr) {
                elem.on('click', function (e) {
                    if (attr.vxdisabled != true)
                        $scope.$apply(attr.vxKey);
                });
                elem.on('keyup', function (e) {
                    if ((e.keyCode == 13 || e.keyCode == 32) && attr.vxdisabled != true)
                        $scope.$apply(attr.vxKey);
                });
            }
        };
    })
    .directive("vxKeepWatch", function () {
        return {
            restrict: 'AEC',
            link: function ($scope, elem, attr) {
                var field = attr.vxKeepWatch;
                var init = false;
                $scope.$watch(attr[field], function (newValue) {
                    if (init)
                        $scope.$emit('vxInlineEditFieldChange', { 'field': attr.vxKeepWatchField, 'value': newValue, 'rowId': attr.vxKeepWatchRowId });
                    else
                        init = true;
                });
            }
        };
    })
    .filter("vxGridMultiBoxFilters", function () {
        return function (items, criteria) {
            if (typeof criteria !== 'undefined' && criteria != null && criteria.length > 0) {
                var filtered = items;
                var copyOfItems = items;
                var filterGroups = _.groupBy(criteria, 'col');
                for (var columnFound in filterGroups) {
                    var matches = filterGroups[columnFound];
                    var unionedMatches = [];
                    _.each(matches, function (match) {
                        unionedMatches = _.union(unionedMatches, _.filter(copyOfItems, function (item) {
                            console.log(item[match.col].toString().trim());
                            console.log(match.label);
                            if (typeof match.label !== 'undefined' && match.label != null && match.label != {} && typeof item[match.col] !== 'undefined' && item[match.col] != null && item[match.col] != {}) {
                                if (match.type == 'object')
                                    return JSON.stringify(item[match.col]).localeCompare(JSON.stringify(match.label)) == 0;
                                else
                                    return item[match.col].toString().trim().localeCompare(match.label) == 0;
                            }
                            else
                                return item[match.col] == match.label;
                        }));
                    });
                    filtered = _.intersection(filtered, unionedMatches);
                }
                return filtered;
            }
            else
                return items;
        };
    })
    .filter("vxNumberFixedLen", function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = '' + num;
            while (num.length < len) {
                num = '0' + num;
            }
            return num;
        };
    })
	.filter('vxStartFrom', function () {
	    return function (input, start) {
	        if (input) {
	            start = +start;
	            var ret = input.slice(start);
	            return ret;
	        }
	        return [];
	    };
	})
})();