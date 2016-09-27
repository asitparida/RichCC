angular.module('richcc.bootstrap.datepicker', ['ui.bootstrap', 'ui.bootstrap.dateparser', 'ui.bootstrap.isClass', 'ui.bootstrap.position', 'FredrikSandell.worker-pool'])

.value('$datepickerSuppressError', false)

.constant('richccDatepickerConfig', {
    datepickerMode: 'day',
    formatDay: 'dd',
    formatMonth: 'MMMM',
    formatYear: 'yyyy',
    formatDayHeader: 'EEE',
    formatDayTitle: 'MMMM yyyy',
    formatMonthTitle: 'yyyy',
    maxDate: null,
    maxMode: 'year',
    minDate: null,
    minMode: 'day',
    ngModelOptions: {},
    shortcutPropagation: false,
    showWeeks: true,
    yearColumns: 5,
    yearRows: 4,
    light: false,
    yearMapHeat: false,
    preventModeToggle: false,
    preventCalNav: false,
    hideCalNav: false,
    showMarkerForMoreEvents: true,
    showDataLabel: false,
    defaultDataLabel: '00:00',
    monthPopUpTmpl: 'template/richcc/richccMonthPopup.html',
    dayPopUpTmpl: 'template/richcc/richccDayPopup.html',
    enableWebWorkers: false,
    expandedMode: false,
    webWorkerAngularPath: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js'
})

.service('richCCShared', function () {
    var self = this;
    self.enableWebWorkers = false;
    self.webWorkerAngularPath = 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js';
    return self;
})

.controller('RichccDatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$locale', '$log', 'dateFilter', 'richccDatepickerConfig', '$datepickerSuppressError', 'uibDateParser', 'richCCShared',
  function ($scope, $attrs, $parse, $interpolate, $locale, $log, dateFilter, datepickerConfig, $datepickerSuppressError, dateParser, richCCShared) {
      var self = this,
          ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl;
          ngModelOptions = {},
          watchListeners = [];

      // Modes chain
      this.modes = ['day', 'month', 'year'];

      if ($attrs.datepickerOptions) {
          angular.forEach([
            'enableWebWorkers',
            'expandedMode',
            'light',
            'yearMapHeat',
            'preventModeToggle',
            'preventCalNav',
            'hideCalNav',
            'showMarkerForMoreEvents',
            'showDataLabel',
            'defaultDataLabel',
            'monthPopUpTmpl',
            'dayPopUpTmpl',
            'customClass',
            'customIconClass',
            'datepickerMode',
            'formatDay',
            'formatDayHeader',
            'formatDayTitle',
            'formatMonth',
            'formatMonthTitle',
            'formatYear',
            'initDate',
            'maxDate',
            'maxMode',
            'minDate',
            'minMode',
            'showWeeks',
            'shortcutPropagation',
            'startingDay',
            'yearColumns',
            'yearRows'
          ], function (key) {
              switch (key) {
                  case 'enableWebWorkers':
                  case 'expandedMode':
                  case 'webWorkerAngularPath':
                  case 'webWorkerUnderscorePath':
                      self[key] = richCCShared[key] = $scope[key] = angular.isDefined($scope.datepickerOptions[key]) ? $scope.datepickerOptions[key] : datepickerConfig[key];
                      if ($scope.datepickerOptions[key]) {
                          $scope.$watch(function () {
                              return $scope.datepickerOptions[key];
                          }, function (value) {
                              self[key] = $scope[key] = angular.isDefined(value) ? value : datepickerOptions[key];
                              self.refreshView();
                          });
                      }
                      break;
                  case 'yearMapHeat':
                      self[key] = $scope[key] = false;
                      break;
                  case 'light':
                  case 'preventModeToggle':
                  case 'preventCalNav':
                  case 'hideCalNav':
                  case 'showMarkerForMoreEvents':
                  case 'showDataLabel':
                  case 'defaultDataLabel':
                  case 'monthPopUpTmpl':
                  case 'dayPopUpTmpl':
                      self[key] = $scope[key] = angular.isDefined($scope.datepickerOptions[key]) ? $scope.datepickerOptions[key] : datepickerConfig[key];
                      if ($scope.datepickerOptions[key]) {
                          $scope.$watch(function () {
                              return $scope.datepickerOptions[key];
                          }, function (value) {
                              self[key] = $scope[key] = angular.isDefined(value) ? value : datepickerOptions[key];
                              self.refreshView();
                          });
                      }
                      break;
                  case 'customIconClass':
                  case 'customClass':
                      self[key] = $scope[key] = $scope.datepickerOptions[key] || angular.noop;
                      break;
                  case 'datepickerMode':
                      self[key] = $scope[key] = angular.isDefined($scope.datepickerOptions.datepickerMode) ? $scope.datepickerOptions.datepickerMode : datepickerConfig.datepickerMode;
                      break;
                  case 'formatDay':
                  case 'formatDayHeader':
                  case 'formatDayTitle':
                  case 'formatMonth':
                  case 'formatMonthTitle':
                  case 'formatYear':
                      self[key] = angular.isDefined($scope.datepickerOptions[key]) ? $interpolate($scope.datepickerOptions[key])($scope.$parent) : datepickerConfig[key];
                      break;
                  case 'showWeeks':
                  case 'shortcutPropagation':
                  case 'yearColumns':
                  case 'yearRows':
                      self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
                        $scope.datepickerOptions[key] : datepickerConfig[key];
                      break;
                  case 'startingDay':
                      if (angular.isDefined($scope.datepickerOptions.startingDay)) {
                          self.startingDay = $scope.datepickerOptions.startingDay;
                      } else if (angular.isNumber(datepickerConfig.startingDay)) {
                          self.startingDay = datepickerConfig.startingDay;
                      } else {
                          self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
                      }

                      break;
                  case 'maxDate':
                  case 'minDate':
                      if ($scope.datepickerOptions[key]) {
                          $scope.$watch(function () {
                              return $scope.datepickerOptions[key];
                          }, function (value) {
                              if (value) {
                                  if (angular.isDate(value)) {
                                      self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
                                  } else {
                                      self[key] = new Date(dateFilter(value, 'medium'));
                                  }
                              } else {
                                  self[key] = null;
                              }

                              self.refreshView();
                          });
                      } else {
                          self[key] = datepickerConfig[key] ? dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.timezone) : null;
                      }

                      break;
                  case 'maxMode':
                  case 'minMode':
                      if ($scope.datepickerOptions[key]) {
                          $scope.$watch(function () {
                              return $scope.datepickerOptions[key];
                          }, function (value) {
                              self[key] = $scope[key] = angular.isDefined(value) ? value : datepickerOptions[key];
                              if (key === 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key]) ||
                                key === 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key])) {
                                  $scope.datepickerMode = self[key];
                              }
                          });
                      } else {
                          self[key] = $scope[key] = datepickerConfig[key] || null;
                      }

                      break;
                  case 'initDate':
                      if ($scope.datepickerOptions.initDate) {
                          this.activeDate = dateParser.fromTimezone($scope.datepickerOptions.initDate, ngModelOptions.timezone) || new Date();
                          $scope.$watch(function () {
                              return $scope.datepickerOptions.initDate;
                          }, function (initDate) {
                              if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
                                  self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.timezone);
                                  self.refreshView();
                              }
                          });
                      } else {
                          this.activeDate = new Date();
                      }
              }
          });

      }
      else {
          // Interpolated configuration attributes
          angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle'], function (key) {
              self[key] = angular.isDefined($attrs[key]) ? $interpolate($attrs[key])($scope.$parent) : datepickerConfig[key];
          });

          // Evaled configuration attributes
          angular.forEach(['showWeeks', 'yearRows', 'yearColumns', 'shortcutPropagation'], function (key) {
              self[key] = angular.isDefined($attrs[key]) ?
                $scope.$parent.$eval($attrs[key]) : datepickerConfig[key];
          });

          if (angular.isDefined($attrs.startingDay)) {
              self.startingDay = $scope.$parent.$eval($attrs.startingDay);
          } else if (angular.isNumber(datepickerConfig.startingDay)) {
              self.startingDay = datepickerConfig.startingDay;
          } else {
              self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
          }

          // Watchable date attributes
          angular.forEach(['minDate', 'maxDate'], function (key) {
              if ($attrs[key]) {
                  watchListeners.push($scope.$parent.$watch($attrs[key], function (value) {
                      if (value) {
                          if (angular.isDate(value)) {
                              self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
                          } else {
                              self[key] = new Date(dateFilter(value, 'medium'));
                          }
                      } else {
                          self[key] = null;
                      }

                      self.refreshView();
                  }));
              } else {
                  self[key] = datepickerConfig[key] ? dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.timezone) : null;
              }
          });

          angular.forEach(['minMode', 'maxMode'], function (key) {
              if ($attrs[key]) {
                  watchListeners.push($scope.$parent.$watch($attrs[key], function (value) {
                      self[key] = $scope[key] = angular.isDefined(value) ? value : $attrs[key];
                      if (key === 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key]) ||
                        key === 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key])) {
                          $scope.datepickerMode = self[key];
                      }
                  }));
              } else {
                  self[key] = $scope[key] = datepickerConfig[key] || null;
              }
          });

          if ($attrs['light']) {
              watchListeners.push($scope.$parent.$watch($attrs['light'], function (value) {
                  self['light'] = $scope['light'] = angular.isDefined(value) ? value : $attrs['light'];
                  self.refreshView();
              }));
          }

          if ($attrs['yearMapHeat']) {
              watchListeners.push($scope.$parent.$watch($attrs['yearMapHeat'], function (value) {
                  self['yearMapHeat'] = $scope['yearMapHeat'] = angular.isDefined(value) ? value : $attrs['yearMapHeat'];
                  self.refreshView();
              }));
          }

          if ($attrs['enableWebWorkers']) {
              watchListeners.push($scope.$parent.$watch($attrs['enableWebWorkers'], function (value) {
                  self['enableWebWorkers'] = $scope['enableWebWorkers'] = angular.isDefined(value) ? value : $attrs['enableWebWorkers'];
                  self.refreshView();
              }));
          }

          if ($attrs['expandedMode']) {
              watchListeners.push($scope.$parent.$watch($attrs['expandedMode'], function (value) {
                  self['expandedMode'] = $scope['expandedMode'] = angular.isDefined(value) ? value : $attrs['expandedMode'];
                  self.refreshView();
              }));
          }

          if ($attrs['preventCalNav']) {
              watchListeners.push($scope.$parent.$watch($attrs['preventCalNav'], function (value) {
                  self['preventCalNav'] = $scope['preventCalNav'] = angular.isDefined(value) ? value : $attrs['preventCalNav'];
                  self.refreshView();
              }));
          }

          if ($attrs['preventModeToggle']) {
              watchListeners.push($scope.$parent.$watch($attrs['preventModeToggle'], function (value) {
                  self['preventModeToggle'] = $scope['preventModeToggle'] = angular.isDefined(value) ? value : $attrs['preventModeToggle'];
                  self.refreshView();
              }));
          }

          if (angular.isDefined($attrs.initDate)) {
              this.activeDate = dateParser.fromTimezone($scope.$parent.$eval($attrs.initDate), ngModelOptions.timezone) || new Date();
              watchListeners.push($scope.$parent.$watch($attrs.initDate, function (initDate) {
                  if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
                      self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.timezone);
                      self.refreshView();
                  }
              }));
          } else {
              this.activeDate = new Date();
          }
      }

      //Events Variable Watch Added
      if ($attrs['events']) {
          watchListeners.push($scope.$parent.$watch($attrs['events'], function (value) {
              self['_events'] = $scope['events'] = angular.isDefined(value) ? value : $attrs['events'];
              $scope['monthViewData'] = {
              };
              $scope['monthWiseEventDetails'] = {
              };
              $scope['monthWiseEventMarkers'] = {
              };
              self.refreshView();
          }));
      }

      //Events Variable Watch Added
      if ($attrs['dayLabels']) {
          watchListeners.push($scope.$parent.$watch($attrs['dayLabels'], function (value) {
              self['_dayLabels'] = $scope['dayLabels'] = angular.isDefined(value) ? value : $attrs['dayLabels'];
              self.refreshView();
          }));
      }

      if ($attrs['eventPopupHide']) {
          watchListeners.push($scope.$parent.$watch($attrs['eventPopupHide'], function (value) {
              self['eventPopupHide'] = $scope['eventPopupHide'] = angular.isDefined(value) ? value : $attrs['eventPopupHide'];
              self.refreshView();
          }));
      }

      $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
      $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

      $scope.disabled = angular.isDefined($attrs.disabled) || false;
      if (angular.isDefined($attrs.ngDisabled)) {
          watchListeners.push($scope.$parent.$watch($attrs.ngDisabled, function (disabled) {
              $scope.disabled = disabled;
              self.refreshView();
          }));
      }

      $scope.isActive = function (dateObject) {
          if (self.compare(dateObject.date, self.activeDate) === 0) {
              $scope.activeDateId = dateObject.uid;
              return true;
          }
          return false;
      };

      this.init = function (ngModelCtrl_) {
          ngModelCtrl = ngModelCtrl_;
          ngModelOptions = ngModelCtrl_.$options || datepickerConfig.ngModelOptions;

          if (ngModelCtrl.$modelValue) {
              this.activeDate = ngModelCtrl.$modelValue;
          }

          ngModelCtrl.$render = function () {
              self.render();
          };
      };

      this.render = function () {
          if (ngModelCtrl.$viewValue) {
              var date = new Date(ngModelCtrl.$viewValue),
                  isValid = !isNaN(date);

              if (isValid) {
                  this.activeDate = dateParser.fromTimezone(date, ngModelOptions.timezone);
              } else if (!$datepickerSuppressError) {
                  $log.error('Datepicker directive: "ng-model" value must be a Date object');
              }
          }
          this.refreshView();
      };

      this.refreshView = function () {
          if (this.element) {
              $scope.selectedDt = null;
              this._refreshView();
              if ($scope.activeDt) {
                  $scope.activeDateId = $scope.activeDt.uid;
              }

              var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
              date = dateParser.fromTimezone(date, ngModelOptions.timezone);
              ngModelCtrl.$setValidity('dateDisabled', !date ||
                this.element && !this.isDisabled(date));
              if ($scope.datepickerMode == 'month') {
                  $scope.$broadcast('refreshMonth', $scope.activeDt);
              }
          }
      };

      this.createDateObject = function (date, format) {
          var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
          model = dateParser.fromTimezone(model, ngModelOptions.timezone);
          var dt = {
              date: date,
              label: dateFilter(date, format.replace(/d!/, 'dd')).replace(/M!/, 'MM'),
              selected: model && this.compare(date, model) === 0,
              disabled: this.isDisabled(date),
              current: this.compare(date, new Date()) === 0,
              customClass: this.customClass(date) || null,
              customIconClass: this.customIconClass(date) || null
          };

          if (model && this.compare(date, model) === 0) {
              $scope.selectedDt = dt;
          }

          if (self.activeDate && this.compare(dt.date, self.activeDate) === 0) {
              $scope.activeDt = dt;
          }

          return dt;
      };

      this.isDisabled = function (date) {
          return $scope.disabled ||
            this.minDate && this.compare(date, this.minDate) < 0 ||
            this.maxDate && this.compare(date, this.maxDate) > 0 ||
            $attrs.dateDisabled && $scope.dateDisabled({
                date: date, mode: $scope.datepickerMode
            });
      };

      this.customClass = function (date) {
          return $scope.customClass({
              date: date, mode: $scope.datepickerMode
          });
      };

      this.customIconClass = function (date) {
          return $scope.customIconClass({
              date: date, mode: $scope.datepickerMode
          });
      };

      // Split array into smaller arrays
      this.split = function (arr, size) {
          var arrays = [];
          while (arr.length > 0) {
              arrays.push(arr.splice(0, size));
          }
          return arrays;
      };

      $scope.select = function (date) {
          if ($scope.datepickerMode === self.minMode) {
              var dt = ngModelCtrl.$viewValue ? dateParser.fromTimezone(new Date(ngModelCtrl.$viewValue), ngModelOptions.timezone) : new Date(0, 0, 0, 0, 0, 0, 0);
              dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
              dt = dateParser.toTimezone(dt, ngModelOptions.timezone);
              ngModelCtrl.$setViewValue(dt);
              ngModelCtrl.$render();
          } else {
              self.activeDate = date;
              $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
          }
      };

      $scope.move = function (direction) {
          var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
              month = self.activeDate.getMonth() + direction * (self.step.months || 0);
          self.activeDate.setFullYear(year, month, 1);
          self.refreshView();
          var _retData = {
              'datepickerMode': $scope.datepickerMode,
              'activeDate': self.activeDate
          };
          if (typeof $scope.datepickerOptions.moveModeCallback === "function") {
              $scope.datepickerOptions.moveModeCallback(_retData);
          }

      };

      $scope.toggleMode = function (direction) {

          var _retData = {
              'datepickerMode': $scope.datepickerMode,
              'activeDate': self.activeDate
          };

          if (typeof $scope.datepickerOptions.toggleModeCallBack === "function") {
              $scope.datepickerOptions.toggleModeCallBack(_retData);
          }

          if (this.light || this.preventModeToggle)
              return;

          direction = direction || 1;

          if ($scope.datepickerMode === self.maxMode && direction === 1 ||
            $scope.datepickerMode === self.minMode && direction === -1) {
              return;
          }

          $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
      };

      // Key event mapper
      $scope.keys = {
          13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down'
      };

      var focusElement = function () {
          self.element[0].focus();
      };

      // Listen for focus requests from popup directive
      $scope.$on('uib:datepicker.focus', focusElement);

      $scope.keydown = function (evt) {
          var key = $scope.keys[evt.which];

          if (!key || evt.shiftKey || evt.altKey || $scope.disabled) {
              return;
          }

          evt.preventDefault();
          if (!self.shortcutPropagation) {
              evt.stopPropagation();
          }

          if (key === 'enter' || key === 'space') {
              if (self.isDisabled(self.activeDate)) {
                  return; // do nothing
              }
              $scope.select(self.activeDate);
          } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
              $scope.toggleMode(key === 'up' ? 1 : -1);
          } else {
              self.handleKeyDown(key, evt);
              self.refreshView();
          }
      };

      $scope.$on("$destroy", function () {
          //Clear all watch listeners on destroy
          while (watchListeners.length) {
              watchListeners.shift()();
          }
      });
  }])

