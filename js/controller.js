let id ;	
angular.module('myApp').controller('authCtrl', 
								  [	 
								  	'$firebaseAuth', '$location',
								  	iWillRuleOverTheWorld
								  ]);
var globalAuth;


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
	   firebase.database().ref().child('USerData').set({
		BigData: authData
		
	});
	  if(authData) {
		globalAuth = authData;
		console.log('ffff',authData);
	 	$location.url("login");
		$scope.$apply(); 
	}
	});

	
	};
	myApp.controller('mainController', function ($scope) {

	})
	myApp.controller('loginCtrl', function ($scope) {
		console.log("ttttlenta",globalAuth);
	});
	myApp.controller('databaseCtrl', function ($firebaseObject) {
		// const rootRef = firebase.database().ref().child('geodata');
		// const ref = rootRef.child('object');
		// this.object = $firebaseObject(ref);
		var geoCordinates = JSON.parse(window.localStorage.getItem('location'));
		firebase.database().ref().child('location').set({
			latitidude: geoCordinates.latitude,
			longitude: geoCordinates.longitude
		});
	});


firebase.auth().onAuthStateChanged((user) => {
	if (user) {
	  console.log('rrr',user.uid);
	  id = user.uid;
	  console.log(1111,id);

	  firebase.database().ref().child('accounts').set({
	
		userId: id
	  })
	  console.log(1111,id);
	}
  });
//   firebase.database().ref().child('accounts').push({
	
// 	userId: id
//   })
document.addEventListener('DOMContentLoaded', function () {console.log(1111,id);
 
});






