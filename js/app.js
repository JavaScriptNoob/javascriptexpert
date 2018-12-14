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
var latlong = null;
var geoArray = [];




   



function get_coords_by_uid(user_id){    
    console.log("trying to get coordinates for ", user_id);
 
    firebase.database().ref().child(user_id).on('value', function (snapshot) {
        console.log(snapshot.val());
        latlong = snapshot.val();

        console.log("Здесь мы должны получить geo" , latlong);
        geoArray = Object.values(latlong);
        console.log(geoArray)       
        users_coords[user_id] = snapshot.val();
    },function(error){ 
        console.log("Error:" +error.code)
    });
};
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



    // var location = document.getElementById('get-location');
    // location.addEventListener('click', function () {
    //     console.log("firebase", firebase);

        
    //     console.log('users_list', users_list.length);
    //     for(var i = 0; i < users_list.length; i++) {
    //         get_coords_by_uid(users_list[i]);
    //     }
    //     var getUid;
    //     var ourUid;
    //     setTimeout(function () {
    //         /*Code to place coords on the map should be  */
    //         console.log(users_coords);
    //         for(var key in users_coords){
    //            ourUid =  key;  
    //         //    console.log(Object.keys(users_coords).map(key => srcObject[key].longitude)); 
    //         }
    //     }, 2000);
    //     console.log(ourUid);
       
        
    // });


window.onload = function () {
    navigator.geolocation.getCurrentPosition(function (location) {
        var latitude = location.coords.latitude;
        var longitude = location.coords.longitude;
        console.log(latitude, longitude);
        window.localStorage.setItem('location', JSON.stringify({latitude: latitude, longitude: longitude}));
        
    })

 
    firebase.database().ref().child("accounts").orderByChild("userId").on("value", function(snapshot) {
        snapshot.forEach(function(uid) {
            var current_uid = uid.val()['userId'];
            //var coords = get_coords_by_uid(current_uid);
            //console.log(current_uid, coords);
            console.log(current_uid);
            users_list.push(current_uid)
        });
    });
}



console.log('куки', document.cookie);
// if(
//     window.location.href=="address to check"
//     ){ymaps.ready(init);
//         geolocation.get({
//             provider: 'browser',
//             mapStateAutoApply: true
//         }).then(function (result) {
//             // Синим цветом пометим положение, полученное через браузер.
//             // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
//             result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
//             myMap.geoObjects.add(result.geoObjects);
//             function init() {
//                 var geolocation = ymaps.geolocation,
//                     myMap = new ymaps.Map('map', {
//                         center: [55, 34],
//                         zoom: 10
//                     }, {
//                         searchControlProvider: 'yandex#search'
//                     });
                
            
            
//                 // Сравним положение, вычисленное по ip пользователя и
//                 // положение, вычисленное средствами браузера.
//                 geolocation.get({
//                     provider: 'yandex',
//                     mapStateAutoApply: true
//                 }).then(function (result) {
//                     // Красным цветом пометим положение, вычисленное через ip.
//                     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
//                     result.geoObjects.get(0).properties.set({
//                         balloonContentBody: 'Мое местоположение'
//                     });
//                     myMap.geoObjects.add(result.geoObjects);
//                 })}
        