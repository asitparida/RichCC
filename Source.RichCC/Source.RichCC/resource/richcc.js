angular.module('richcc.bootstrap.datepicker', ['ui.bootstrap', 'ui.bootstrap.dateparser', 'ui.bootstrap.isClass', 'ui.bootstrap.position'])

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
    yearRows: 4
})

.constant('richccConfigDefs', {
    light: false,
    yearMapHeat: false,
    preventModeToggle: false,
    preventCalNav: false
})

.controller('RichccDatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$locale', '$log', 'dateFilter', 'richccDatepickerConfig', '$datepickerSuppressError', 'uibDateParser',
  function ($scope, $attrs, $parse, $interpolate, $locale, $log, dateFilter, datepickerConfig, $datepickerSuppressError, dateParser) {
      var self = this,
          ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl;
          ngModelOptions = {},
          watchListeners = [];

      // Modes chain
      this.modes = ['day', 'month', 'year'];

      if ($attrs.datepickerOptions) {
          angular.forEach([
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
                          $scope.$watch(function () { return $scope.datepickerOptions[key]; }, function (value) {
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
                          $scope.$watch(function () { return $scope.datepickerOptions[key]; }, function (value) {
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
                          $scope.$watch(function () { return $scope.datepickerOptions.initDate; }, function (initDate) {
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
                  $scope['monthViewData'] = {};
                  $scope['monthWiseEventDetails'] = {};
                  $scope['monthWiseEventMarkers'] = {};
                  self.refreshView();
              }));
          }

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

          if ($attrs['eventPopupHide']) {
              watchListeners.push($scope.$parent.$watch($attrs['eventPopupHide'], function (value) {
                  self['eventPopupHide'] = $scope['eventPopupHide'] = angular.isDefined(value) ? value : $attrs['eventPopupHide'];
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
              customClass: this.customClass(date) || null
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
            $attrs.dateDisabled && $scope.dateDisabled({ date: date, mode: $scope.datepickerMode });
      };

      this.customClass = function (date) {
          return $scope.customClass({ date: date, mode: $scope.datepickerMode });
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
      };

      $scope.toggleMode = function (direction) {
          direction = direction || 1;

          if ($scope.datepickerMode === self.maxMode && direction === 1 ||
            $scope.datepickerMode === self.minMode && direction === -1) {
              return;
          }

          $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
      };

      // Key event mapper
      $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

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

.controller('RichccDaypickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
    var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    this.step = { months: 1 };
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

    scope.richccDaySelected = function (dt, events) {
        var data = { 'dt': dt, 'events': events };
        if (typeof scope.daySelectCallback === 'function')
            scope.daySelectCallback({ 'data': data });
        else if (typeof scope.$parent.daySelectCallback === 'function')
            scope.$parent.daySelectCallback({ 'data': data });
    }

    scope.popUpLeftHandler = function (dt, events) {
        var data = { 'dt': dt, 'events': events };
        if (typeof scope.eventPopupLeftCallback === 'function')
            scope.eventPopupLeftCallback({ 'data': data });
        else if (typeof scope.$parent.eventPopupLeftCallback === 'function')
            scope.$parent.eventPopupLeftCallback({ 'data': data });
    }

    scope.popUpRightHandler = function (dt, events) {
        var data = { 'dt': dt, 'events': events };
        if (typeof scope.eventPopupRightCallback === 'function')
            scope.eventPopupRightCallback({ 'data': data });
        else if (typeof scope.$parent.eventPopupRightCallback === 'function')
            scope.$parent.eventPopupRightCallback({ 'data': data });
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

        scope.eventDetails = this.processEvents(this._events, scope.rows);
        scope.light = this.light;
        scope.yearMapHeat = this.yearMapHeat;
        scope.eventPopupHide = this.eventPopupHide;
        scope.preventCalNav = this.preventCalNav;
        scope.preventModeToggle = this.preventModeToggle;
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
            var _found = _.find(days, function (day) { return day.order == i; });
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
            var _totalNumberOfRows = _rows.length
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
            //new Date(2008, month + 1, 0);
            var _totalNumberOfRows = _rows.length
            if (_rows[0].length > 0) {
                var _midDate = _rows[2][3];
                var _lastday = (new Date(_midDate.date.getFullYear(), _midDate.date.getMonth() + 1, 0)).setHours(0, 0, 0, 0);
                _daysCurrent = _.filter(_days, function (_day) {
                    var _totalNumberOfColumns = _rows[_totalNumberOfRows - 1].length;
                    return (_day >= _rows[0][0].date && _day <= _lastday);
                });
            }
        }
        return _daysCurrent;
    }

    function _getDayListBasedOnEvent(_days, _pday, _stday) {
        var diff = getDaysBetweenDates(_pday, _stday);
        if (_pday.getMonth() == _stday.getMonth())
            return _days.splice(diff.length - 1).length;
        else {
            return _days.length;
        }
    }

    this.processEvents = function (events, rows) {
        var _weekFirsts = _.map(rows, function (row) { var _first = row[0]; _first._date = _first.date.setHours(0, 0, 0, 0); return _first });
        var _events = _.map(events, function (e) { e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e; });
        var _sortedEvents = _events.sort(function (a, b) {
            if (a._startDt == b._startDt) {
                return dtCompare(a._endDt, b._endDt);
            }
            else
                return dtCompare(a._startDt, b._startDt);
        });
        var _dayEventDetails = {};
        var _step = 1;
        _.each(_sortedEvents, function (_event) {
            var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
            var _eventDetail = {};
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

    this.processEventsForMonthEventViewer = function (events, rows) {
        var _events = _.map(events, function (e) { e._startDt = (new Date(e.startDt)).setHours(0, 0, 0, 0); e._endDt = (new Date(e.endDt)).setHours(0, 0, 0, 0); return e; });
        var _sortedEvents = _events.sort(function (a, b) {
            if (a._startDt == b._startDt) {
                return dtCompare(a._endDt, b._endDt);
            }
            else
                return dtCompare(a._startDt, b._startDt);
        });
        var _dayEventDetails = {};
        var _monthEventDetails = {};
        var _step = 1;
        _.each(_sortedEvents, function (_event) {
            var _days = getDaysBetweenDates(_event._startDt, _event._endDt);
            var _eventDetail = {};
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
        if (isHeatMap == true)
            this.activeMonthViewDate.setDate(15);
        var year = this.activeMonthViewDate.getFullYear(),
          month = this.activeMonthViewDate.getMonth(),
          firstDayOfMonth = new Date(this.activeMonthViewDate);

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
        else if (typeof scope.parent.monthWiseEventMarkers !== 'undefined')
            scope.parent.monthWiseEventMarkers[this.activeMonthViewDate.getMonth()] = this.labels;
        scope.title = dateFilter(this.activeMonthViewDate, this.formatDayTitle);
        scope.rows = this.split(days, 7);
        if (typeof scope.monthViewData !== 'undefined')
            scope.monthViewData[this.activeMonthViewDate.getMonth()] = { 'dt': this._actMonViewDate, 'rows': scope.rows };
        else if (typeof scope.parent.monthViewData !== 'undefined')
            scope.parent.monthViewData[this.activeMonthViewDate.getMonth()] = { 'dt': this._actMonViewDate, 'rows': scope.rows };
        if (scope.showWeeks) {
            scope.weekNumbers = [];
            var thursdayIndex = (4 + 7 - this.startingDay) % 7,
                numWeeks = scope.rows.length;
            for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
                scope.weekNumbers.push(
                  getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
            }
        }
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
        scope.light = this.light;
        scope.yearMapHeat = this.yearMapHeat
        scope.eventPopupHide = this.eventPopupHide;
        scope.preventCalNav = this.preventCalNav;
        scope.preventModeToggle = this.preventModeToggle;
    };


}])

.controller('RichccMonthpickerController', ['$scope', '$element', 'dateFilter', function (scope, $element, dateFilter) {
    this.step = { years: 1 };
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
        this.step = { years: range };
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
            shortcutPropagation: '&?',
            richccConfig:'=',
            events: '=',
            light: '=',  //deprecate
            eventPopupHide: "=",
            preventCalNav: "=", //deprecate
            preventModeToggle: "=", //deprecate
            yearMapHeat: "=", //deprecate
            daySelectCallback: '&',
            eventPopupLeftCallback: '&',
            eventPopupRightCallback: '&',
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

    scope.watchData = {};

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
        return string.replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); });
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
            customClass: '&'
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
});