.controller('RichccDaypickerController', ['$scope', '$element', 'dateFilter', 'WorkerService', 'richCCShared', function (scope, $element, dateFilter, WorkerService, richCCShared) {
    //.controller('RichccDaypickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
    var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var _enableWebWorkers = scope.enableWebWorkers || scope.$parent.enableWebWorkers || richCCShared.enableWebWorkers;
    var workerPromise;
    if (_enableWebWorkers) {
        WorkerService.setAngularUrl(richCCShared.webWorkerAngularPath);
        workerPromise = WorkerService.createAngularWorker(['input', 'output' /*additional optional deps*/,
          function (input, output) {
              (function () { function n(n) { function t(t, r, e, u, i, o) { for (; i >= 0 && o > i; i += n) { var a = u ? u[i] : i; e = r(e, t[a], a, t) } return e } return function (r, e, u, i) { e = b(e, i, 4); var o = !k(r) && m.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1; return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a) } } function t(n) { return function (t, r, e) { r = x(r, e); for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n) if (r(t[i], i, t)) return i; return -1 } } function r(n, t, r) { return function (e, u, i) { var o = 0, a = O(e); if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1; else if (r && i && a) return i = r(e, u), e[i] === u ? i : -1; if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1; for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n) if (e[i] === u) return i; return -1 } } function e(n, t) { var r = I.length, e = n.constructor, u = m.isFunction(e) && e.prototype || a, i = "constructor"; for (m.has(n, i) && !m.contains(t, i) && t.push(i) ; r--;) i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i) } var u = this, i = u._, o = Array.prototype, a = Object.prototype, c = Function.prototype, f = o.push, l = o.slice, s = a.toString, p = a.hasOwnProperty, h = Array.isArray, v = Object.keys, g = c.bind, y = Object.create, d = function () { }, m = function (n) { return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), exports._ = m) : u._ = m, m.VERSION = "1.8.3"; var b = function (n, t, r) { if (t === void 0) return n; switch (null == r ? 3 : r) { case 1: return function (r) { return n.call(t, r) }; case 2: return function (r, e) { return n.call(t, r, e) }; case 3: return function (r, e, u) { return n.call(t, r, e, u) }; case 4: return function (r, e, u, i) { return n.call(t, r, e, u, i) } } return function () { return n.apply(t, arguments) } }, x = function (n, t, r) { return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n) }; m.iteratee = function (n, t) { return x(n, t, 1 / 0) }; var _ = function (n, t) { return function (r) { var e = arguments.length; if (2 > e || null == r) return r; for (var u = 1; e > u; u++) for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) { var f = o[c]; t && r[f] !== void 0 || (r[f] = i[f]) } return r } }, j = function (n) { if (!m.isObject(n)) return {}; if (y) return y(n); d.prototype = n; var t = new d; return d.prototype = null, t }, w = function (n) { return function (t) { return null == t ? void 0 : t[n] } }, A = Math.pow(2, 53) - 1, O = w("length"), k = function (n) { var t = O(n); return "number" == typeof t && t >= 0 && A >= t }; m.each = m.forEach = function (n, t, r) { t = b(t, r); var e, u; if (k(n)) for (e = 0, u = n.length; u > e; e++) t(n[e], e, n); else { var i = m.keys(n); for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n) } return n }, m.map = m.collect = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) { var a = e ? e[o] : o; i[o] = t(n[a], a, n) } return i }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function (n, t, r) { var e; return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0 }, m.filter = m.select = function (n, t, r) { var e = []; return t = x(t, r), m.each(n, function (n, r, u) { t(n, r, u) && e.push(n) }), e }, m.reject = function (n, t, r) { return m.filter(n, m.negate(x(t)), r) }, m.every = m.all = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (!t(n[o], o, n)) return !1 } return !0 }, m.some = m.any = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (t(n[o], o, n)) return !0 } return !1 }, m.contains = m.includes = m.include = function (n, t, r, e) { return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0 }, m.invoke = function (n, t) { var r = l.call(arguments, 2), e = m.isFunction(t); return m.map(n, function (n) { var u = e ? t : n[t]; return null == u ? u : u.apply(n, r) }) }, m.pluck = function (n, t) { return m.map(n, m.property(t)) }, m.where = function (n, t) { return m.filter(n, m.matcher(t)) }, m.findWhere = function (n, t) { return m.find(n, m.matcher(t)) }, m.max = function (n, t, r) { var e, u, i = -1 / 0, o = -1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u) }); return i }, m.min = function (n, t, r) { var e, u, i = 1 / 0, o = 1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u) }); return i }, m.shuffle = function (n) { for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i]; return u }, m.sample = function (n, t, r) { return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t)) }, m.sortBy = function (n, t, r) { return t = x(t, r), m.pluck(m.map(n, function (n, r, e) { return { value: n, index: r, criteria: t(n, r, e) } }).sort(function (n, t) { var r = n.criteria, e = t.criteria; if (r !== e) { if (r > e || r === void 0) return 1; if (e > r || e === void 0) return -1 } return n.index - t.index }), "value") }; var F = function (n) { return function (t, r, e) { var u = {}; return r = x(r, e), m.each(t, function (e, i) { var o = r(e, i, t); n(u, e, o) }), u } }; m.groupBy = F(function (n, t, r) { m.has(n, r) ? n[r].push(t) : n[r] = [t] }), m.indexBy = F(function (n, t, r) { n[r] = t }), m.countBy = F(function (n, t, r) { m.has(n, r) ? n[r]++ : n[r] = 1 }), m.toArray = function (n) { return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : [] }, m.size = function (n) { return null == n ? 0 : k(n) ? n.length : m.keys(n).length }, m.partition = function (n, t, r) { t = x(t, r); var e = [], u = []; return m.each(n, function (n, r, i) { (t(n, r, i) ? e : u).push(n) }), [e, u] }, m.first = m.head = m.take = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t) }, m.initial = function (n, t, r) { return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t))) }, m.last = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t)) }, m.rest = m.tail = m.drop = function (n, t, r) { return l.call(n, null == t || r ? 1 : t) }, m.compact = function (n) { return m.filter(n, m.identity) }; var S = function (n, t, r, e) { for (var u = [], i = 0, o = e || 0, a = O(n) ; a > o; o++) { var c = n[o]; if (k(c) && (m.isArray(c) || m.isArguments(c))) { t || (c = S(c, t, r)); var f = 0, l = c.length; for (u.length += l; l > f;) u[i++] = c[f++] } else r || (u[i++] = c) } return u }; m.flatten = function (n, t) { return S(n, t, !1) }, m.without = function (n) { return m.difference(n, l.call(arguments, 1)) }, m.uniq = m.unique = function (n, t, r, e) { m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e)); for (var u = [], i = [], o = 0, a = O(n) ; a > o; o++) { var c = n[o], f = r ? r(c, o, n) : c; t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c) } return u }, m.union = function () { return m.uniq(S(arguments, !0, !0)) }, m.intersection = function (n) { for (var t = [], r = arguments.length, e = 0, u = O(n) ; u > e; e++) { var i = n[e]; if (!m.contains(t, i)) { for (var o = 1; r > o && m.contains(arguments[o], i) ; o++); o === r && t.push(i) } } return t }, m.difference = function (n) { var t = S(arguments, !0, !0, 1); return m.filter(n, function (n) { return !m.contains(t, n) }) }, m.zip = function () { return m.unzip(arguments) }, m.unzip = function (n) { for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e); return r }, m.object = function (n, t) { for (var r = {}, e = 0, u = O(n) ; u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1]; return r }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function (n, t, r, e) { r = x(r, e, 1); for (var u = r(t), i = 0, o = O(n) ; o > i;) { var a = Math.floor((i + o) / 2); r(n[a]) < u ? i = a + 1 : o = a } return i }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), m.range = function (n, t, r) { null == t && (t = n || 0, n = 0), r = r || 1; for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, n += r) u[i] = n; return u }; var E = function (n, t, r, e, u) { if (!(e instanceof t)) return n.apply(r, u); var i = j(n.prototype), o = n.apply(i, u); return m.isObject(o) ? o : i }; m.bind = function (n, t) { if (g && n.bind === g) return g.apply(n, l.call(arguments, 1)); if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function"); var r = l.call(arguments, 2), e = function () { return E(n, e, t, this, r.concat(l.call(arguments))) }; return e }, m.partial = function (n) { var t = l.call(arguments, 1), r = function () { for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o]; for (; e < arguments.length;) i.push(arguments[e++]); return E(n, r, this, this, i) }; return r }, m.bindAll = function (n) { var t, r, e = arguments.length; if (1 >= e) throw new Error("bindAll must be passed function names"); for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n); return n }, m.memoize = function (n, t) { var r = function (e) { var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e); return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i] }; return r.cache = {}, r }, m.delay = function (n, t) { var r = l.call(arguments, 2); return setTimeout(function () { return n.apply(null, r) }, t) }, m.defer = m.partial(m.delay, m, 1), m.throttle = function (n, t, r) { var e, u, i, o = null, a = 0; r || (r = {}); var c = function () { a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null) }; return function () { var f = m.now(); a || r.leading !== !1 || (a = f); var l = t - (f - a); return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), i } }, m.debounce = function (n, t, r) { var e, u, i, o, a, c = function () { var f = m.now() - o; t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), e || (i = u = null))) }; return function () { i = this, u = arguments, o = m.now(); var f = r && !e; return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a } }, m.wrap = function (n, t) { return m.partial(t, n) }, m.negate = function (n) { return function () { return !n.apply(this, arguments) } }, m.compose = function () { var n = arguments, t = n.length - 1; return function () { for (var r = t, e = n[t].apply(this, arguments) ; r--;) e = n[r].call(this, e); return e } }, m.after = function (n, t) { return function () { return --n < 1 ? t.apply(this, arguments) : void 0 } }, m.before = function (n, t) { var r; return function () { return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r } }, m.once = m.partial(m.before, 2); var M = !{ toString: null }.propertyIsEnumerable("toString"), I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"]; m.keys = function (n) { if (!m.isObject(n)) return []; if (v) return v(n); var t = []; for (var r in n) m.has(n, r) && t.push(r); return M && e(n, t), t }, m.allKeys = function (n) { if (!m.isObject(n)) return []; var t = []; for (var r in n) t.push(r); return M && e(n, t), t }, m.values = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]]; return e }, m.mapObject = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n); return o }, m.pairs = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [t[u], n[t[u]]]; return e }, m.invert = function (n) { for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e]; return t }, m.functions = m.methods = function (n) { var t = []; for (var r in n) m.isFunction(n[r]) && t.push(r); return t.sort() }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++) if (e = u[i], t(n[e], e, n)) return e }, m.pick = function (n, t, r) { var e, u, i = {}, o = n; if (null == o) return i; m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), e = function (n, t, r) { return t in r }, o = Object(o)); for (var a = 0, c = u.length; c > a; a++) { var f = u[a], l = o[f]; e(l, f, o) && (i[f] = l) } return i }, m.omit = function (n, t, r) { if (m.isFunction(t)) t = m.negate(t); else { var e = m.map(S(arguments, !1, !1, 1), String); t = function (n, t) { return !m.contains(e, t) } } return m.pick(n, t, r) }, m.defaults = _(m.allKeys, !0), m.create = function (n, t) { var r = j(n); return t && m.extendOwn(r, t), r }, m.clone = function (n) { return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n }, m.tap = function (n, t) { return t(n), n }, m.isMatch = function (n, t) { var r = m.keys(t), e = r.length; if (null == n) return !e; for (var u = Object(n), i = 0; e > i; i++) { var o = r[i]; if (t[o] !== u[o] || !(o in u)) return !1 } return !0 }; var N = function (n, t, r, e) { if (n === t) return 0 !== n || 1 / n === 1 / t; if (null == n || null == t) return n === t; n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped); var u = s.call(n); if (u !== s.call(t)) return !1; switch (u) { case "[object RegExp]": case "[object String]": return "" + n == "" + t; case "[object Number]": return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t; case "[object Date]": case "[object Boolean]": return +n === +t } var i = "[object Array]" === u; if (!i) { if ("object" != typeof n || "object" != typeof t) return !1; var o = n.constructor, a = t.constructor; if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1 } r = r || [], e = e || []; for (var c = r.length; c--;) if (r[c] === n) return e[c] === t; if (r.push(n), e.push(t), i) { if (c = n.length, c !== t.length) return !1; for (; c--;) if (!N(n[c], t[c], r, e)) return !1 } else { var f, l = m.keys(n); if (c = l.length, m.keys(t).length !== c) return !1; for (; c--;) if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1 } return r.pop(), e.pop(), !0 }; m.isEqual = function (n, t) { return N(n, t) }, m.isEmpty = function (n) { return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length }, m.isElement = function (n) { return !(!n || 1 !== n.nodeType) }, m.isArray = h || function (n) { return "[object Array]" === s.call(n) }, m.isObject = function (n) { var t = typeof n; return "function" === t || "object" === t && !!n }, m.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (n) { m["is" + n] = function (t) { return s.call(t) === "[object " + n + "]" } }), m.isArguments(arguments) || (m.isArguments = function (n) { return m.has(n, "callee") }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function (n) { return "function" == typeof n || !1 }), m.isFinite = function (n) { return isFinite(n) && !isNaN(parseFloat(n)) }, m.isNaN = function (n) { return m.isNumber(n) && n !== +n }, m.isBoolean = function (n) { return n === !0 || n === !1 || "[object Boolean]" === s.call(n) }, m.isNull = function (n) { return null === n }, m.isUndefined = function (n) { return n === void 0 }, m.has = function (n, t) { return null != n && p.call(n, t) }, m.noConflict = function () { return u._ = i, this }, m.identity = function (n) { return n }, m.constant = function (n) { return function () { return n } }, m.noop = function () { }, m.property = w, m.propertyOf = function (n) { return null == n ? function () { } : function (t) { return n[t] } }, m.matcher = m.matches = function (n) { return n = m.extendOwn({}, n), function (t) { return m.isMatch(t, n) } }, m.times = function (n, t, r) { var e = Array(Math.max(0, n)); t = b(t, r, 1); for (var u = 0; n > u; u++) e[u] = t(u); return e }, m.random = function (n, t) { return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1)) }, m.now = Date.now || function () { return (new Date).getTime() }; var B = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }, T = m.invert(B), R = function (n) { var t = function (t) { return n[t] }, r = "(?:" + m.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g"); return function (n) { return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n } }; m.escape = R(B), m.unescape = R(T), m.result = function (n, t, r) { var e = null == n ? void 0 : n[t]; return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e }; var q = 0; m.uniqueId = function (n) { var t = ++q + ""; return n ? n + t : t }, m.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var K = /(.)^/, z = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\u2028": "u2028", "\u2029": "u2029" }, D = /\\|'|\r|\n|\u2028|\u2029/g, L = function (n) { return "\\" + z[n] }; m.template = function (n, t, r) { !t && r && (t = r), t = m.defaults({}, t, m.templateSettings); var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g"), u = 0, i = "__p+='"; n.replace(e, function (t, r, e, o, a) { return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), t }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n"; try { var o = new Function(t.variable || "obj", "_", i) } catch (a) { throw a.source = i, a } var c = function (n) { return o.call(this, n, m) }, f = t.variable || "obj"; return c.source = "function(" + f + "){\n" + i + "}", c }, m.chain = function (n) { var t = m(n); return t._chain = !0, t }; var P = function (n, t) { return n._chain ? m(t).chain() : t }; m.mixin = function (n) { m.each(m.functions(n), function (t) { var r = m[t] = n[t]; m.prototype[t] = function () { var n = [this._wrapped]; return f.apply(n, arguments), P(this, r.apply(m, n)) } }) }, m.mixin(m), m.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) { var t = o[n]; m.prototype[n] = function () { var r = this._wrapped; return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], P(this, r) } }), m.each(["concat", "join", "slice"], function (n) { var t = o[n]; m.prototype[n] = function () { return P(this, t.apply(this._wrapped, arguments)) } }), m.prototype.value = function () { return this._wrapped }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function () { return "" + this._wrapped }, "function" == typeof define && define.amd && define("underscore", [], function () { return m }) }).call(this);
              function dtCompare(dta, dtb) {
                  if (dta < dtb)
                      return -1;
                  else if (dta == dtb)
                      return 0;
                  else if (dta > dtb)
                      return 1;
              }
              function getDaysBetweenDates(dt1, dt2) {
                  var _days = [];
                  var _timeDiff = Math.abs((new Date(dt1)).getTime() - (new Date(dt2)).getTime());
                  var _diffDays = Math.ceil(_timeDiff / (1000 * 3600 * 24)) + 1;
                  _.each(_.range(_diffDays), function (i) {
                      var _day = new Date(dt1);
                      _day = _day.setDate(_day.getDate() + i);
                      _days.push(new Date(_day));
                  });
                  return _days;
              }

              function isSameDay(d1, d2) {
                  d1.setHours(0, 0, 0, 0);
                  d2.setHours(0, 0, 0, 0);
                  return d1.getTime() === d2.getTime();

              }

              function getOrder(days) {
                  var _proceed = true;
                  var i = 1;
                  while (_proceed) {
                      var _found = _.find(days, function (day) {
                          return day.order == i;
                      });
                      if (typeof _found === 'undefined') {
                          _proceed = false;
                      }
                      else
                          i = i + 1;
                  }
                  return i;
              }

              function _dayInCurrentRows(_day, rows) {
                  var result = false;
                  if (rows.length > 0) {
                      var _totalNumberOfRows = rows.length;
                      if (rows[0].length > 0) {
                          var _totalNumberOfColumns = rows[_totalNumberOfRows - 1].length;
                          rows[0][0].date = new Date(rows[0][0].date);
                          rows[_totalNumberOfRows - 1][_totalNumberOfColumns - 1].date = new Date(rows[_totalNumberOfRows - 1][_totalNumberOfColumns - 1].date);
                          _day = new Date(_day);
                          if (_day >= rows[0][0].date && _day <= rows[_totalNumberOfRows - 1][_totalNumberOfColumns - 1].date)
                              result = true;
                      }
                  }
                  return result;
              }

              function _dayInCurrentMonth(_day, _rows) {
                  var result = false;
                  if (_rows.length > 0) {
                      var _totalNumberOfRows = _rows.length
                      if (_rows[0].length > 0) {
                          var _midDate = _rows[2][3];
                          _midDate.date = new Date(_midDate.date);
                          var _nt = new Date(_midDate.date.getFullYear(), _midDate.date.getMonth(), 1);
                          var _firstDay = _nt.setHours(0, 0, 0, 0);
                          var _et = new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0);
                          var _lastDay = _et.setHours(0, 0, 0, 0);
                          if (_day >= _firstDay && _day <= _lastDay)
                              result = true;
                      }
                  }
                  return result;
              }

              function _getDayListExistingInCurrentMOnth(_days, _rows) {
                  var _daysCurrent = [];
                  if (_rows.length > 0) {
                      //new Date(2008, month + 1, 0);
                      var _totalNumberOfRows = _rows.length;
                      if (_rows[0].length > 0) {
                          var _midDate = _rows[2][3];
                          var _lastday = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0)).setHours(0, 0, 0, 0);
                          _daysCurrent = _.filter(_days, function (_day) {
                              var _totalNumberOfColumns = _rows[_totalNumberOfRows - 1].length;
                              _day = new Date(_day);
                              _rows[0][0].date = new Date(_rows[0][0].date);
                              return (_day >= _rows[0][0].date && _day <= _lastday);
                          });
                      }
                  }
                  return _daysCurrent;
              }

              function _getDayListBasedOnEvent(_days, _pday, _stday) {
                  var diff = getDaysBetweenDates(_stday, _pday);
                  var _stDays = _.filter(_days, function (_d) {
                      return _d >= _pday
                  });
                  return _stDays.length;
              }

              function dayIsWeekFirst(_day, _weekFirsts) {
                  var _found = _.find(_weekFirsts, function (d) {
                      return d.date.getDate() == _day.getDate() && d.date.getMonth() == _day.getMonth() && d.date.getFullYear() == _day.getFullYear();
                  });
                  if (typeof _found === 'undefined')
                      return false;
                  else
                      return true;
              }

              function processEvents(events, rows) {
                  var _weekFirsts = _.map(rows, function (row) {
                      var _first = row[0]; _first.date = new Date(_first.date); _first._date = _first.date.setHours(0, 0, 0, 0); return _first
                  });
                  var _events = _.map(events, function (e) {
                      e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e;
                  });
                  var _sortedEvents = _events.sort(function (a, b) {
                      if (a._startDt == b._startDt) {
                          return dtCompare(a._endDt, b._endDt);
                      }
                      else
                          return dtCompare(a._startDt, b._startDt);
                  });
                  var _dayEventDetails = {
                  };
                  var _step = 1;
                  _.each(_sortedEvents, function (_event) {
                      var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
                      var _eventDetail = {
                      };
                      angular.extend(_eventDetail, _event);
                      _eventDetail.order = null;
                      _eventDetail.first = null;
                      _.each(_days, function (_day, _iter) {
                          var _proceedFurther = _dayInCurrentRows(_day, rows);
                          if (_proceedFurther == true) {
                              var key = _day.getFullYear() + '_' + _day.getMonth() + '_' + _day.getDate();
                              if (typeof _dayEventDetails[key] === 'undefined' || _dayEventDetails[key] == null)
                                  _dayEventDetails[key] = [];
                              var _oldOrder = _eventDetail.order;
                              if (_iter == 0) {
                                  _eventDetail.order = getOrder(_dayEventDetails[key]);
                              }
                              if (dayIsWeekFirst(_day, _weekFirsts) == true) {
                                  _eventDetail.order = getOrder(_dayEventDetails[key]);
                              }
                              var _newOrder = _eventDetail.order;
                              if (_oldOrder != _newOrder && _newOrder <= 2)
                                  _eventDetail.startPaint = _eventDetail.startPaintForMonth = true;
                              else
                                  _eventDetail.startPaint = _eventDetail.startPaintForMonth = false;
                              if (dayIsWeekFirst(_day, _weekFirsts) == true && _newOrder <= 2)
                                  _eventDetail.startPaint = true;
                              _eventDetail.paintBoxLength = Math.min(7 - _day.getDay(), _days.length - _iter);
                              _eventDetail.paintBoxLengthForMonth = _days.length;
                              if (_eventDetail.startPaint == true) {
                                  _eventDetail.step = _step;
                                  _step = _step + 1;
                              }
                              var _newEventDetail = _.clone(_eventDetail);
                              _dayEventDetails[key].push(_newEventDetail);
                          }
                      });
                  });
                  return _dayEventDetails;
              }

              function processEventsForMonthEventViewer(events, rows) {
                  var _events = _.map(events, function (e) {
                      e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e;
                  });
                  var _sortedEvents = _events.sort(function (a, b) {
                      if (a._startDt == b._startDt) {
                          return dtCompare(a._endDt, b._endDt);
                      }
                      else
                          return dtCompare(a._startDt, b._startDt);
                  });
                  var _dayEventDetails = {
                  };
                  var _monthEventDetails = {
                  };
                  var _step = 1;
                  _.each(_sortedEvents, function (_event) {
                      var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
                      var _eventDetail = {
                      };
                      angular.extend(_eventDetail, _event);
                      _eventDetail.order = null;
                      _eventDetail.first = null;
                      _.each(_days, function (_day, _iter) {
                          var _proceedFurther = _dayInCurrentMonth(_day, rows);
                          if (_proceedFurther == true) {
                              var key = _day.getFullYear() + '_' + _day.getMonth() + '_' + _day.getDate();
                              if (typeof _dayEventDetails[key] === 'undefined' || _dayEventDetails[key] == null)
                                  _dayEventDetails[key] = [];
                              var _evKey = _eventDetail.id + '_' + _day.getMonth();
                              if (_monthEventDetails[_evKey] != true) {
                                  var _oldOrder = _eventDetail.order;
                                  _eventDetail.order = getOrder(_dayEventDetails[key]);
                                  var _newOrder = _eventDetail.order;
                                  if (_oldOrder != _newOrder && _newOrder <= 2) {
                                      _eventDetail.startPaintForMonth = true;
                                      var _availableDaysToMark = _getDayListExistingInCurrentMOnth(_days, rows);
                                      var _r = _getDayListBasedOnEvent(_availableDaysToMark, _day, new Date(_event._startDt));
                                      _eventDetail.paintBoxLengthForMonth = _r;
                                      _monthEventDetails[_evKey] = true;
                                  }
                                  else {
                                      _eventDetail.startPaintForMonth = false;
                                  }
                              } else {
                                  _eventDetail.startPaintForMonth = false;
                              }
                              var _newEventDetail = _.clone(_eventDetail);
                              _dayEventDetails[key].push(_newEventDetail);
                          }
                      });
                  });
                  return _dayEventDetails;
              }

              var _input = JSON.parse(input);
              var _result;
              if (_input.process == 'month')
                  _result = processEventsForMonthEventViewer(_input.evts, _input.rws);
              else if (_input.process == 'day')
                  _result = processEvents(_input.evts, _input.rws);
              output.resolve(JSON.stringify(_result));
          }]);
    }

    this.step = {
        months: 1
    };
    this.element = $element;
    function getDaysInMonth(year, month) {
        return month === 1 && year % 4 === 0 &&
          (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
    }

    this.init = function (ctrl) {
        angular.extend(ctrl, this);
        scope.showWeeks = ctrl.showWeeks || true;
        ctrl.refreshView();
    };
    var self = this;

    this.initForAllMonthsHeatData = function (ctrl) {
        self._actMonViewDate = scope.monthDate;
        self.activeMonthViewDate = scope.monthDate.date;
        angular.extend(this, ctrl);
        self._refreshMonthView(true);
    }

    this.initForAllMonthsEventsData = function (ctrl) {
        self._actMonViewDate = scope.monthDate;
        self.activeMonthViewDate = scope.monthDate.date;
        angular.extend(this, ctrl);
        self._refreshMonthView(false);
    }

    scope.$on('refreshMonth', function (e, data) {
        scope.monthDate.date.setFullYear(data.date.getFullYear());
        self._actMonViewDate = scope.monthDate;
        self.activeMonthViewDate = scope.monthDate.date;
        self._refreshMonthView(false);
    });

    scope.richccDaySelected = function (dt, events) {
        var data = {
            'dt': dt, 'events': events
        };
        if (typeof scope.daySelectCallback === 'function')
            scope.daySelectCallback({
                'data': data
            });
        else if (typeof scope.$parent.daySelectCallback === 'function')
            scope.$parent.daySelectCallback({
                'data': data
            });
    }

    scope.richccDaySelectedKeyUp = function (e, dt, events) {
        if (e.keyCode == 32 || e.keyCode == 13) {
            scope.richccDaySelected(dt, events);
        }
    }

    scope.popUpTrigger = function (events) {
        try {
            var eventPopupSettings = scope.eventPopupSettings;
            if (typeof eventPopupSettings !== 'undefined' && typeof eventPopupSettings.showWhenEventsEmpty !== 'undefined' && eventPopupSettings.showWhenEventsEmpty != true) {
                if (typeof events === 'undefined' || events == null || events == {
                })
                    return 'none';
                else if (events.length > 0 && eventPopupSettings.hidden != true)
                    return 'outsideClick';
            }
            else if (typeof eventPopupSettings !== 'undefined' && typeof eventPopupSettings.showWhenEventsEmpty !== 'undefined' && eventPopupSettings.showWhenEventsEmpty == true) {
                return 'outsideClick';
            }
            else
                return 'none';
        } catch (e) {
            return 'none';
        }
    }

    scope.popUpTriggerYearView = function (events) {
        try {
            var eventPopupSettings = scope.parent.eventPopupSettings;
            if (typeof eventPopupSettings !== 'undefined' && typeof eventPopupSettings.showWhenEventsEmpty !== 'undefined' && eventPopupSettings.showWhenEventsEmpty != true) {
                if (typeof events === 'undefined' || events == null || events == {
                })
                    return 'none';
                else if (events.length > 0 && eventPopupSettings.hidden != true)
                    return 'outsideClick';
            }
            else if (typeof eventPopupSettings !== 'undefined' && typeof eventPopupSettings.showWhenEventsEmpty !== 'undefined' && eventPopupSettings.showWhenEventsEmpty == true) {
                return 'outsideClick';
            }
            else
                return 'none';
        } catch (e) {
            return 'none';
        }

    }

    scope.popUpLeftHandler = function (dt, events) {
        var data = {
            'dt': dt, 'events': events
        };
        if (typeof scope.eventPopupLeftCallback === 'function')
            scope.eventPopupLeftCallback({
                'data': data
            });
        else if (typeof scope.$parent.eventPopupLeftCallback === 'function')
            scope.$parent.eventPopupLeftCallback({
                'data': data
            });
    }

    scope.popUpRightHandler = function (dt, events) {
        var data = {
            'dt': dt, 'events': events
        };
        if (typeof scope.eventPopupRightCallback === 'function')
            scope.eventPopupRightCallback({
                'data': data
            });
        else if (typeof scope.$parent.eventPopupRightCallback === 'function')
            scope.$parent.eventPopupRightCallback({
                'data': data
            });
    }

    scope.popUpEventClickHandler = function (dt, event) {
        var data = {
            'dt': dt, 'event': event
        };
        if (typeof scope.eventClickCallback === 'function')
            scope.eventClickCallback({
                'data': data
            });
        else if (typeof scope.$parent.eventClickCallback === 'function')
            scope.$parent.eventClickCallback({
                'data': data
            });
    }

    this.getDates = function (startDate, n) {
        var dates = new Array(n), current = new Date(startDate), i = 0, date;
        while (i < n) {
            date = new Date(current);
            dates[i++] = date;
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    this._refreshView = function () {
        scope.eventDetails = {};
        var year = this.activeDate.getFullYear(),
          month = this.activeDate.getMonth(),
          firstDayOfMonth = new Date(this.activeDate);

        firstDayOfMonth.setFullYear(year, month, 1);

        var difference = this.startingDay - firstDayOfMonth.getDay(),
          numDisplayedFromPreviousMonth = difference > 0 ?
            7 - difference : -difference,
          firstDate = new Date(firstDayOfMonth);

        if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
        }

        // 42 is the number of days on a six-week calendar
        var days = this.getDates(firstDate, 42);
        for (var i = 0; i < 42; i++) {
            days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
                secondary: days[i].getMonth() !== month,
                uid: scope.uniqueId + '-' + i,
                key: days[i].getFullYear() + '_' + days[i].getMonth() + '_' + days[i].getDate()
            });
        }

        scope.labels = new Array(7);
        for (var j = 0; j < 7; j++) {
            scope.labels[j] = {
                abbr: dateFilter(days[j].date, this.formatDayHeader),
                full: dateFilter(days[j].date, 'EEEE')
            };
        }

        scope.title = dateFilter(this.activeDate, this.formatDayTitle);
        scope.rows = this.split(days, 7);

        if (scope.showWeeks) {
            scope.weekNumbers = [];
            var thursdayIndex = (4 + 7 - this.startingDay) % 7,
                numWeeks = scope.rows.length;
            for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
                scope.weekNumbers.push(
                  getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
            }
        }

        if (this.showDataLabel == true) {
            scope.dataLabels = this.processLabels(this._dayLabels);
        }

        if (_enableWebWorkers) {
            var _evts = this._events;
            workerPromise.then(function success(angularWorker) {
                var inputObject = {
                    'evts': _evts, 'rws': scope.rows, 'process': 'day'
                };
                return angularWorker.run(JSON.stringify(inputObject));
            }, function error(reason) {
            }).then(function success(result) {
                var _result = JSON.parse(result);
                scope.eventDetails = _result;
            });
        }
        else {
            scope.eventDetails = this.processEvents(this._events, scope.rows);
        }

        scope.light = this.light;
        scope.yearMapHeat = this.yearMapHeat;
        scope.enableWebWorkers = this.enableWebWorkers;
        scope.expandedMode = this.expandedMode;
        scope.eventPopupHide = this.eventPopupHide;
        scope.preventCalNav = this.preventCalNav;
        scope.preventModeToggle = this.preventModeToggle;
        scope.monthPopUpTmpl = this.monthPopUpTmpl;
        scope.dayPopUpTmpl = this.dayPopUpTmpl;

    };

    this.compare = function (date1, date2) {
        var _date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        var _date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        _date1.setFullYear(date1.getFullYear());
        _date2.setFullYear(date2.getFullYear());
        return _date1 - _date2;
    };

    // Split array into smaller arrays
    function _dupSplit(arr, size) {
        var arrays = [];
        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }
        return arrays;
    };

    function getISO8601WeekNumber(date) {
        var checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
        var time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    }

    this.handleKeyDown = function (key, evt) {
        var date = this.activeDate.getDate();

        if (key === 'left') {
            date = date - 1;
        } else if (key === 'up') {
            date = date - 7;
        } else if (key === 'right') {
            date = date + 1;
        } else if (key === 'down') {
            date = date + 7;
        } else if (key === 'pageup' || key === 'pagedown') {
            var month = this.activeDate.getMonth() + (key === 'pageup' ? -1 : 1);
            this.activeDate.setMonth(month, 1);
            date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
        } else if (key === 'home') {
            date = 1;
        } else if (key === 'end') {
            date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
        }
        this.activeDate.setDate(date);
    };

    /* EVENTS LOGIC */
    function dtCompare(dta, dtb) {
        if (dta < dtb)
            return -1;
        else if (dta == dtb)
            return 0;
        else if (dta > dtb)
            return 1;
    }

    function getDaysBetweenDates(dt1, dt2) {
        var _days = [];
        var _timeDiff = Math.abs((new Date(dt1)).getTime() - (new Date(dt2)).getTime());
        var _diffDays = Math.ceil(_timeDiff / (1000 * 3600 * 24)) + 1;
        _.each(_.range(_diffDays), function (i) {
            var _day = new Date(dt1);
            _day = _day.setDate(_day.getDate() + i);
            _days.push(new Date(_day));
        });
        return _days;
    }

    function isSameDay(d1, d2) {
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();

    }

    function getOrder(days) {
        var _proceed = true;
        var i = 1;
        while (_proceed) {
            var _found = _.find(days, function (day) {
                return day.order == i;
            });
            if (typeof _found === 'undefined') {
                _proceed = false;
            }
            else
                i = i + 1;
        }
        return i;
    }

    function getNewOrder(days) {
        var _proceed = true;
        var i = 1;        
        if (days.length > 0) {
            days = days.sort(function (a, b) { return a.order - b.order });
            return days[days.length - 1].order + 1;
        }
        else
            return 1;
        return i;
    }

    function dayIsWeekFirst(_day, _weekFirsts) {
        var _found = _.find(_weekFirsts, function (d) {
            return d.date.getDate() == _day.getDate() && d.date.getMonth() == _day.getMonth() && d.date.getFullYear() == _day.getFullYear();
        });
        if (typeof _found === 'undefined')
            return false;
        else
            return true;
    }

    function _dayInCurrentRows(_day, rows) {
        var result = false;
        if (rows.length > 0) {
            var _totalNumberOfRows = rows.length
            if (rows[0].length > 0) {
                var _totalNumberOfColumns = rows[_totalNumberOfRows - 1].length;
                if (_day >= rows[0][0].date && _day <= rows[_totalNumberOfRows - 1][_totalNumberOfColumns - 1].date)
                    result = true;
            }
        }
        return result;
    }

    function _dayInCurrentMonth(_day, _rows) {
        var result = false;
        if (_rows.length > 0) {
            var _totalNumberOfRows = _rows.length;
            if (_rows[0].length > 0) {
                var _midDate = _rows[2][3];
                var _firstDay = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth(), 1)).setHours(0, 0, 0, 0);
                var _lastDay = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0)).setHours(0, 0, 0, 0);
                if (_day >= _firstDay && _day <= _lastDay)
                    result = true;
            }
        }
        return result;
    }

    function _getDayListExistingInCurrentMOnth(_days, _rows) {
        var _daysCurrent = [];
        if (_rows.length > 0) {
            var _totalNumberOfRows = _rows.length;
            if (_rows[0].length > 0) {
                var _midDate = _rows[2][3];
                var _lastday = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0)).setHours(0, 0, 0, 0);
                _daysCurrent = _.filter(_days, function (_day) {
                    var _totalNumberOfColumns = _rows[_totalNumberOfRows - 1].length;
                    return (_day >= _rows[0][0].date && _day <= _lastday && (new Date(_day).getMonth() == new Date(_lastday).getMonth()));
                });
            }
        }
        return _daysCurrent;
    }

    function _getDayListBasedOnEvent(_days, _pday, _stday) {
        var diff = getDaysBetweenDates(_stday, _pday);
        var _stDays = _.filter(_days, function (_d) {
            return _d >= _pday
        });
        return _stDays.length;
    }

    this.processEvents = function (events, rows) {
        var _weekFirsts = _.map(rows, function (row) {
            var _first = row[0]; _first._date = _first.date.setHours(0, 0, 0, 0); return _first
        });
        var _events = _.map(events, function (e) {
            e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e;
        });
        var _sortedEvents = _events.sort(function (a, b) {
            if (a._startDt == b._startDt) {
                return dtCompare(a._endDt, b._endDt);
            }
            else
                return dtCompare(a._startDt, b._startDt);
        });
        var _dayEventDetails = {
        };
        var _step = 1;
        _.each(_sortedEvents, function (_event) {
            var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
            var _eventDetail = {
            };
            angular.extend(_eventDetail, _event);
            _eventDetail.order = null;
            _eventDetail.first = null;
            _.each(_days, function (_day, _iter) {
                var _proceedFurther = _dayInCurrentRows(_day, rows);
                if (_proceedFurther == true) {
                    var key = _day.getFullYear() + '_' + _day.getMonth() + '_' + _day.getDate();
                    if (typeof _dayEventDetails[key] === 'undefined' || _dayEventDetails[key] == null)
                        _dayEventDetails[key] = [];
                    var _oldOrder = _eventDetail.order;                    
                    if (_iter == 0) {                        
                        _eventDetail.order = getNewOrder(_dayEventDetails[key]);
                    }
                    if (dayIsWeekFirst(_day, _weekFirsts) == true) {
                        _eventDetail.order = getNewOrder(_dayEventDetails[key]);
                    }
                    var _newOrder = _eventDetail.order;
                    if (scope.expandedMode != true) {
                        if (_oldOrder != _newOrder && _newOrder <= 2)
                            _eventDetail.startPaint = _eventDetail.startPaintForMonth = true;
                        else
                            _eventDetail.startPaint = _eventDetail.startPaintForMonth = false;
                        if (dayIsWeekFirst(_day, _weekFirsts) == true && _newOrder <= 2)
                            _eventDetail.startPaint = true;
                    }
                    else {
                        if (_oldOrder != _newOrder)
                            _eventDetail.startPaint = _eventDetail.startPaintForMonth = true;
                        else
                            _eventDetail.startPaint = _eventDetail.startPaintForMonth = false;
                        if (dayIsWeekFirst(_day, _weekFirsts) == true)
                            _eventDetail.startPaint = true;
                    }
                    _eventDetail.paintBoxLength = Math.min(7 - _day.getDay(), _days.length - _iter);
                    _eventDetail.paintBoxLengthForMonth = _days.length;
                    if (_eventDetail.startPaint == true) {
                        _eventDetail.step = _step;
                        _step = _step + 1;
                    }                    
                    var _newEventDetail = _.clone(_eventDetail);                    
                    _dayEventDetails[key].push(_newEventDetail);
                }
            });
        });
        return _dayEventDetails;
    }

    this.processEventsForMonthEventViewer = function (events, rows) {
        var _events = _.map(events, function (e) {
            e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e;
        });
        var _sortedEvents = _events.sort(function (a, b) {
            if (a._startDt == b._startDt) {
                return dtCompare(a._endDt, b._endDt);
            }
            else
                return dtCompare(a._startDt, b._startDt);
        });
        var _dayEventDetails = {
        };
        var _monthEventDetails = {
        };
        var _step = 1;
        _.each(_sortedEvents, function (_event) {
            var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
            var _eventDetail = {
            };
            angular.extend(_eventDetail, _event);
            _eventDetail.order = null;
            _eventDetail.first = null;
            _.each(_days, function (_day, _iter) {
                var _proceedFurther = _dayInCurrentMonth(_day, rows);
                if (_proceedFurther == true) {
                    var key = _day.getFullYear() + '_' + _day.getMonth() + '_' + _day.getDate();
                    if (typeof _dayEventDetails[key] === 'undefined' || _dayEventDetails[key] == null)
                        _dayEventDetails[key] = [];
                    var _evKey = _eventDetail.id + '_' + _day.getMonth();
                    if (_monthEventDetails[_evKey] != true) {
                        var _oldOrder = _eventDetail.order;
                        _eventDetail.order = getOrder(_dayEventDetails[key]);
                        var _newOrder = _eventDetail.order;
                        if (_oldOrder != _newOrder && _newOrder <= 2) {
                            _eventDetail.startPaintForMonth = true;
                            var _availableDaysToMark = _getDayListExistingInCurrentMOnth(_days, rows);
                            _eventDetail.paintBoxLengthForMonth = _getDayListBasedOnEvent(_availableDaysToMark, _day, new Date(_event._startDt));
                            _monthEventDetails[_evKey] = true;
                        }
                        else {
                            _eventDetail.startPaintForMonth = false;
                        }
                    } else {
                        _eventDetail.startPaintForMonth = false;
                    }
                    var _newEventDetail = _.clone(_eventDetail);
                    _dayEventDetails[key].push(_newEventDetail);
                }
            });
        });
        return _dayEventDetails;
    }

    this.processLabels = function (labelData) {
        var _modLabels = {
        };
        _.each(labelData, function (item) {
            var _dt = new Date(item.dt);
            var key = _dt.getFullYear() + '_' + _dt.getMonth() + '_' + _dt.getDate();
            _modLabels[key] = item.label;
        });
        return _modLabels;
    }

    scope.viewAllEvents = function (events, e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    scope.getPopUpPositionForDayMap = function (row, column) {
        var position = '';
        position = row <= 2 ? 'bottom' : 'top';
        if (column == 0)
            position = position + '-left';
        else if (column == 6)
            position = position + '-right';
        return position;
    }

    scope.getPopUpPositionForMonthHeatMap = function (monthindex) {
        var position = '';
        switch (monthindex) {
            case 0:
            case 1: position = 'bottom-left'; break;
            case 6:
            case 7: position = 'top-left'; break;
            case 4:
            case 5: position = 'bottom-right'; break;
            case 10:
            case 11: position = 'top-right'; break;
            case 8:
            case 9: position = 'top'; break;
            case 2:
            case 3:
            default: position = 'bottom'; break;
        }
        return position;
    }

    scope.getPopUpPositionForMonthEventMap = function (monthindex, weekindex) {
        var position = '';
        if (monthindex < 6)
            position = 'bottom';
        else
            position = 'top';
        switch (weekindex) {
            case 0:
            case 1: position = position + '-left'; break;
            case 5:
            case 6: position = position + '-right'; break;
            default: position = position; break;
        }
        return position;
    }

    function _dupCreateDateObject(date, format) {
        var dt = {
            date: date,
            label: dateFilter(date, format.replace(/d!/, 'dd')).replace(/M!/, 'MM')
        };
        return dt;
    };

    this._refreshMonthView = function (isHeatMap) {
        this._events = scope.$parent.events;
        if (isHeatMap == true)
            this.activeMonthViewDate.setDate(15);
        var year = this.activeMonthViewDate.getFullYear(),
          month = this.activeMonthViewDate.getMonth(),
          firstDayOfMonth = new Date(this.activeMonthViewDate);

        if (typeof scope.monthWiseEventDetails !== 'undefined')
            scope.monthWiseEventDetails[this.activeMonthViewDate.getMonth()] = {};
        else if (typeof scope.parent.monthWiseEventDetails !== 'undefined')
            scope.parent.monthWiseEventDetails[this.activeMonthViewDate.getMonth()] = {};

        firstDayOfMonth.setFullYear(year, month, 1);

        this.startingDay = 0;

        var difference = this.startingDay - firstDayOfMonth.getDay(),
          numDisplayedFromPreviousMonth = difference > 0 ?
            7 - difference : -difference,
          firstDate = new Date(firstDayOfMonth);

        if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
        }

        // 42 is the number of days on a six-week calendar
        var days = this.getDates(firstDate, 42);
        for (var i = 0; i < 42; i++) {
            days[i] = angular.extend(_dupCreateDateObject(days[i], this.formatDay), {
                secondary: days[i].getMonth() !== month,
                uid: scope.uniqueId + '-' + i,
                key: days[i].getFullYear() + '_' + days[i].getMonth() + '_' + days[i].getDate(),
                monthIndex: days[i].getMonth()
            });
            if (typeof scope.customClass !== 'undefined' && typeof scope.customClass === 'function')
                days[i].customClass = scope.customClass({ date: days[i].date, mode: 'year' }) || null;
            else if (typeof scope.datepickerOptions !== 'undefined' && typeof scope.datepickerOptions.customClass !== 'undefined' && typeof scope.datepickerOptions.customClass === 'function')
                days[i].customClass = scope.datepickerOptions.customClass({ date: days[i].date, mode: 'year' }) || null;
            else if (typeof scope.$parent.datepickerOptions !== 'undefined' && typeof scope.$parent.datepickerOptions.customClass !== 'undefined' && typeof scope.$parent.datepickerOptions.customClass === 'function')
                days[i].customClass = scope.$parent.datepickerOptions.customClass({ date: days[i].date, mode: 'year' }) || null;
        }

        scope.labels = new Array(7);
        this.labels = [];
        for (var j = 0; j < 7; j++) {
            var label = {
                abbr: dateFilter(days[j].date, this.formatDayHeader),
                full: dateFilter(days[j].date, 'EEEE')
            };
            this.labels.push(label);
            scope.labels[j] = label;
        }
        if (typeof scope.monthWiseEventMarkers !== 'undefined')
            scope.monthWiseEventMarkers[this.activeMonthViewDate.getMonth()] = this.labels;
        else if (typeof scope.$parent.monthWiseEventMarkers !== 'undefined')
            scope.$parent.monthWiseEventMarkers[this.activeMonthViewDate.getMonth()] = this.labels;
        scope.title = dateFilter(this.activeMonthViewDate, this.formatDayTitle);
        scope.rows = this.split(days, 7);
        if (typeof scope.monthViewData !== 'undefined')
            scope.monthViewData[this.activeMonthViewDate.getMonth()] = {
                'dt': this._actMonViewDate, 'rows': scope.rows
            };
        else if (typeof scope.$parent.monthViewData !== 'undefined')
            scope.$parent.monthViewData[this.activeMonthViewDate.getMonth()] = {
                'dt': this._actMonViewDate, 'rows': scope.rows
            };
        if (scope.showWeeks) {
            scope.weekNumbers = [];
            var thursdayIndex = (4 + 7 - this.startingDay) % 7,
                numWeeks = scope.rows.length;
            for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
                scope.weekNumbers.push(
                  getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
            }
        }
        var _indexMonth = this.activeMonthViewDate.getMonth();

        if (_enableWebWorkers) {
            var _evts = this._events;
            workerPromise.then(function success(angularWorker) {
                var inputObject = {
                    'evts': _evts, 'rws': scope.rows, 'process': 'month'
                };
                return angularWorker.run(JSON.stringify(inputObject));
            }, function error(reason) {
            }).then(function success(result) {
                var _result = JSON.parse(result);
                if (this.yearMapHeat) {
                    if (typeof scope.monthViewData !== 'undefined')
                        scope.monthWiseEventDetails[_indexMonth] = _result;
                    else if (typeof scope.$parent.monthViewData !== 'undefined')
                        scope.$parent.monthWiseEventDetails[_indexMonth] = _result;
                }
                else {
                    if (typeof scope.monthViewData !== 'undefined')
                        scope.monthWiseEventDetails[_indexMonth] = _result;
                    else if (typeof scope.$parent.monthViewData !== 'undefined')
                        scope.$parent.monthWiseEventDetails[_indexMonth] = _result;
                }
            });
        }
        else {
            if (this.yearMapHeat) {
                if (typeof scope.monthViewData !== 'undefined')
                    scope.monthWiseEventDetails[this.activeMonthViewDate.getMonth()] = this.processEvents(this._events, scope.rows);
                else if (typeof scope.parent.monthViewData !== 'undefined')
                    scope.parent.monthWiseEventDetails[this.activeMonthViewDate.getMonth()] = this.processEvents(this._events, scope.rows);
            }
            else {
                if (typeof scope.monthViewData !== 'undefined')
                    scope.monthWiseEventDetails[this.activeMonthViewDate.getMonth()] = this.processEventsForMonthEventViewer(this._events, scope.rows);
                else if (typeof scope.parent.monthViewData !== 'undefined')
                    scope.parent.monthWiseEventDetails[this.activeMonthViewDate.getMonth()] = this.processEventsForMonthEventViewer(this._events, scope.rows);
            }
        }


        scope.light = this.light;
        scope.yearMapHeat = this.yearMapHeat;
        scope.enableWebWorkers = this.enableWebWorkers;
        scope.expandedMode = this.expandedMode;
        scope.eventPopupHide = this.eventPopupHide;
        scope.preventCalNav = this.preventCalNav;
        scope.preventModeToggle = this.preventModeToggle;
        scope.monthPopUpTmpl = this.monthPopUpTmpl;
        scope.dayPopUpTmpl = this.dayPopUpTmpl;

    };


}])

