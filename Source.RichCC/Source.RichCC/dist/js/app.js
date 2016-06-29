angular.module('richCCSample', ['richcc.bootstrap.datepicker', 'FredrikSandell.worker-pool'])
.run(['WorkerService',(function (WorkerService) {
    //WorkerService.setAngularUrl('/lib/angular.min.js');
    console.log(WorkerService);
    WorkerService.setAngularUrl('https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.min.js');
    //WorkerService.addDependency('', 'richCCSample', '');
})])
.controller('richCCController', ["$scope", "$timeout", "WorkerService", function ($scope, $timeout, WorkerService) {
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
        'preventModeToggle': true,
        enableWebWorkers: true
    };

    self.popupSettings = {
        'hidden': false,
        'showLeft': true,
        'showRight': true,
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

    //var workerPromise = WorkerService.createAngularWorker(['input', 'output' /*additional optional deps*/,
    //function (input, output /*additional optional deps*/) {
    //    // This contains the worker body.
    //    // The function must be self contained. The function body will be 
    //    // converted to source and passed to the worker.  
    //    // The input parameter is what will be passed to the worker when
    //    // it is executed. It must be a serializable object.
    //    // The output parameter is a promise and is what the 
    //    // worker will return to the main thread.  
    //    // All communication from the worker to the main thread is performed
    //    // by resolving, rejecting or notifying the output promise.
    //    // We may optionally depend on other angular services. 
    //    // These services can be used just as in the main thread. 
    //    // But be aware that no state changes in the angular services in the
    //    // worker are propagates to the main thread. Workers run in fully isolated
    //    // contexts. All communication must be performed through the output parameter.
    //    console.log(input);
    //    output.resolve('hgouyuigu');
    //    console.log(output);
    //}]);

    //workerPromise.then(function success(angularWorker) {
    //    //The input must be serializable  
    //    return angularWorker.run('hello');
    //}, function error(reason) {
    //    console.log('error');
    //    console.log(reason);
    //    //for some reason the worker failed to initialize  
    //    //not all browsers support the HTML5 tech that is required, see below.  
    //}).then(function success(result) {
    //    console.log('result');
    //    console.log(result);
    //    //handle result  
    //}, function error(reason) {
    //    //handle error  
    //}, function notify(update) {
    //    //handle update  
    //});

    //workerPromise.then(function success(angularWorker) {
    //    //The input must be serializable  
    //    return angularWorker.run('hello2');
    //}, function error(reason) {
    //    console.log('error2');
    //    console.log(reason);
    //    //for some reason the worker failed to initialize  
    //    //not all browsers support the HTML5 tech that is required, see below.  
    //}).then(function success(result) {
    //    console.log('result2');
    //    console.log(result);
    //    //handle result  
    //}, function error(reason) {
    //    //handle error  
    //}, function notify(update) {
    //    //handle update  
    //});

}]);