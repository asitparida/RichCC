angular.module('richCCSample', ['richcc.bootstrap.datepicker'])
.controller('richCCController', ["$scope", "$timeout", function ($scope, $timeout) {
    var self = this;
    self.sampleEvents = [
        { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-02-2016', 'endDt': '01-06-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': true,   'highlightBorderColor' : '#000000' },
        { 'id': '2', 'initial': 'B', 'name': 'Event B', 'startDt': '01-02-2016', 'endDt': '01-02-2016', 'bgcolor': '#47a1de', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false , 'highlightBorderColor' : '#000000'},
        { 'id': '5', 'initial': 'E', 'name': 'Event E', 'startDt': '01-10-2016', 'endDt': '02-10-2016', 'bgcolor': '#ffc310', 'color': '#000000', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false , 'highlightBorderColor' : '#000000'},
        { 'id': '3', 'initial': 'C', 'name': 'Event C', 'startDt': '01-07-2016', 'endDt': '01-08-2016', 'bgcolor': '#e67e22', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false , 'highlightBorderColor' : '#000000'},
        { 'id': '4', 'initial': 'D', 'name': 'Event D', 'startDt': '01-06-2016', 'endDt': '01-09-2016', 'bgcolor': '#e74c3c', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX', 'highlightBorder': false , 'highlightBorderColor' : '#000000'}
    ];

    self.insertSampleEvent = function () {
        self.sampleEvents = [
            { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-02-2016', 'endDt': '01-06-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
            { 'id': '2', 'initial': 'B', 'name': 'Event B', 'startDt': '01-02-2016', 'endDt': '01-02-2016', 'bgcolor': '#47a1de', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
            { 'id': '5', 'initial': 'E', 'name': 'Event E', 'startDt': '01-08-2016', 'endDt': '02-10-2016', 'bgcolor': '#ffc310', 'color': '#000000', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
            { 'id': '3', 'initial': 'C', 'name': 'Event C', 'startDt': '01-07-2016', 'endDt': '01-08-2016', 'bgcolor': '#e67e22', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
            { 'id': '4', 'initial': 'D', 'name': 'Event D', 'startDt': '01-06-2016', 'endDt': '01-09-2016', 'bgcolor': '#e74c3c', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
            { 'id': '6', 'initial': 'F', 'name': 'Event F', 'startDt': '01-16-2016', 'endDt': '01-19-2016', 'bgcolor': '#0073c6', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' }
        ];
        console.log(self.sampleEvents);
    }

    self.labelData = [
        {'dt': '01-02-2016','label': '09:00'},
        {'dt': '01-04-2016','label': '05:45'},
        {'dt': '01-08-2016','label': '12:00'},
        {'dt': '01-07-2016','label': '03:30'},
        {'dt': '01-06-2016','label': '01:00'},
        {'dt': '01-16-2016','label': '10:00'}
    ];

    self.dtPickerOptions = {
        //customClass: getDayClass,
        showWeeks: false,
        datepickerMode: 'day'
    };

    self.toggleModeCallBack = function (data) {
        console.log(data);
    }

    self.moveModeCallback = function (data) {
        console.log(data);
    }

    self.dtPickerOptions1 = {
        customClass: getDayClass,
        customIconClass:getIconClass,
        showWeeks: false,
        datepickerMode: 'day',
        'yearMapHeat': true,
        'preventModeToggle': true,
        'showMarkerForMoreEvents': true,
        'showDataLabel': true,
        'defaultDataLabel': '00:00',
        moveModeCallback: self.moveModeCallback
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
        'hideCalNav' : true
    };

    self.dtPickerOptionsMonth = {
        customClass: getDayClass,
        showWeeks: false,
        datepickerMode: 'month',
        'yearMapHeat': false,
        'preventModeToggle': true
    };

    self.popupSettings = {
        'hidden': false,
        'showLeft': false,
        'showRight': false,
        'leftLabel': 'Add Events',
        'rightLabel': 'Edit Details',
        'showWhenEventsEmpty': true
    };

    self.popupSettings2 = {
        'hidden': false,
        'showLeft': true,
        'showRight': true,
        'leftLabel': 'Add Events',
        'rightLabel': 'Edit Details',
        'showWhenEventsEmpty': true,
        'showDateInYearView': true
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

    self.eventClickCallback = function(data) {
        console.log('eventClickCallback');
        console.log(data);
    }

    self.today = function () {
        self.dt = new Date('01/09/2016');
    };
    self.today();

    self.clear = function () {
        self.dt = null;
    };

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