.controller('RichccMonthpickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
    this.step = {
        years: 1
    };
    this.element = $element;

    this.init = function (ctrl) {
        angular.extend(ctrl, this);
        ctrl.refreshView();
    };

    this._refreshView = function () {
        var months = new Array(12),
            year = this.activeDate.getFullYear(),
            date;

        for (var i = 0; i < 12; i++) {
            date = new Date(this.activeDate);
            date.setFullYear(year, i, 1);
            months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
                uid: scope.uniqueId + '-' + i,
                monthIndex: date.getMonth()
            });
        }

        scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
        var splitInto = scope.yearMapHeat == true ? 6 : 1;
        scope.rows = this.split(months, splitInto);
    };

    this.compare = function (date1, date2) {
        var _date1 = new Date(date1.getFullYear(), date1.getMonth());
        var _date2 = new Date(date2.getFullYear(), date2.getMonth());
        _date1.setFullYear(date1.getFullYear());
        _date2.setFullYear(date2.getFullYear());
        return _date1 - _date2;
    };

    this.handleKeyDown = function (key, evt) {
        var date = this.activeDate.getMonth();

        if (key === 'left') {
            date = date - 1;
        } else if (key === 'up') {
            date = date - 3;
        } else if (key === 'right') {
            date = date + 1;
        } else if (key === 'down') {
            date = date + 3;
        } else if (key === 'pageup' || key === 'pagedown') {
            var year = this.activeDate.getFullYear() + (key === 'pageup' ? -1 : 1);
            this.activeDate.setFullYear(year);
        } else if (key === 'home') {
            date = 0;
        } else if (key === 'end') {
            date = 11;
        }
        this.activeDate.setMonth(date);
    };
}])

