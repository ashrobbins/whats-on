'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Initialize Firebase
var fbConfig = _defineProperty({
    apiKey: 'AIzaSyDZJ3xq812W69hjq46mddUOtehoor2__2I',
    authDomain: 'sport-code-off.firebaseapp.com',
    databaseURL: 'https://whats-on-b66fe.firebaseio.com',
    projectId: 'whats-on-b66fe',
    messagingSenderId: "475729333710",
    storageBucket: "whats-on-b66fe.appspot.com"
}, 'messagingSenderId', "241621512943");
firebase.initializeApp(fbConfig);

var app = new Vue({
    el: "#app",
    data: {
        name: 'ash',
        firebase: firebase.database(),
        tasks: [],
        newTaskLabel: '',
        hashRegex: /#\w+/g,
        activeFilter: ''
    },
    methods: {
        getData: function getData() {

            var _this = this;

            _this.firebase.ref('/tasks').once('value').then(function (snapshot) {
                _this.tasks = snapshot.val();
            });
        },
        getHash: function getHash(val) {

            var _this = this;

            var regex = _this.hashRegex;
            var str = val;
            var match = void 0;

            while ((match = regex.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                return match[0];
            }
        },
        addTask: function addTask() {

            var _this = this;

            var tag = _this.getHash(_this.newTaskLabel) || '';

            _this.firebase.ref('/tasks').push({
                label: _this.newTaskLabel,
                tag: tag,
                complete: false,
                trash: false
            });

            _this.newTaskLabel = '';
            _this.getData();
        },
        completeTask: function completeTask(index, status) {

            var _this = this;

            _this.firebase.ref('/tasks/' + index).update({
                complete: status
            });

            _this.getData();
        },
        deleteTask: function deleteTask(index) {

            var _this = this;

            _this.firebase.ref('/tasks/' + index).update({
                trash: true
            });

            _this.getData();
        },
        formattedLabel: function formattedLabel(task) {

            var _this = this;
            var tagLink = void 0;

            if (task.tag) {
                tagLink = '<a href=\'' + task.tag + '\' v-on:click=\'filterList( task.tag )\'>' + task.tag + '</a>';
                return task.label.replace(task.tag, tagLink);
            } else {
                return task.label;
            }
        },
        filterList: function filterList(tag) {

            var _this = this;

            _this.activeFilter = tag;
            var arr = [];

            Object.keys(_this.tasks).forEach(function (key) {

                var task = _this.tasks[key];

                if (task.tag === tag) {
                    arr.push(task);
                }
            });

            _this.tasks = arr;
        },
        clearFilter: function clearFilter() {

            var _this = this;

            _this.getData();
            _this.activeFilter = "";
        }
    },
    created: function created() {

        var _this = this;

        _this.getData();
    }
});