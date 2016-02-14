# RichCC (v1.0)

A rich calendar control for visualizing events implemented on top of AngularJS UI Bootstrap's Datepicker plugin.

##Demo

Sample  Preview @ <a href="http://richcc.azurewebsites.net/">http://richcc.azurewebsites.net/</a>


##Sample Code Blocks

####Intializing Events
    [
        { 'id': '1', 'initial': 'A', 'name': 'Event A', 'startDt': '01-02-2016', 'endDt': '01-06-2016', 'bgcolor': '#2ecc71', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        { 'id': '2', 'initial': 'B', 'name': 'Event B', 'startDt': '01-02-2016', 'endDt': '01-02-2016', 'bgcolor': '#47a1de', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        { 'id': '5', 'initial': 'E', 'name': 'Event E', 'startDt': '01-10-2016', 'endDt': '02-10-2016', 'bgcolor': '#ffc310', 'color': '#000000', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        { 'id': '3', 'initial': 'C', 'name': 'Event C', 'startDt': '01-07-2016', 'endDt': '01-08-2016', 'bgcolor': '#e67e22', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' },
        { 'id': '4', 'initial': 'D', 'name': 'Event D', 'startDt': '01-06-2016', 'endDt': '01-09-2016', 'bgcolor': '#e74c3c', 'color': '#ffffff', 'subject': 'Will not have have access to e-mails. You can contact me on XXX-XXX-XXXX' }
    ];

####Adding Tags
    <richcc-datepicker datepicker-mode="'day'" ng-model="sample.dt" year-map-heat="true" events="sample.sampleEvents" show-weeks="false" class="well well-sm"></richcc-datepicker>

####Showing Light Mode - 'light'
    <richcc-datepicker ng-model="sample.dt" light="true" events="sample.sampleEvents" event-popup-hide="false" prevent-cal-nav="true" show-weeks="false" class="well well-sm"></richcc-datepicker>

####Showing Light Mode With Event Pop Up Hidden - 'eventPopupHide'
    <richcc-datepicker ng-model="sample.dt" light="true" events="sample.sampleEvents" event-popup-hide="false" prevent-cal-nav="true" show-weeks="false" class="well well-sm"></richcc-datepicker>

####For Events map on Month Mode
    <richcc-datepicker datepicker-mode="'day'" ng-model="sample.dt" year-map-heat="false" events="sample.sampleEvents" show-weeks="false" class="well well-sm"></richcc-datepicker>

####Defaulting to Month View
    <richcc-datepicker datepicker-mode="'month'" ng-model="sample.dt" year-map-heat="false" events="sample.sampleEvents" show-weeks="false" class="well well-sm"></richcc-datepicker>

##Capabilities

1.  View events for all days in a month

    <img src="Source.RichCC\Source.RichCC\images\1.png " />

2.  View events for a day 

    <img src="Source.RichCC\Source.RichCC\images\2.png " />

3.  View events for all days in a month with light mode enabled

    <img src="Source.RichCC\Source.RichCC\images\3.png " />

4.  View events for all months in a year

    <img src="Source.RichCC\Source.RichCC\images\5.png " />

4.  View events for all months in a year in a heat map mode (inspired by GitHub)

    <img src="Source.RichCC\Source.RichCC\images\4.png " />

##Adding dependency to your project
    angular.module('myModule', ['richcc.bootstrap.datepicker']);

##Note
Since all modules have been built by refactoring the Angular JS UI BootStrap's Datepicker module, the module name for the plugin have been changed so as to mitigate/prevent any instance clash.




