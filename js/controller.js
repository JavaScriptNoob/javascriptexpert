	
angular.module('myApp').controller('authCtrl', 
								  [	 
								  	'$firebaseAuth', '$location',
								  	iWillRuleOverTheWorld
								  ]);
 var globalAuth;
 var userDateSaved;
 var imageUrl;
 var id;
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
 	//    firebase.database().ref().child('UserData').push({
 	// 	takedata: authData
	//	
 	// });
 	  if(authData) {
 		globalAuth = authData;
		 userDateSaved = globalAuth.displayName;
		 
		imageUrl =globalAuth.photoUrl;
		
 		console.log('ffff',imageUrl, userDateSaved);
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
 		 const rootRef = firebase.database().ref().child('geodata');
 		 const ref = rootRef.child('object');
 		 this.object = $firebaseObject(ref);
 		var geoCordinates = JSON.parse(window.localStorage.getItem('location'));
 		firebase.database().ref().child(id).set({
 			latitidude: geoCordinates.latitude,
 			longitude: geoCordinates.longitude
 		});
 	});



 firebase.auth().onAuthStateChanged((user) => {
 	if (user) {
 	  console.log('rrr',user);
 	  id = user.uid;
 	  console.log(1111,id);
 	  document.cookie = id;
 	   console.log("cccc", document.cookie);
		//push_username_to_database(id, globalAuth.displayName);
 		
 	  firebase.database().ref().child('accounts').orderByChild("userId").equalTo(id).once("value", function (snapshot) {
 		var alreadyExists = false; 
 		snapshot.forEach(function (child) {
 			alreadyExists = true;
 		  });
 		if(!alreadyExists) {
 			console.log("Creating new user ");
 			firebase.database().ref().child('accounts').push({
				 userId: id,
				 name: globalAuth.displayName
 		   });
 		}  
	   });
	   
	   


 	}
   });



 document.addEventListener('DOMContentLoaded', function () {console.log(1111,id);
 
 });
  function valid (form,$location){
 var name = form.textarea.value;



  for(var key in form.selectChoice) {
  	console.log(key);
  	console.log(form.selectChoice[key]);
  }

 var index = form.selectChoice.options.selectedIndex;
 var selection = form.selectChoice.options[index].innerText;


//  document.getElementById('submit').addEventListener('click', function(e){
//  	console.log(1);
//  	$location.url("login");
//  	$scope.$apply(); 
//  });

//  document.getElementById('submit').addEventListener('click', function(e){
//  	console.log(1);
//  	$location.url("login");
//  	$scope.$apply(); 
//  });

 };