.controller('RichccYearpickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
    var columns, range;
    this.element = $element;

    function getStartingYear(year) {
        return parseInt((year - 1) / range, 10) * range + 1;
    }

    this.yearpickerInit = function () {
        columns = this.yearColumns;
        range = this.yearRows * columns;
        this.step = {
            years: range
        };
    };

    this._refreshView = function () {
        var years = new Array(range), date;

        for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()) ; i < range; i++) {
            date = new Date(this.activeDate);
            date.setFullYear(start + i, 0, 1);
            years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
                uid: scope.uniqueId + '-' + i
            });
        }

        scope.title = [years[0].label, years[range - 1].label].join(' - ');
        scope.rows = this.split(years, columns);
        scope.columns = columns;
    };

    this.compare = function (date1, date2) {
        return date1.getFullYear() - date2.getFullYear();
    };

    this.handleKeyDown = function (key, evt) {
        var date = this.activeDate.getFullYear();

        if (key === 'left') {
            date = date - 1;
        } else if (key === 'up') {
            date = date - columns;
        } else if (key === 'right') {
            date = date + 1;
        } else if (key === 'down') {
            date = date + columns;
        } else if (key === 'pageup' || key === 'pagedown') {
            date += (key === 'pageup' ? -1 : 1) * range;
        } else if (key === 'home') {
            date = getStartingYear(this.activeDate.getFullYear());
        } else if (key === 'end') {
            date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
        }
        this.activeDate.setFullYear(date);
    };
}])

