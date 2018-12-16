var myApp = angular.module('myApp', ['firebase', 'ngRoute']);
myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "src/home.html",
            controller: 'mainController'
        })
        .when("/login", {
            templateUrl: "src/login.html",
            controller: "loginCtrl"
        });
});
var users_list = [];
var users_coords = {};
var users_names = {};
//var latlong = null;
//var geoArray = [];


for (var i = 0; i < 10; i++) {
    var bot_name = "bot_" + parseInt(i, 10);
    console.log(bot_name);

    //firebase.database().ref().child("accounts").push({
    //    userId: bot_name,
    //    name : "Test bot #" + parseInt(i, 10)
    //});

    firebase.database().ref().child(bot_name).set({
        latitidude: 56 + Math.random() * 1,
        longitude:  13 + Math.random() * 2
    });
}

function get_coords_by_uid(user_id){    
    console.log("trying to get coordinates for ", user_id);
 
    firebase.database().ref().child(user_id).on('value', function (snapshot) {
        console.log(snapshot.val());
        //latlong = snapshot.val();

        //console.log("Здесь мы должны получить geo" , latlong);
        //geoArray = Object.values(latlong);
        //console.log(geoArray)       
        users_coords[user_id] = snapshot.val();
    }, function(error){ 
        console.log("Error:" + error.code)
    });
};
	
		function init() {
            console.log("User coordinates :", users_coords);

			var myMap = new ymaps.Map("map", {
					center: [56.064188, 12.717836

                    ],
                    zoom: 18
                    
				}, {
					searchControlProvider: 'yandex#search'
				});
			var yellowCollection = new ymaps.GeoObjectCollection(null, {
					preset: 'islands#yellowIcon'
				});
				//blueCollection = new ymaps.GeoObjectCollection(null, {
				//	preset: 'islands#blueIcon'
                //}),   
            
                console.log("Placing coords on the map...", users_coords)

            for (var key in users_coords){
                console.log(key, users_coords[key]);
                var lon = users_coords[key]["longitude"];
                var lan = users_coords[key]["latitidude"];

                console.log("My Random Coords", lan, lon)

				yellowCollection.add(new ymaps.Placemark([lan, lon ],{
                    balloonContentBody: [
                        '<address>',
                        '<strong>' + users_names[key] + '</strong>',
                        '<br/>',
                        '</address>'
                    ].join('')
                }, {
                    preset: 'islands#yellowIcon'
                }));
			}
            
		
		    myMap.geoObjects.add(yellowCollection);
            yellowCollection.events.add('click', function (e) {console.log("jdnckdjncksjncksnck")
            document.getElementById("boss-contaier").classList.remove('unvisible');
            document.getElementById("boss-contaier").classList.add('fade-in');});
			// Через коллекции можно подписываться на события дочерних элементов.
			//yellowCollection.events.add('click', function () { alert('Кликнули по желтой метке') });
			//blueCollection.events.add('click', function () { alert('Кликнули по синей метке') });
		
			// Через коллекции можно задавать опции дочерним элементам.
			//blueCollection.options.set('preset', 'islands#blueDotIcon');
		}
    
setTimeout(function(e) {
    ymaps.ready(init);
}, 7000);
	

var subBut = document.getElementById('submit');
if (subBut) {
    subBut.addEventListener('click', function(){
        if (subBut)  {
         console.log(subBut.value());   
        } else {
            
        }
    })
}
 



console.log (window.location.href );


window.onload = function () {
    setTimeout(function(e) {
        console.log("Getting users coords from database")
        console.log("Users list :", users_list)
        for(var i = 0; i < users_list.length; i ++) {
            get_coords_by_uid(users_list[i]);
        }
    }, 3000);

    navigator.geolocation.getCurrentPosition(function (location) {
        var latitude = location.coords.latitude;
        var longitude = location.coords.longitude;
        console.log(latitude, longitude);
        window.localStorage.setItem('location', JSON.stringify({latitude: latitude, longitude: longitude}));
        
    })

 
    firebase.database().ref().child("accounts").orderByChild("userId").on("value", function(snapshot) {
        console.log("Sending requrest for user ids")
        snapshot.forEach(function(uid) {
            var current_uid = uid.val()['userId'];
            var current_name = uid.val()["name"];
            //var coords = get_coords_by_uid(current_uid);
            //console.log(current_uid, coords);
            console.log(current_uid);
            users_list.push(current_uid);
            users_names[current_uid] = current_name;
        });
            console.log("User list was obtained");
    });

}

		
placemark.events.add('click', function (e) {console.log("jdnckdjncksjncksnck")});
'use strict';

// Signs-in Friendly Chat.
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  // Loads the last 12 messages and listen for new ones.
  var callback = function(snap) {
    var data = snap.val();
    displayMessage(snap.key, data.name, data.text, data.profilePicUrl, data.imageUrl);
  };

  firebase.database().ref('/messages/').limitToLast(12).on('child_added', callback);
  firebase.database().ref('/messages/').limitToLast(12).on('child_changed', callback);
}

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  // Add a new message entry to the Firebase database.
  return firebase.database().ref('/messages/').push({
    name: getUserName(),
    text: messageText,
    profilePicUrl: getProfilePicUrl()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {
  // 1 - We add a message with a loading icon that will get updated with the shared image.
  firebase.database().ref('/messages/').push({
    name: getUserName(),
    imageUrl: LOADING_IMAGE_URL,
    profilePicUrl: getProfilePicUrl()
  }).then(function(messageRef) {
    // 2 - Upload the image to Cloud Storage.
    var filePath = firebase.auth().currentUser.uid + '/' + messageRef.key + '/' + file.name;
    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image’s URL.
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath
        });
      });
    });
  }).catch(function(error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  });
}

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    saveMessagingDeviceToken();
  }).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Displays a Message in the UI.
function displayMessage(key, name, text, picUrl, imageUrl) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    messageListElement.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// initialize Firebase
initFirebaseAuth();

// We load currently existing chat messages and listen to new ones.
loadMessages();
