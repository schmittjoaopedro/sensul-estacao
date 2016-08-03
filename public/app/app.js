var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('WeatherController', function WeatherController($scope) {

  $scope.ws = new WebSocket("ws://" + window.location.host + "/resources/ws/sensor");

  $scope.ws.onopen = function (ev) {
    console.log("[ws open]");
    reconnect = true;
  }

  $scope.ws.onclose = function (ev) {
    console.log("[ws close]");
    if(reconnect) {
      startWebSocket();
      reconnect = false;
    }
  }

  $scope.ws.onmessage = function (ev) {
    console.log("[ws message]");
    var payload = JSON.parse(ev.data);
    $scope.updateData(payload);
  }

  $scope.updateData = function (payload) {
    console.info(payload);
    $scope.data = payload;
    if(!$scope.$$phase){
      $scope.$apply();
    }
  }

});