.directive('richccDatepicker', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/datepicker.html';
        },
        scope: {
            datepickerMode: '=?',
            datepickerOptions: '=?',
            dateDisabled: '&',
            customClass: '&',
            customIconClass: '&',
            shortcutPropagation: '&?',
            events: '=',
            dayLabels: '=',
            light: '=',  //deprecate
            eventPopupHide: "=",
            preventCalNav: "=", //deprecate
            preventModeToggle: "=", //deprecate
            yearMapHeat: "=", //deprecate
            daySelectCallback: '&',
            eventPopupLeftCallback: '&',
            eventPopupRightCallback: '&',
            eventClickCallback: '&',
            eventPopupSettings: '='
        },
        require: ['richccDatepicker', '^ngModel'],
        controller: 'RichccDatepickerController',
        controllerAs: 'datepicker',
        link: function (scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            datepickerCtrl.init(ngModelCtrl);
        }
    };
})

.directive('richccDaypicker', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/day.html';
        },
        require: ['^richccDatepicker', 'richccDaypicker'],
        controller: 'RichccDaypickerController',
        link: function (scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0],
              daypickerCtrl = ctrls[1];

            daypickerCtrl.init(datepickerCtrl);
        }
    };
})

.directive('richMonthsHeatViewer', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/monthHeatViewer.html';
        },
        transclude: true,
        scope: {
            'monthDate': '=',
            'monthIndex': '=',
            'monthSelectCallback': "&"
        },
        require: ['^richccDatepicker', '^richccMonthpickerHeatmap', 'richMonthsHeatViewer'],
        controller: 'RichccDaypickerController',
        link: function (scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0],
                monthpickerCtrl = ctrls[1],
                daypickerCtrl = ctrls[2];
            daypickerCtrl.initForAllMonthsHeatData(datepickerCtrl);
        }
    };
})

.directive('richMonthsEventViewer', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/monthEventViewer.html';
        },
        transclude: true,
        scope: {
            'monthDate': '=',
            'monthIndex': '=',
            'monthSelectCallback': "&"
        },
        require: ['^richccDatepicker', '^richccMonthpickerEventmap', 'richMonthsEventViewer'],
        controller: 'RichccDaypickerController',
        link: function (scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0],
                monthpickerCtrl = ctrls[1],
                daypickerCtrl = ctrls[2];
            daypickerCtrl.initForAllMonthsEventsData(datepickerCtrl);
        }
    };
})

.directive('richMonthsDayMarker', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/monthViewerDayMarker.html';
        }
    };
})

.directive('richccMonthpickerHeatmap', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/monthHeatWrap.html';
        },
        require: ['^richccDatepicker', 'richccMonthpickerHeatmap'],
        controller: 'RichccMonthpickerController',
        link: function (scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0],
              monthpickerCtrl = ctrls[1];

            monthpickerCtrl.init(datepickerCtrl);
        }
    };
})

.directive('richccMonthpickerEventmap', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/monthEventWrap.html';
        },
        require: ['^richccDatepicker', 'richccMonthpickerEventmap'],
        controller: 'RichccMonthpickerController',
        link: function (scope, element, attrs, ctrls) {
            var datepickerCtrl = ctrls[0],
              monthpickerCtrl = ctrls[1];

            monthpickerCtrl.init(datepickerCtrl);
        }
    };
})

