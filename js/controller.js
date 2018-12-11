
angular.module('myApp').controller('authCtrl', 
								  [	 
								  	'$firebaseAuth', '$location',
								  	iWillRuleOverTheWorld
								  ]);

function iWillRuleOverTheWorld ($firebaseAuth,$location) {
	var someOccupiedCountries = this;
	var auth = $firebaseAuth();

	someOccupiedCountries.login = function(){
	    auth.$signInWithPopup('google');
	};

	someOccupiedCountries.logout = function(){
	    auth.$signOut();
	};
	
	auth.$onAuthStateChanged(function(authData ){
	   someOccupiedCountries.author = authData;
	   //console.log(authData);
	   if (authData) {
		$location.url("login");
		$scope.$apply(); 
	}
	});

	
	};
	myApp.controller('mainController', function ($scope) {

	})
	myApp.controller('loginCtrl', function ($scope) {
	
	});
	myApp.controller('databaseCtrl', function ($firebaseObject) {
		// const rootRef = firebase.database().ref().child('geodata');
		// const ref = rootRef.child('object');
		// this.object = $firebaseObject(ref);
		var geoCordinates = JSON.parse(window.localStorage.getItem('location'))
		firebase.database().ref().child('location').update({
			latitidude: geoCordinates.latitude,
			longitude: geoCordinates.longitude
		});
	});









