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




ymaps.ready(init);

function init() {
    var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [55, 34],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Сравним положение, вычисленное по ip пользователя и
    // положение, вычисленное средствами браузера.
    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
        // Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение'
        });
        myMap.geoObjects.add(result.geoObjects);
    });
    var location = document.getElementById('get-location');
    location.addEventListener('click', function () {
        geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            // Синим цветом пометим положение, полученное через браузер.
            // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
            result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
            myMap.geoObjects.add(result.geoObjects);
        });
    });

}
window.onload = function () {
    var geo = document.getElementById('get-current-location');
    console.log(geo);
    geo.addEventListener('click', function () {
        navigator.geolocation.getCurrentPosition(function (location) {
            var latitude = location.coords.latitude;
            var longitude = location.coords.longitude;
            console.log(latitude, longitude);
            window.localStorage.setItem('location', JSON.stringify({latitude: latitude, longitude: longitude}));
        })
    })
}