.directive('richccYearpicker', function () {
    return {
        replace: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/year.html';
        },
        require: ['^richccDatepicker', 'richccYearpicker'],
        controller: 'RichccYearpickerController',
        link: function (scope, element, attrs, ctrls) {
            var ctrl = ctrls[0];
            angular.extend(ctrl, ctrls[1]);
            ctrl.yearpickerInit();

            ctrl.refreshView();
        }
    };
})

.constant('richccDatepickerPopupConfig', {
    altInputFormats: [],
    appendToBody: false,
    clearText: 'Clear',
    closeOnDateSelection: true,
    closeText: 'Done',
    currentText: 'Today',
    datepickerPopup: 'yyyy-MM-dd',
    datepickerPopupTemplateUrl: 'template/richcc/popup.html',
    datepickerTemplateUrl: 'template/richcc/datepicker.html',
    html5Types: {
        date: 'yyyy-MM-dd',
        'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
        'month': 'yyyy-MM'
    },
    onOpenFocus: true,
    showButtonBar: true
})

.controller('RichccDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'richccDatepickerPopupConfig', '$timeout', 'richccDatepickerConfig',
function (scope, element, attrs, $compile, $parse, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout, datepickerConfig) {
    var cache = {},
      isHtml5DateInput = false;
    var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
      datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl,
      ngModel, ngModelOptions, $popup, altInputFormats, watchListeners = [];

    scope.watchData = {
    };

    this.init = function (_ngModel_) {
        ngModel = _ngModel_;
        ngModelOptions = _ngModel_.$options || datepickerConfig.ngModelOptions;
        closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection;
        appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;
        onOpenFocus = angular.isDefined(attrs.onOpenFocus) ? scope.$parent.$eval(attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
        datepickerPopupTemplateUrl = angular.isDefined(attrs.datepickerPopupTemplateUrl) ? attrs.datepickerPopupTemplateUrl : datepickerPopupConfig.datepickerPopupTemplateUrl;
        datepickerTemplateUrl = angular.isDefined(attrs.datepickerTemplateUrl) ? attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;
        altInputFormats = angular.isDefined(attrs.altInputFormats) ? scope.$parent.$eval(attrs.altInputFormats) : datepickerPopupConfig.altInputFormats;

        scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

        if (datepickerPopupConfig.html5Types[attrs.type]) {
            dateFormat = datepickerPopupConfig.html5Types[attrs.type];
            isHtml5DateInput = true;
        } else {
            dateFormat = attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
            attrs.$observe('uibDatepickerPopup', function (value, oldValue) {
                var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
                // Invalidate the $modelValue to ensure that formatters re-run
                // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
                if (newDateFormat !== dateFormat) {
                    dateFormat = newDateFormat;
                    ngModel.$modelValue = null;

                    if (!dateFormat) {
                        throw new Error('uibDatepickerPopup must have a date format specified.');
                    }
                }
            });
        }

        if (!dateFormat) {
            throw new Error('uibDatepickerPopup must have a date format specified.');
        }

        if (isHtml5DateInput && attrs.uibDatepickerPopup) {
            throw new Error('HTML5 date input types do not support custom formats.');
        }

        // popup element used to display calendar
        popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');
        scope.ngModelOptions = angular.copy(ngModelOptions);
        scope.ngModelOptions.timezone = null;
        popupEl.attr({
            'ng-model': 'date',
            'ng-model-options': 'ngModelOptions',
            'ng-change': 'dateSelection(date)',
            'template-url': datepickerPopupTemplateUrl
        });

        // datepicker element
        datepickerEl = angular.element(popupEl.children()[0]);
        datepickerEl.attr('template-url', datepickerTemplateUrl);

        if (isHtml5DateInput) {
            if (attrs.type === 'month') {
                datepickerEl.attr('datepicker-mode', '"month"');
                datepickerEl.attr('min-mode', 'month');
            }
        }

        if (scope.datepickerOptions) {
            angular.forEach(scope.datepickerOptions, function (value, option) {
                // Ignore this options, will be managed later
                if (['minDate', 'maxDate', 'minMode', 'maxMode', 'initDate', 'datepickerMode'].indexOf(option) === -1) {
                    datepickerEl.attr(cameltoDash(option), value);
                } else {
                    datepickerEl.attr(cameltoDash(option), 'datepickerOptions.' + option);
                }
            });
        }

        angular.forEach(['minMode', 'maxMode', 'datepickerMode', 'shortcutPropagation'], function (key) {
            if (attrs[key]) {
                var getAttribute = $parse(attrs[key]);
                var propConfig = {
                    get: function () {
                        return getAttribute(scope.$parent);
                    }
                };

                datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

                // Propagate changes from datepicker to outside
                if (key === 'datepickerMode') {
                    var setAttribute = getAttribute.assign;
                    propConfig.set = function (v) {
                        setAttribute(scope.$parent, v);
                    };
                }

                Object.defineProperty(scope.watchData, key, propConfig);
            }
        });

        angular.forEach(['minDate', 'maxDate', 'initDate'], function (key) {
            if (attrs[key]) {
                var getAttribute = $parse(attrs[key]);

                watchListeners.push(scope.$parent.$watch(getAttribute, function (value) {
                    if (key === 'minDate' || key === 'maxDate') {
                        if (value === null) {
                            cache[key] = null;
                        } else if (angular.isDate(value)) {
                            cache[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
                        } else {
                            cache[key] = new Date(dateFilter(value, 'medium'));
                        }

                        scope.watchData[key] = value === null ? null : cache[key];
                    } else {
                        scope.watchData[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
                    }
                }));

                datepickerEl.attr(cameltoDash(key), 'watchData.' + key);
            }
        });

        if (attrs.dateDisabled) {
            datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
        }

        angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle', 'showWeeks', 'startingDay', 'yearRows', 'yearColumns'], function (key) {
            if (angular.isDefined(attrs[key])) {
                datepickerEl.attr(cameltoDash(key), attrs[key]);
            }
        });

        if (attrs.customClass) {
            datepickerEl.attr('custom-class', 'customClass({ date: date, mode: mode })');
        }

        if (attrs.customIconClass) {
            datepickerEl.attr('custom-class', 'customIconClass({ date: date, mode: mode })');
        }

        if (!isHtml5DateInput) {
            // Internal API to maintain the correct ng-invalid-[key] class
            ngModel.$$parserName = 'date';
            ngModel.$validators.date = validator;
            ngModel.$parsers.unshift(parseDate);
            ngModel.$formatters.push(function (value) {
                if (ngModel.$isEmpty(value)) {
                    scope.date = value;
                    return value;
                }
                scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);
                dateFormat = dateFormat.replace(/M!/, 'MM')
                    .replace(/d!/, 'dd');

                return dateFilter(scope.date, dateFormat);
            });
        } else {
            ngModel.$formatters.push(function (value) {
                scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);
                return value;
            });
        }

        // Detect changes in the view from the text box
        ngModel.$viewChangeListeners.push(function () {
            scope.date = parseDateString(ngModel.$viewValue);
        });

        element.on('keydown', inputKeydownBind);

        $popup = $compile(popupEl)(scope);
        // Prevent jQuery cache memory leak (template is now redundant after linking)
        popupEl.remove();

        if (appendToBody) {
            $document.find('body').append($popup);
        } else {
            element.after($popup);
        }

        scope.$on('$destroy', function () {
            if (scope.isOpen === true) {
                if (!$rootScope.$$phase) {
                    scope.$apply(function () {
                        scope.isOpen = false;
                    });
                }
            }

            $popup.remove();
            element.off('keydown', inputKeydownBind);
            $document.off('click', documentClickBind);

            //Clear all watch listeners on destroy
            while (watchListeners.length) {
                watchListeners.shift()();
            }
        });
    };

    scope.getText = function (key) {
        return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
    };

    scope.isDisabled = function (date) {
        if (date === 'today') {
            date = new Date();
        }

        return scope.watchData.minDate && scope.compare(date, cache.minDate) < 0 ||
            scope.watchData.maxDate && scope.compare(date, cache.maxDate) > 0;
    };

    scope.compare = function (date1, date2) {
        return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    };

    // Inner change
    scope.dateSelection = function (dt) {
        if (angular.isDefined(dt)) {
            scope.date = dt;
        }
        var date = scope.date ? dateFilter(scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
        element.val(date);
        ngModel.$setViewValue(date);

        if (closeOnDateSelection) {
            scope.isOpen = false;
            element[0].focus();
        }
    };

    scope.keydown = function (evt) {
        if (evt.which === 27) {
            evt.stopPropagation();
            scope.isOpen = false;
            element[0].focus();
        }
    };

    scope.select = function (date) {
        if (date === 'today') {
            var today = new Date();
            if (angular.isDate(scope.date)) {
                date = new Date(scope.date);
                date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
            } else {
                date = new Date(today.setHours(0, 0, 0, 0));
            }
        }
        scope.dateSelection(date);
    };

    scope.close = function () {
        scope.isOpen = false;
        element[0].focus();
    };

    scope.disabled = angular.isDefined(attrs.disabled) || false;
    if (attrs.ngDisabled) {
        watchListeners.push(scope.$parent.$watch($parse(attrs.ngDisabled), function (disabled) {
            scope.disabled = disabled;
        }));
    }

    scope.$watch('isOpen', function (value) {
        if (value) {
            if (!scope.disabled) {
                scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                scope.position.top = scope.position.top + element.prop('offsetHeight');

                $timeout(function () {
                    if (onOpenFocus) {
                        scope.$broadcast('uib:datepicker.focus');
                    }
                    $document.on('click', documentClickBind);
                }, 0, false);
            } else {
                scope.isOpen = false;
            }
        } else {
            $document.off('click', documentClickBind);
        }
    });

    function cameltoDash(string) {
        return string.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
        });
    }

    function parseDateString(viewValue) {
        var date = dateParser.parse(viewValue, dateFormat, scope.date);
        if (isNaN(date)) {
            for (var i = 0; i < altInputFormats.length; i++) {
                date = dateParser.parse(viewValue, altInputFormats[i], scope.date);
                if (!isNaN(date)) {
                    return date;
                }
            }
        }
        return date;
    }

    function parseDate(viewValue) {
        if (angular.isNumber(viewValue)) {
            // presumably timestamp to date object
            viewValue = new Date(viewValue);
        }

        if (!viewValue) {
            return null;
        }

        if (angular.isDate(viewValue) && !isNaN(viewValue)) {
            return viewValue;
        }

        if (angular.isString(viewValue)) {
            var date = parseDateString(viewValue);
            if (!isNaN(date)) {
                return dateParser.toTimezone(date, ngModelOptions.timezone);
            }
        }

        return ngModel.$options && ngModel.$options.allowInvalid ? viewValue : undefined;
    }

    function validator(modelValue, viewValue) {
        var value = modelValue || viewValue;

        if (!attrs.ngRequired && !value) {
            return true;
        }

        if (angular.isNumber(value)) {
            value = new Date(value);
        }

        if (!value) {
            return true;
        }

        if (angular.isDate(value) && !isNaN(value)) {
            return true;
        }

        if (angular.isString(value)) {
            return !isNaN(parseDateString(viewValue));
        }

        return false;
    }

    function documentClickBind(event) {
        if (!scope.isOpen && scope.disabled) {
            return;
        }

        var popup = $popup[0];
        var dpContainsTarget = element[0].contains(event.target);
        // The popup node may not be an element node
        // In some browsers (IE) only element nodes have the 'contains' function
        var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
        if (scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
            scope.$apply(function () {
                scope.isOpen = false;
            });
        }
    }

    function inputKeydownBind(evt) {
        if (evt.which === 27 && scope.isOpen) {
            evt.preventDefault();
            evt.stopPropagation();
            scope.$apply(function () {
                scope.isOpen = false;
            });
            element[0].focus();
        } else if (evt.which === 40 && !scope.isOpen) {
            evt.preventDefault();
            evt.stopPropagation();
            scope.$apply(function () {
                scope.isOpen = true;
            });
        }
    }
}])

.directive('richccDatepickerPopup', function () {
    return {
        require: ['ngModel', 'richccDatepickerPopup'],
        controller: 'RichccDatepickerPopupController',
        scope: {
            datepickerOptions: '=?',
            isOpen: '=?',
            currentText: '@',
            clearText: '@',
            closeText: '@',
            dateDisabled: '&',
            customClass: '&',
            customIconClass: '&'
        },
        link: function (scope, element, attrs, ctrls) {
            var ngModel = ctrls[0],
              ctrl = ctrls[1];

            ctrl.init(ngModel);
        }
    };
})

.directive('richccDatepickerPopupWrap', function () {
    return {
        replace: true,
        transclude: true,
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'template/richcc/popup.html';
        }
    };
})

.directive("ccKey", function () {
    return {
        restrict: 'AEC',
        link: function ($scope, elem, attr) {
            elem.on('click', function (e) {
                if (attr.ngDisabled != true)
                    $scope.$apply(attr.ccKey);
            });
            elem.on('keyup', function (e) {
                if ((e.keyCode == 13 || e.keyCode == 32) && attr.ngDisabled != true)
                    $scope.$apply(attr.ccKey);
            });
        }
    };
})

