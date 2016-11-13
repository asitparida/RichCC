
angular.module('richCCSample', ['richcc.bootstrap.datepicker'])
.controller('richCCController', ["$scope", "$timeout", function ($scope, $timeout) {
    var self = this;
    var _events = [];
    _.each(sampleEvents(100), function (_ev) {
        _events.push(_ev);
    });
    var _holidayEvents = [
        { 'id': '100001', 'initial': 'A', 'name': 'Independence Day', 'startDt': '12-30-2015', 'endDt': '12-30-2015', 'bgcolor': '#9b59b6', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000', isHoliday: true, holidayType: 'Public Holiday' },
        { 'id': '100002', 'initial': 'A', 'name': 'Independence Day', 'startDt': '01-01-2016', 'endDt': '01-01-2016', 'bgcolor': '#9b59b6', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000', isHoliday: true, holidayType: 'Public Holiday' },
        { 'id': '100003', 'initial': 'A', 'name': 'ABCDGH', 'startDt': '01-04-2016', 'endDt': '01-04-2016', 'bgcolor': '#9b59b6', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000', isHoliday: true, holidayType: 'Public Holiday' },
        { 'id': '100004', 'initial': 'A', 'name': 'ABCDGH', 'startDt': '01-06-2016', 'endDt': '01-06-2016', 'bgcolor': '#9b59b6', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000', isHoliday: true, holidayType: 'Public Holiday' }
    ];
    _.each(_holidayEvents, function (_ev) {
        _events.push(_ev);
    });

    self.sampleEvents = _events;
    //self.sampleEvents = [
    //    { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-15-2016', 'endDt': '06-06-2017', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': true, 'highlightBorderColor': '#000000' },
    //    { 'id': '2', 'initial': 'B', 'name': 'Event B', 'startDt': '02-02-2016', 'endDt': '03-02-2016', 'bgcolor': '#47a1de', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
    //    { 'id': '3', 'initial': 'E', 'name': 'Event E', 'startDt': '04-10-2016', 'endDt': '04-10-2016', 'bgcolor': '#ffc310', 'color': '#000000', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
    //    { 'id': '4', 'initial': 'C', 'name': 'Event C', 'startDt': '04-17-2016', 'endDt': '04-18-2016', 'bgcolor': '#e67e22', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
    //    { 'id': '5', 'initial': 'D', 'name': 'Event D', 'startDt': '05-06-2016', 'endDt': '05-09-2016', 'bgcolor': '#e74c3c', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
    //    { 'id': '6', 'initial': 'F', 'name': 'Event F', 'startDt': '06-13-2016', 'endDt': '06-17-2016', 'bgcolor': '#000', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
    //    { 'id': '7', 'initial': 'G', 'name': 'Event G', 'startDt': '06-12-2016', 'endDt': '06-12-2016', 'bgcolor': '#000', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' }
    //];

    self.load = function () {
        var _dt = new Date(self.dt);
        _dt.setDate(20);
        self.dt = _dt;
        self.sampleEvents = sampleEvents(200);
    }

    function sampleEvents(iter) {
        var _evts = [];
        _.each(_.range(iter), function (i) {
            var evt = { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-02-2016', 'endDt': '01-06-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': _.sample([true, false]), 'highlightBorderColor': '#000000' };
            evt.id = i;
            evt.name = evt.name + i;
            delete evt.initial;
            evt.timeMetaData = _.sample(['', 'Lorem ipsum dolor sit amet. it am,et dolor.']);
            evt.bgcolor = _.sample(['#2ecc71', '#47a1de', '#ffc310', '#e67e22', '#e74c3c']);
            evt.highlightBorderColor = evt.bgcolor;
            var dt = new Date(evt.startDt);
            dt.setDate(dt.getDate() + (i * 2));
            evt.startDt = (dt.getMonth() + 1) + '-' + (dt.getDate()) + '-' + dt.getFullYear();
            evt.startDtFQ = "2016-11-02T08:00:00";
            var edt = dt;
            edt.setDate(edt.getDate() + (i * 1));
            evt.endDt = (edt.getMonth() + 1) + '-' + (edt.getDate()) + '-' + edt.getFullYear();
            //evt.endDtFQ = new Date("Fri Mar 27 2015 09:56:24 GMT+0100 (W. Europe Standard Time)");
            _evts.push(evt);
            //dt.setDate(dt.getDate() - 2);
            //evt.startDt = (dt.getMonth() + 1) + '-' + (dt.getDate()) + '-' + dt.getFullYear();
            //dt.setDate(dt.getDate() + 4);
            //evt.endDt = (dt.getMonth() + 1) + '-' + (dt.getDate()) + '-' + dt.getFullYear();
            //_evts.push(evt);
        });
        console.log(_evts);
        return _evts;
    }

    self.halfsize = true;

    self.insertSampleEvent = function () {
        //self.sampleEvents = [
        //    { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-02-2016', 'endDt': '01-06-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        //    { 'id': '2', 'initial': 'B', 'name': 'Event B', 'startDt': '01-02-2016', 'endDt': '01-02-2016', 'bgcolor': '#47a1de', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        //    { 'id': '5', 'initial': 'E', 'name': 'Event E', 'startDt': '01-08-2016', 'endDt': '02-10-2016', 'bgcolor': '#ffc310', 'color': '#000000', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        //    { 'id': '3', 'initial': 'C', 'name': 'Event C', 'startDt': '01-07-2016', 'endDt': '01-08-2016', 'bgcolor': '#e67e22', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        //    { 'id': '4', 'initial': 'D', 'name': 'Event D', 'startDt': '01-06-2016', 'endDt': '01-09-2016', 'bgcolor': '#e74c3c', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        //    { 'id': '6', 'initial': 'F', 'name': 'Event F', 'startDt': '01-16-2016', 'endDt': '01-19-2016', 'bgcolor': '#0073c6', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' }
        //];
        //self.sampleEvents = [
        //    { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-01-2017', 'endDt': '01-02-2017', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': true, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '2', 'initial': 'B', 'name': 'Event B', 'startDt': '02-02-2016', 'endDt': '03-02-2016', 'bgcolor': '#47a1de', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '3', 'initial': 'E', 'name': 'Event E', 'startDt': '04-10-2016', 'endDt': '04-10-2016', 'bgcolor': '#ffc310', 'color': '#000000', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '4', 'initial': 'C', 'name': 'Event C', 'startDt': '04-17-2016', 'endDt': '04-18-2016', 'bgcolor': '#e67e22', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '5', 'initial': 'D', 'name': 'Event D', 'startDt': '05-06-2016', 'endDt': '05-09-2016', 'bgcolor': '#e74c3c', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '6', 'initial': 'F', 'name': 'Event F', 'startDt': '06-13-2016', 'endDt': '06-17-2016', 'bgcolor': '#000', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '7', 'initial': 'G', 'name': 'Event G', 'startDt': '06-12-2016', 'endDt': '06-12-2016', 'bgcolor': '#000', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' },
        //    //{ 'id': '10', 'initial': 'J', 'name': 'Event J', 'startDt': '06-13-2016', 'endDt': '06-13-2016', 'bgcolor': '#000', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' }
        //];
        var _evts = [];
        _evts.push({ 'id': '111', 'initial': 'A', 'name': 'Event A', 'startDt': '01-10-2016', 'endDt': '01-11-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': true, 'highlightBorderColor': '#000000' });
        _evts.push({ 'id': '111', 'initial': 'A', 'name': 'Event A', 'startDt': '01-11-2016', 'endDt': '01-13-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': true, 'highlightBorderColor': '#000000' });
        self.sampleEvents = _evts;
        //console.log(self.sampleEvents);
        //self.sampleEvents.push({ 'id': '10', 'initial': 'J', 'name': 'Event J', 'startDt': '06-17-2016', 'endDt': '06-17-2016', 'bgcolor': '#000', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false, 'highlightBorderColor': '#000000' });
    }

    self.labelData = [
        { 'dt': '01-02-2016', 'label': '09:00' },
        { 'dt': '01-04-2016', 'label': '05:45' },
        { 'dt': '01-08-2016', 'label': '12:00' },
        { 'dt': '01-07-2016', 'label': '03:30' },
        { 'dt': '01-06-2016', 'label': '01:00' },
        { 'dt': '01-16-2016', 'label': '10:00' }
    ];

    self.dtPickerOptions = {
        //customClass: getDayClass,
        showWeeks: false,
        datepickerMode: 'day'
    };

    self.toggleModeCallBack = function (data) {
        console.log(data);
        self.setMainDate(data.activeDate, true);
    }

    self.setMainDate = function (dat, flag) {
        var dt = new Date(dat);
        if (flag) {
            self.dt = angular.copy(dt);
        }
        dt.setDate(15);
        dt.setMonth(dt.getMonth() - 2);
        self.dtLight3 = angular.copy(dt);
        dt.setMonth(dt.getMonth() + 1);
        self.dtLight4 = angular.copy(dt);
        dt.setMonth(dt.getMonth() + 2);
        self.dtLight1 = angular.copy(dt);
        dt.setMonth(dt.getMonth() + 1);
        self.dtLight2 = angular.copy(dt);
    }

    self.moveModeCallback = function (data) {
        self.setMainDate(data.activeDate, false);
    }

    self.dtPickerOptions1 = {
        customClass: getDayClass,
        customIconClass: getIconClass,
        showWeeks: false,
        datepickerMode: 'day',
        'yearMapHeat': true,
        'preventModeToggle': true,
        'showMarkerForMoreEvents': true,
        'showDataLabel': true,
        'defaultDataLabel': '00:00',
        moveModeCallback: self.moveModeCallback,
        enableWebWorkers: false,
        expandedMode: false
    };

    self.dtPickerOptions2 = {
        customClass: getDayClass,
        customIconClass: getIconClass,
        showWeeks: false,
        datepickerMode: 'day',
        'yearMapHeat': true,
        'preventModeToggle': true,
        'showMarkerForMoreEvents': true,
        'showDataLabel': true,
        'defaultDataLabel': '00:00',
        moveModeCallback: self.moveModeCallback,
        enableWebWorkers: false,
        expandedMode: true
    };

    self.dtPickerOptionsLight = {
        customClass: getDayClass,
        showWeeks: false,
        datepickerMode: 'day',
        'light': true,
        'yearMapHeat': false,
        'preventModeToggle': false,
        'preventCalNav': true,
        'showMarkerForMoreEvents': false,
        'hideCalNav': true,
        toggleModeCallBack: self.toggleModeCallBack,
        'dayPopUpTmpl': 'someCustomPopUp.html'
    };

    self.dtPickerOptionsLight2 = {
        customClass: getDayClass,
        showWeeks: false,
        datepickerMode: 'day',
        'light': true,
        'yearMapHeat': false,
        'preventModeToggle': false,
        'preventCalNav': false,
        'showMarkerForMoreEvents': false,
        toggleModeCallBack: self.toggleModeCallBack,
        'hideCalNav': true
    };

    self.dtPickerOptionsMonth = {
        customClass: getDayClass,
        showWeeks: false,
        datepickerMode: 'month',
        'yearMapHeat': false,
        'preventModeToggle': true,
        enableWebWorkers: false,
        noInitials: true,
        moveModeCallback: self.moveModeCallback
    };

    self.popupSettings = {
        'hidden': false,
        'showLeft': true,
        'showRight': false,
        'leftLabel': ' + Add Events',
        'rightLabel': 'Edit Details',
        'showWhenEventsEmpty': true,
        'dateFilter': 'MMM d, y h:mm:ss a',
        'labelDateFilter': 'EEE MMM dd yyyy'
    };

    self.popupSettings2 = {
        'hidden': false,
        'showLeft': true,
        'showRight': true,
        'leftLabel': 'Add Events',
        'rightLabel': 'Edit Details',
        'showWhenEventsEmpty': true,
        'showDateInYearView': true,
        'dateFilter': 'MMM d, y h:mm:ss a',
        'labelDateFilter': 'MM/dd/yy'
    };

    self.popupSettingsHidden = {
        'hidden': true
    };

    self.daySelected = function (data) {
        console.log('daySelected');
        console.log(data);
    }

    self.leftCallback = function (data) {
        console.log('leftCallback');
        console.log(data);
    }

    self.rightCallback = function (data) {
        console.log('rightCallback');
        console.log(data);
    }

    self.eventClickCallback = function (data) {
        console.log('eventClickCallback');
        console.log(data);
    }

    self.today = function () {
        self.dt = new Date('01/15/2016');
        self.dtLight1 = new Date('02/15/2016');
        self.dtLight2 = new Date('03/15/2016');
        self.dtLight3 = new Date('11/15/2015');
        self.dtLight4 = new Date('12/15/2015');
    };
    self.today();

    self.clear = function () {
        self.dt = null;
        self.dtLight1 = null;
        self.dtLight2 = null;
    };

    self.showMode = true;

    // Disable weekend selection
    self.disabled = function (date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };

    self.toggleMin = function () {
        self.minDate = self.minDate ? null : new Date();
    };

    self.toggleMin();
    self.maxDate = new Date(2020, 5, 22);

    self.open1 = function () {
        self.popup1.opened = true;
    };

    self.open2 = function () {
        self.popup2.opened = true;
    };

    self.setDate = function (year, month, day) {
        self.dt = new Date(year, month, day);
    };

    self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    self.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    self.format = self.formats[0];
    self.altInputFormats = ['M!/d!/yyyy'];

    self.popup1 = {
        opened: false
    };

    self.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    self.events =
      [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
      ];

    function getDayClass(data) {
        var result = '';
        if (data.mode === 'day' || data.mode === 'year') {
            if (data.date.getDay() == 0 || data.date.getDay() == 6)
                result = 'dayDisabled';
        }
        if (data.date.getDate() == 4 && data.date.getMonth() == 0 && data.date.getFullYear() == 2016)
            result += 'hasHoliday';
        return result;
    };

    function getIconClass(data) {
        var result = '';
        if (data.mode === 'day') {
            result = 'glyphicon glyphicon-search';
        }
        return result;
    }
}]);