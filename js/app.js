// Initialize Firebase
const fbConfig = {
    apiKey: 'AIzaSyDZJ3xq812W69hjq46mddUOtehoor2__2I',
    authDomain: 'sport-code-off.firebaseapp.com',
    databaseURL: 'https://whats-on-b66fe.firebaseio.com',
    projectId: 'whats-on-b66fe',
    messagingSenderId: "475729333710",
    storageBucket: "whats-on-b66fe.appspot.com",
    messagingSenderId: "241621512943"
};
firebase.initializeApp(fbConfig);

const app = new Vue({
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
        getData: function() {
            
            let _this = this;

            _this.firebase.ref('/tasks').once('value').then(function(snapshot) {
                _this.tasks = snapshot.val();
            });
        },
        getHash: function( val ) {

            let _this = this;

            const regex = _this.hashRegex;
            const str = val;
            let match;

            while ((match = regex.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                return match[0];
            }
        },
        addTask: function() {

            let _this = this;

            let tag = _this.getHash( _this.newTaskLabel ) || '';

            _this.firebase.ref('/tasks').push({
                label: _this.newTaskLabel,
                tag: tag,
                complete: false,
                trash: false
            });

            _this.newTaskLabel = '';
            _this.getData();
        },
        completeTask: function( index, status ) {

            let _this = this;

            _this.firebase.ref('/tasks/' + index ).update({
                complete: status
            });

            _this.getData();
        },
        deleteTask: function( index ) {

            let _this = this;

            _this.firebase.ref('/tasks/' + index ).update({
                trash: true
            });

            _this.getData();
        },
        formattedLabel: function( task ) {

            let _this = this;
            let tagLink;

            if ( task.tag ) {
                tagLink = `<a href='${ task.tag }' v-on:click='filterList( task.tag )'>${ task.tag }</a>`;
                return task.label.replace( task.tag, tagLink );
            } else {
                return task.label;
            }
        },
        filterList: function( tag ) {
            
            let _this = this;

            _this.activeFilter = tag;
            let arr = [];

            Object.keys( _this.tasks ).forEach( function( key ) {

                const task = _this.tasks[ key ];

                if ( task.tag === tag ) {
                    arr.push( task );
                }              
            });

            _this.tasks = arr;
        },
        clearFilter: function() {

            let _this = this;

            _this.getData();
            _this.activeFilter = "";
        }
    },
    created: function() {

        let _this = this;

        _this.getData();
    }
});