.service('RichCCService', ['dateFilter', function (dateFilter) {
    var self = this;
    self.datepickerMode = 'day';
    self.formatDay = 'dd';
    self.formatMonth = 'MMMM';
    self.formatYear = 'yyyy';
    self.formatDayHeader = 'EEE';
    self.formatDayTitle = 'MMMM yyyy';
    self.formatMonthTitle = 'yyyy';
    self.maxDate = null;
    self.maxMode = 'year';
    self.minDate = null;
    self.minMode = 'day';
    self.ngModelOptions = {};
    self.shortcutPropagation = false;
    self.yearColumns = 5;
    self.yearRows = 4;
    self.light = false;
    self.yearMapHeat = false;
    self.preventModeToggle = false;
    self.preventCalNav = false;
    self.hideCalNav = false;
    self.showMarkerForMoreEvents = true;
    self.showDataLabel = false;
    self.defaultDataLabel = '00=00';
    self.monthPopUpTmpl = 'template/richcc/richccMonthPopup.html';
    self.dayPopUpTmpl = 'template/richcc/richccDayPopup.html';
    self.enableWebWorkers = false;
    self.expandedMode = false;
    self.webWorkerAngularPath = 'https=//cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js';

    String.prototype.replaceAll = function (find, replaceWith) {
        var regex = new RegExp(find, 'g');
        return this.replace(regex, replaceWith);
    }

    /* EVENTS LOGIC */
    function dtCompare(dta, dtb) {
        if (dta < dtb)
            return -1;
        else if (dta == dtb)
            return 0;
        else if (dta > dtb)
            return 1;
    }

    function getDaysBetweenDates(dt1, dt2) {
        var _days = [];
        var _timeDiff = Math.abs((new Date(dt1)).getTime() - (new Date(dt2)).getTime());
        var _diffDays = Math.ceil(_timeDiff / (1000 * 3600 * 24)) + 1;
        _.each(_.range(_diffDays), function (i) {
            var _day = new Date(dt1);
            _day = _day.setDate(_day.getDate() + i);
            _days.push(new Date(_day));
        });
        return _days;
    }

    function isSameDay(d1, d2) {
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return d1.getTime() === d2.getTime();

    }

    function getOrder(days) {
        var _proceed = true;
        var i = 1;
        while (_proceed) {
            var _found = _.find(days, function (day) {
                return day.order == i;
            });
            if (typeof _found === 'undefined') {
                _proceed = false;
            }
            else
                i = i + 1;
        }
        return i;
    }

    function dayIsWeekFirst(_day, _weekFirsts) {
        var _found = _.find(_weekFirsts, function (d) {
            return d.date.getDate() == _day.getDate() && d.date.getMonth() == _day.getMonth() && d.date.getFullYear() == _day.getFullYear();
        });
        if (typeof _found === 'undefined')
            return false;
        else
            return true;
    }

    function _dayInCurrentRows(_day, rows) {
        var result = false;
        if (rows.length > 0) {
            var _totalNumberOfRows = rows.length
            if (rows[0].length > 0) {
                var _totalNumberOfColumns = rows[_totalNumberOfRows - 1].length;
                if (_day >= rows[0][0].date && _day <= rows[_totalNumberOfRows - 1][_totalNumberOfColumns - 1].date)
                    result = true;
            }
        }
        return result;
    }

    function _dayInCurrentMonth(_day, _rows) {
        var result = false;
        if (_rows.length > 0) {
            var _totalNumberOfRows = _rows.length;
            if (_rows[0].length > 0) {
                var _midDate = _rows[2][3];
                var _firstDay = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth(), 1)).setHours(0, 0, 0, 0);
                var _lastDay = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0)).setHours(0, 0, 0, 0);
                if (_day >= _firstDay && _day <= _lastDay)
                    result = true;
            }
        }
        return result;
    }

    function _getDayListExistingInCurrentMOnth(_days, _rows) {
        var _daysCurrent = [];
        if (_rows.length > 0) {
            var _totalNumberOfRows = _rows.length;
            if (_rows[0].length > 0) {
                var _midDate = _rows[2][3];
                var _lastday = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0)).setHours(0, 0, 0, 0);
                _daysCurrent = _.filter(_days, function (_day) {
                    var _totalNumberOfColumns = _rows[_totalNumberOfRows - 1].length;
                    return (_day >= _rows[0][0].date && _day <= _lastday && (new Date(_day).getMonth() == new Date(_lastday).getMonth()));
                });
            }
        }
        return _daysCurrent;
    }

    function _getDayListBasedOnEvent(_days, _pday, _stday) {
        var diff = getDaysBetweenDates(_stday, _pday);
        var _stDays = _.filter(_days, function (_d) {
            return _d >= _pday
        });
        return _stDays.length;
    }

    self.processEventsForMonthEventViewer = function (events, rows) {
        var _events = _.map(events, function (e) {
            e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e;
        });
        var _sortedEvents = _events.sort(function (a, b) {
            if (a._startDt == b._startDt) {
                return dtCompare(a._endDt, b._endDt);
            }
            else
                return dtCompare(a._startDt, b._startDt);
        });
        var _dayEventDetails = {
        };
        var _monthEventDetails = {
        };
        var _step = 1;
        _.each(_sortedEvents, function (_event) {
            var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
            var _eventDetail = {
            };
            angular.extend(_eventDetail, _event);
            _eventDetail.order = null;
            _eventDetail.first = null;
            _.each(_days, function (_day, _iter) {
                var _proceedFurther = _dayInCurrentMonth(_day, rows);
                if (_proceedFurther == true) {
                    var key = _day.getFullYear() + '_' + _day.getMonth() + '_' + _day.getDate();
                    if (typeof _dayEventDetails[key] === 'undefined' || _dayEventDetails[key] == null)
                        _dayEventDetails[key] = [];
                    var _evKey = _eventDetail.id + '_' + _day.getMonth();
                    if (_monthEventDetails[_evKey] != true) {
                        var _oldOrder = _eventDetail.order;
                        _eventDetail.order = getOrder(_dayEventDetails[key]);
                        var _newOrder = _eventDetail.order;
                        if (_oldOrder != _newOrder && _newOrder <= 2) {
                            _eventDetail.startPaintForMonth = true;
                            var _availableDaysToMark = _getDayListExistingInCurrentMOnth(_days, rows);
                            _eventDetail.paintBoxLengthForMonth = _getDayListBasedOnEvent(_availableDaysToMark, _day, new Date(_event._startDt));
                            _monthEventDetails[_evKey] = true;
                        }
                        else {
                            _eventDetail.startPaintForMonth = false;
                        }
                    } else {
                        _eventDetail.startPaintForMonth = false;
                    }
                    var _newEventDetail = _.clone(_eventDetail);
                    _dayEventDetails[key].push(_newEventDetail);
                }
            });
        });
        return _dayEventDetails;
    }

    self.processLabels = function (labelData) {
        var _modLabels = {
        };
        _.each(labelData, function (item) {
            var _dt = new Date(item.dt);
            var key = _dt.getFullYear() + '_' + _dt.getMonth() + '_' + _dt.getDate();
            _modLabels[key] = item.label;
        });
        return _modLabels;
    }

    self.getDates = function (startDate, n) {
        var dates = new Array(n), current = new Date(startDate), i = 0, date;
        while (i < n) {
            date = new Date(current);
            dates[i++] = date;
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };
    self.split = function (arr, size) {
        var arrays = [];
        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }
        return arrays;
    };
    self._dupCreateDateObject = function (date, format) {
        var dt = {
            date: date,
            label: dateFilter(date, format.replace(/d!/, 'dd')).replace(/M!/, 'MM')
        };
        return dt;
    };
    self.processForRows = function (_dt, options) {
        var activeMonthViewDate = new Date(_dt);
        var year = activeMonthViewDate.getFullYear(), month = activeMonthViewDate.getMonth(), firstDayOfMonth = new Date(activeMonthViewDate);
        var startingDay = 0;

        firstDayOfMonth.setFullYear(year, month, 1);
        var difference = startingDay - firstDayOfMonth.getDay(), numDisplayedFromPreviousMonth = difference > 0 ? 7 - difference : -difference, firstDate = new Date(firstDayOfMonth);
        if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
        }

        // 42 is the number of days on a six-week calendar
        var days = self.getDates(firstDate, 42);
        for (var i = 0; i < 42; i++) {
            days[i] = angular.extend(self._dupCreateDateObject(days[i], self.formatDay), {
                secondary: days[i].getMonth() !== month,
                //uid: scope.uniqueId + '-' + i,
                key: days[i].getFullYear() + '_' + days[i].getMonth() + '_' + days[i].getDate(),
                monthIndex: days[i].getMonth(),
                IsCurrMonth: days[i].getMonth() == activeMonthViewDate.getMonth()
            });
            if (typeof options.customClass === 'function') {
                days[i].customClass = options.customClass({ date: days[i].date, mode: 'year' }) || null;
            }
        }

        var labels = new Array(7);
        self.labels = [];
        for (var j = 0; j < 7; j++) {
            var label = {
                abbr: dateFilter(days[j].date, self.formatDayHeader),
                full: dateFilter(days[j].date, 'EEEE')
            };
            self.labels.push(label);
            labels[j] = label;
        }
        var monthWiseEventMarkers = self.labels;
        var title = dateFilter(activeMonthViewDate, self.formatDayTitle);
        var rows = self.split(days, 7);
        var _indexMonth = activeMonthViewDate.getMonth();

        return { 'index': _indexMonth, 'rows': rows, 'eventMarkers': monthWiseEventMarkers };
    }
    return self;
}])
.directive('richccYear', ['RichCCService', '$parse', '$document', function (RichCCService, $parse, $document) {
    return {
        replace: true,
        templateUrl: function (element, attrs) { return attrs.templateUrl || 'template/richcc/richcc-year-tmpl.html'; },
        scope: {
            datepickerOptions: '=?',
            ngModel: '=',
            events: '=',
            light: '=',  //deprecate
            eventPopupHide: "=",
            preventCalNav: "=", //deprecate
            preventModeToggle: "=", //deprecate
            yearMapHeat: "=", //deprecate
            daySelectCallback: '&',
            eventPopupLeftCallback: '&',
            eventPopupRightCallback: '&',
            eventClickCallback: '&',
            eventPopupSettings: '='
        },
        controller: ['RichCCService', '$timeout', '$filter', '$scope', '$compile', '$document', function (service, $timeout, $filter, $scope, $compile, $document) {
            var self = this;
            self.rid = _.uniqueId('richcc');
            self.months = [];
            self.weekDayMarkers = [];
            self.popUpState = {};
            self.inProgress = true;
            self.popUpTriggerYearView = function (events) {
                try {
                    var eventPopupSettings = $scope.eventPopupSettings;
                    if (typeof eventPopupSettings !== 'undefined' && typeof eventPopupSettings.showWhenEventsEmpty !== 'undefined' && eventPopupSettings.showWhenEventsEmpty != true) {
                        if (typeof events === 'undefined' || events == null || events == {
                        })
                            return 'none';
                        else if (events.length > 0 && eventPopupSettings.hidden != true)
                            return 'outsideClick';
                    }
                    else if (typeof eventPopupSettings !== 'undefined' && typeof eventPopupSettings.showWhenEventsEmpty !== 'undefined' && eventPopupSettings.showWhenEventsEmpty == true) {
                        return 'outsideClick';
                    }
                    else
                        return 'none';
                } catch (e) {
                    return 'none';
                }
            }

            self.getPopUpPositionForMonthEventMap = function (monthindex, weekindex) {
                var position = '';
                if (monthindex < 6)
                    position = 'bottom';
                else
                    position = 'top';
                return position;
            }

            self.move = function (dir) {
                if (self.inProgress)
                    return;
                self.reset();
                var _dt = angular.copy(self.dt);
                _dt.setFullYear(_dt.getFullYear() + dir);
                self.processDt(_dt);

                var _retData = {
                    'datepickerMode': 'year',
                    'activeDate': _dt
                };

                if (typeof $scope.datepickerOptions.moveModeCallback === "function") {
                    $scope.$apply(function () {
                        $scope.datepickerOptions.moveModeCallback(_retData);
                    });
                }


            }
            self.reset = function () {
                self.inProgress = true;
                var _cells = angular.element(document.getElementsByClassName('richcc-year-row'));
                _.each(_cells, function (cell) {
                    var id = cell.getAttribute('id');
                    angular.element(document.getElementById(id)).empty();
                });
                self.months = [];
                for (var id in self.popUpState) {
                    if (self.popUpState[id] == true) {
                        self.popUpState[id] = false;
                    }
                }
                var _elems = $('.popover.richcc-popup-container');
                _.each(_elems, function (elem) {
                    $(elem).remove();
                });
                _.each(self.eventIds, function (eid) {
                    $document.off(eid);
                });
            }

            self.eventIds = [];

            self.processDt = function (dt) {
                self.dt = dt;
                self.title = dt.getFullYear();
                _.each(_.range(12), function (iter) {
                    dt.setMonth(iter);
                    dt.setDate(15);
                    var monthData = service.processForRows(dt, $scope.datepickerOptions);
                    if (iter == 0)
                        self.weekDayMarkers = monthData.eventMarkers;
                    monthData.eventDetails = service.processEventsForMonthEventViewer($scope.events, monthData.rows);
                    self.months.push(monthData);
                });

                $timeout(function () {
                    _.each(self.months, function (month, mIndex) {
                        _.each(month.rows, function (week, wIndex) {
                            var _rowElm = angular.element(document.getElementById('row_' + mIndex + '_' + wIndex));
                            _.each(week, function (column, cIndex) {
                                var _cellTmpl = '<td role="gridcell" class="uib-day text-center richcc-td" id="CELLID"></td>'
                                var _cid = _.uniqueId('richcc_cell_');
                                _cellTmpl = _cellTmpl.replace('CELLID', _cid);
                                _rowElm.append(_cellTmpl);
                                if (column.IsCurrMonth == true) {
                                    var _cellElm = angular.element(document.getElementById(_cid));
                                    var _cellElmContent = '<div class="richcc-month-eventbox"><div class="richcc-eventbox-content CUSTOM_CLASS "><div class="markHolder" style="position:relative;" id="CELL_ELM_ID"><div class="month-date"> COLUMN_DT_INITIAL </div><div class="richcc-yearly-event-popupoverlay" id="event_pop_trig_EVENTPOPTRIGGERID" key="COLUMN_KEY" mindex="MINDEX" windex="WINDEX" ></div></div></div></div>';
                                    _cellElmContent = _cellElmContent.replaceAll('MINDEX', mIndex);
                                    _cellElmContent = _cellElmContent.replaceAll('WINDEX', wIndex);
                                    _cellElmContent = _cellElmContent.replaceAll('EVENTPOPTRIGGERID', column.key);
                                    _cellElmContent = _cellElmContent.replaceAll('COLUMN_KEY', column.key);
                                    _cellElmContent = _cellElmContent.replaceAll('COLUMN_DT_INITIAL', $filter('date')(column.date, 'dd') || '');
                                    var _markID = 'mh_' + column.key;
                                    _cellElmContent = _cellElmContent.replaceAll('CELL_ELM_ID', _markID);
                                    _cellElmContent = _cellElmContent.replaceAll('CUSTOM_CLASS', column.customClass || '');
                                    _cellElm.append(_cellElmContent);
                                    var eventDetails = month.eventDetails[column.key];
                                    if (typeof eventDetails !== 'undefined' && eventDetails.length > 0) {
                                        _.each(eventDetails, function (evt) {
                                            if (evt.startPaintForMonth == true) {
                                                var elmHtml = '<div class="mark notrans step-EVENT_STEP  EVENT_ORDER " style=\'color:EVENT_COLOR; width:EVENT_WIDTH\' > INITIALSTMPL <div class="mark-stripe notrans light EVENT_HIGHLIGHT_CLASS"  style=\'border-color:EVENT_HIGHLIGHT_BORDER\'> <div class="mark-stripe-color" style=\'background-color:EVENT_BGCOLOR\'></div> </div>';
                                                if (evt.order == 1)
                                                    elmHtml = elmHtml.replace('EVENT_ORDER', 'top');
                                                else if (evt.order == 2)
                                                    elmHtml = elmHtml.replace('EVENT_ORDER', 'bottom');
                                                elmHtml = elmHtml.replaceAll('EVENT_COLOR', evt.bgcolor);
                                                var width = '';
                                                if ($scope.datepickerOptions.noInitials != true) {
                                                    var _initialsTmpl = '<div class="mark-text-initial" style=\'color:EVENT_COLOR;\' > EVENT_INTIAL </div>';
                                                    _initialsTmpl = _initialsTmpl.replace('EVENT_INTIAL', $filter('limitTo')(evt.initial, 1) || '');
                                                    elmHtml = elmHtml.replace('INITIALSTMPL', _initialsTmpl);
                                                    width = 'calc(' + 100 * evt.paintBoxLengthForMonth + '% - 18px)';
                                                }
                                                else {
                                                    elmHtml = elmHtml.replace('INITIALSTMPL', '');
                                                    width = 'calc(' + 100 * evt.paintBoxLengthForMonth + '% - 10px)';
                                                }
                                                elmHtml = elmHtml.replace('EVENT_WIDTH', width);
                                                if (evt.highlightBorder == true)
                                                    elmHtml = elmHtml.replace('EVENT_HIGHLIGHT_CLASS', 'highlightBorder');
                                                elmHtml = elmHtml.replace('EVENT_HIGHLIGHT_BORDER', evt.highlightBorder == true ? evt.highlightBorderColor : 'transparent');
                                                elmHtml = elmHtml.replace('EVENT_BGCOLOR', evt.bgcolor);
                                                var _markElm = angular.element(document.getElementById(_markID));
                                                _markElm.append(elmHtml);
                                            }
                                        });
                                    }
                                    var _element = angular.element(document.getElementById('event_pop_trig_' + column.key));
                                    var _popUopContainerId = column.key;
                                    _element.on('click', function (e) {
                                        var _column = column;
                                        var _key = $(e.currentTarget).attr('key');
                                        var _mIndex = parseInt($(e.currentTarget).attr('mindex')) || 0;
                                        var _wIndex = parseInt($(e.currentTarget).attr('windex')) || 0;
                                        for (var key in self.popUpState) {
                                            if (key != _key && self.popUpState[key] == true) {
                                                self.popUpState[key] = false;
                                                var _element = angular.element(document.getElementById('event_pop_trig_' + key));
                                                $(_element).popover('hide');
                                            }
                                        }
                                        if (self.popUpState[_key] != true) {
                                            var _eventDetails = self.months[_mIndex].eventDetails[_key];
                                            var _popUpTmpl = '<div class="popover richcc-popup-container yearly-only fade in "><div class="arrow"></div><div class="popover-inner"><div class="popover-content"></div></div></div>';
                                            var _popUpContentTmpl = '<div class="richcc-day-popup" id="POPUPCONTAINERID" key="POPUPCONTAINERKEY"><div class="event-container NOACTIONS "><div class="event-container-label">POPUPDATE<span>POPUPEVENTCOUNT</span></div><div class="event-details-container">POPUPEVENTDETAILSTMPL</div></div><div class="event-action-container POPOVERSINGLEBUTTONLYCLASS "> POPUPLEFTBTNTMPL POPUPRIGHTBTNTMPL <div class="event-separator"></div></div></div>';
                                            _popUpContentTmpl = _popUpContentTmpl.replace('POPUPCONTAINERID', _popUopContainerId);
                                            _popUpContentTmpl = _popUpContentTmpl.replace('POPUPCONTAINERKEY', _key);
                                            _popUpContentTmpl = _popUpContentTmpl.replace('POPUPDATE', $filter('date')(_column.date, $scope.eventPopupSettings.dateFilter) || '');
                                            if (!($scope.eventPopupSettings.showLeft || $scope.eventPopupSettings.showRight)) {
                                                _popUpContentTmpl = _popUpContentTmpl.replace('NOACTIONS', 'noActions');
                                            }
                                            //POPUPEVENTDETAILSTMPL
                                            var _evtTmpls = '';
                                            eventDetails = _.sortBy(eventDetails, function (evt) { evt.isHoliday = evt.isHoliday || false; return evt.isHoliday == true ? -1 : 1 });
                                            _.each(eventDetails, function (evt, iter) {
                                                var _evTmpl = '<div class="event-detail EVENTHOLIDAYCLASS " style="background-color:EVENTDETAILBGCOLOR" mindex="MINDEX" key="COLUMNKEY" dt="COLUMNDATE" evid="EVTPRIMARYIDDET" id="EVENTDETAILID" iter="ITERATOR"><div class="event-marker"></div><div class="event-title-holder POPUPHIGHLIGHTBORDERCLASS" style="border-left-color: POPOVERBGCOLOR"><span class="event-title">EVENTTITLE</span> EVENDETAILSOTHERSTUFF </div></div>';
                                                _evTmpl = _evTmpl.replace('EVTPRIMARYIDDET', evt.id);
                                                if (evt.highlightBorder)
                                                    _evTmpl = _evTmpl.replace('POPUPHIGHLIGHTBORDERCLASS', 'highlightBorder');
                                                if (evt.isHoliday == true) {
                                                    _evTmpl = _evTmpl.replace('EVENTHOLIDAYCLASS', 'event-holiday');
                                                    _evTmpl = _evTmpl.replace('EVENTDETAILBGCOLOR', evt.bgcolor);
                                                    var _otherStuffTmpl = '<div class="event-timing-holder"><span class="event-time holiday"> EVENTHOLIDAYTYPE </span></div>';
                                                    _otherStuffTmpl = _otherStuffTmpl.replace('EVENTHOLIDAYTYPE', evt.holidayType || '');
                                                    _evTmpl = _evTmpl.replace('EVENDETAILSOTHERSTUFF', _otherStuffTmpl);
                                                }
                                                else {
                                                    _evTmpl = _evTmpl.replace('EVENTDETAILBGCOLOR', '#fff');
                                                    var _otherStuffTmpl = ': <span class="event-subject">EVENTSUBJECT</span><div class="event-timing-holder"><span class="event-time ng-binding">EVENTSTARTIME</span><span style="padding: 0px 15px;">-</span><span class="event-time ng-binding">EVENTENDTIME</span></div>';
                                                    _otherStuffTmpl = _otherStuffTmpl.replace('EVENTSUBJECT', evt.subject || '');
                                                    //EVENTSTARTIME
                                                    _otherStuffTmpl = _otherStuffTmpl.replace('EVENTSTARTIME', $filter('date')(evt._startDt, $scope.eventPopupSettings.dateFilter) || '');
                                                    //EVENTENDTIME
                                                    _otherStuffTmpl = _otherStuffTmpl.replace('EVENTENDTIME', $filter('date')(evt._endDt, $scope.eventPopupSettings.dateFilter) || '');
                                                    _evTmpl = _evTmpl.replace('EVENDETAILSOTHERSTUFF', _otherStuffTmpl);
                                                }
                                                _evTmpl = _evTmpl.replace('POPOVERBGCOLOR', evt.bgcolor);
                                                _evTmpl = _evTmpl.replace('EVENTTITLE', evt.name || '');
                                                var _id = column.key + '_evtdet_' + iter;
                                                _evTmpl = _evTmpl.replace('EVENTDETAILID', _id);
                                                _evTmpl = _evTmpl.replace('MINDEX', _mIndex);
                                                _evTmpl = _evTmpl.replace('ITERATOR', iter);
                                                _evTmpl = _evTmpl.replace('COLUMNKEY', column.key);
                                                _evTmpl = _evTmpl.replace('COLUMNDATE', (column.date.getMonth() + 1) + '/' + column.date.getDate() + '/' + column.date.getFullYear());
                                                _evtTmpls = _evtTmpls + _evTmpl;
                                            });
                                            if (typeof _eventDetails !== 'undefined' && _eventDetails != null && _eventDetails.length > 0) {
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPEVENTCOUNT', ' (' + (_eventDetails.length || 0) + ' Events)');
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPEVENTDETAILSTMPL', _evtTmpls);
                                            }
                                            else {
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPEVENTCOUNT', ' (0 Events)');
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPEVENTDETAILSTMPL', '');
                                            }
                                            //POPOVERSINGLEBUTTONLYCLASS
                                            if (($scope.eventPopupSettings.showLeft != false && $scope.eventPopupSettings.showRight == false) || ($scope.eventPopupSettings.showLeft == false && $scope.eventPopupSettings.showRight != false)) {
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPOVERSINGLEBUTTONLYCLASS', 'singleButtonOnly');
                                            }
                                            //POPUPLEFTBTNTMPL
                                            if ($scope.eventPopupSettings.showLeft != false) {
                                                var _btnTmpl = '<button class="event-action" mindex="MINDEX" key="COLUMNKEY" dt="COLUMNDATE" pos="BUTTONPOS" >POPOVERBUTTONTITLE</button>';
                                                _btnTmpl = _btnTmpl.replace('BUTTONPOS', 'LEFT');
                                                _btnTmpl = _btnTmpl.replace('MINDEX', _mIndex);
                                                _btnTmpl = _btnTmpl.replace('COLUMNKEY', column.key);
                                                _btnTmpl = _btnTmpl.replace('COLUMNDATE', (column.date.getMonth() + 1) + '/' + column.date.getDate() + '/' + column.date.getFullYear());
                                                _btnTmpl = _btnTmpl.replace('POPOVERBUTTONTITLE', $scope.eventPopupSettings.leftLabel || 'Add Events');
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPLEFTBTNTMPL', _btnTmpl);
                                            }
                                            else
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPLEFTBTNTMPL', '');
                                            //POPUPRIGHTBTNTMPL
                                            if ($scope.eventPopupSettings.showRight != false) {
                                                var _btnTmpl = '<button class="event-action" mindex="MINDEX" key="COLUMNKEY" dt="COLUMNDATE" pos="BUTTONPOS" >POPOVERBUTTONTITLE</button>';
                                                _btnTmpl = _btnTmpl.replace('BUTTONPOS', 'RIGHT');
                                                _btnTmpl = _btnTmpl.replace('MINDEX', _mIndex);
                                                _btnTmpl = _btnTmpl.replace('COLUMNKEY', column.key);
                                                _btnTmpl = _btnTmpl.replace('COLUMNDATE', (column.date.getMonth() + 1) + '/' + column.date.getDate() + '/' + column.date.getFullYear());
                                                _btnTmpl = _btnTmpl.replace('POPOVERBUTTONTITLE', $scope.eventPopupSettings.rightLabel || 'Add Events');
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPRIGHTBTNTMPL', _btnTmpl);
                                            }
                                            else
                                                _popUpContentTmpl = _popUpContentTmpl.replace('POPUPRIGHTBTNTMPL', '');
                                            var _popUpPosition = self.getPopUpPositionForMonthEventMap(_mIndex, _wIndex);
                                            var _popUpOptions = { html: true, content: _popUpContentTmpl, show: false, container: 'body', trigger: 'click', placement: _popUpPosition, template: _popUpTmpl };
                                            $(e.target).popover(_popUpOptions);
                                            $(e.target).popover('show');
                                            self.popUpState[_key] = true;

                                            /* OUTSIDE CLICK HANDLER */

                                        }
                                        else {
                                            self.popUpState[_key] = false;
                                            $(e.target).popover('hide');
                                        }
                                    });

                                    _element.on('shown.bs.popover', function (e) {
                                        var _key = $(e.currentTarget).attr('key');

                                        var evtId = 'click.' + _key;
                                        self.eventIds.push(evtId);

                                        $document.on(evtId, function (e) {
                                            var _elems = $(e.target).closest('.popover');
                                            if (_elems.length == 0) {
                                                for (var id in self.popUpState) {
                                                    if (self.popUpState[id] == true) {
                                                        var selector = '#event_pop_trig_' + id;
                                                        $(selector).popover('hide');
                                                        self.popUpState[id] = false;
                                                    }
                                                }
                                            }
                                        });

                                        $('.event-detail').click(function (e) {
                                            var _key = $(e.currentTarget).attr('key');
                                            var _dt = new Date($(e.currentTarget).attr('dt')) || null;
                                            var _itr = parseInt($(e.currentTarget).attr('iter')) || 0;
                                            var _id = parseInt($(e.currentTarget).attr('evid')) || 0;
                                            var _mIndex = parseInt($(e.currentTarget).attr('mindex')) || 0;
                                            var _evt = null;
                                            var _eventDetails = self.months[_mIndex].eventDetails[_key];
                                            if (_eventDetails.length > 0) {
                                                _evt = _.find(_eventDetails, function (event) {
                                                    return event.id == _id
                                                });
                                            }
                                            var data = {
                                                'dt': _dt, 'event': _evt
                                            };
                                            if (typeof $scope.eventClickCallback === 'function')
                                                $scope.$apply(function () {
                                                    $scope.eventClickCallback({ 'data': data });
                                                });
                                        });
                                        $('.event-action').click(function (e) {
                                            var _key = $(e.currentTarget).attr('key');
                                            var _dt = new Date($(e.currentTarget).attr('dt')) || null;
                                            var _mIndex = parseInt($(e.currentTarget).attr('mindex')) || 0;
                                            var _pos = $(e.currentTarget).attr('pos') || '';
                                            var _evt = null;
                                            var _eventDetails = self.months[_mIndex].eventDetails[_key];
                                            var data = {
                                                'dt': _dt, 'events': _eventDetails
                                            };
                                            if (_pos == 'LEFT') {
                                                if (typeof $scope.eventPopupLeftCallback === 'function')
                                                    $scope.$apply(function () {
                                                        $scope.eventPopupLeftCallback({ 'data': data });
                                                    });
                                            }
                                            else if (_pos == 'RIGHT') {
                                                if (typeof $scope.eventPopupRightCallback === 'function')
                                                    $scope.$apply(function () {
                                                        $scope.eventPopupRightCallback({ 'data': data });
                                                    });
                                            }
                                        });
                                    });

                                    _element.on('hidden.bs.popover', function (e) {
                                        var _key = $(e.target).attr('key');
                                        self.popUpState[_key] = false;
                                        var evtId = 'click.' + _key;
                                        $document.off(evtId);
                                        self.eventIds = _.reject(self.eventIds, function (eid) { return eid == evtId });
                                    });
                                }
                            });
                        });
                    });
                    $scope.initialized = true;
                    self.inProgress = false;
                }, 300);
            }

            $scope.processEventsChange = function (e) {
                self.reset();
                self.processDt(self.dt);
            }

            $scope.init = function (dt) {
                self.reset();
                self.processDt(dt);
            }

            self.numOfWeeks = _.range(6);
            self.popUpTmpl = 'richCCYearPopUp.html';
            self.monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            self.keyup = function (e) {
                if (e.keyCode == 27) {
                    //ESC KEY
                    for (var key in self.popUpState) {
                        if (self.popUpState[key] == true) {
                            self.popUpState[key] = false;
                            var _element = angular.element(document.getElementById('event_pop_trig_' + key));
                            $(_element).popover('hide');
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

        }],
        controllerAs: 'ricchYear',
        link: function (scope, elem, attrs) {
            scope.initialized = false;
            scope.$watch('ngModel', function (n, o) {
                if (typeof n !== 'undefined' && n != null && n != {}) {
                    scope.init(new Date(n));
                }
            }, true);
            scope.$watch('events', function (n, o) {
                if (typeof n !== 'undefined' && n != null && n != {}) {
                    if (scope.initialized == true)
                        scope.processEventsChange(n);
                }
            }, false);
            scope.$on('$destroy', function () {
                var elements = document.getElementsByClassName('richcc-yearly-event-popupoverlay');
                _.each(elements, function (elem) {
                    var _angElm = angular.element(elem);
                    $(_angElm).popover('destroy');
                });
            });
        }
    };
}]);
