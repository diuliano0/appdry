// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter.controllers',[]);
angular.module('starter.services',[]);
angular.module('starter.filters',[]);
angular.module('starter', [
  'ionic',  'starter.controllers',  'starter.services',  'starter.filters',  'angular-oauth2',  'ngResource',  'ngCordova',  'uiGmapgoogle-maps',
  'pusher-angular', 'ionic-datepicker','ionic.rating'
])
    .constant('appConfig',{
      baseUrl:'http://localhost:8000',
      pusherKey:'5af096247925712d9f40',
      db:null
    })
    .run(function ($ionicPlatform,$window,appConfig,$localStorage,$ionicPopup,$cordovaSQLite,$ionicHistory) {
      $window.client = new Pusher(appConfig.pusherKey);
      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }

          appConfig.db = $cordovaSQLite.openDB({ name: "delivery.db", iosDatabaseLocation:'default'});
          //IOS
          //appConfig.db = window.sqlitePlugin.openDatabase({ name: "testDB.db", location: 2, createFromLocation: 1}); ;

          $cordovaSQLite.execute(appConfig.db, "CREATE TABLE IF NOT EXISTS " +
              "card (" +
              "id integer primary key, " +
              "user_id integer, " +
              "nome varchar(80), " +
              "cpf varchar(80), " +
              "cartao_numero varchar(80), " +
              "mes varchar(80), " +
              "ano varchar(80), " +
              "cidade varchar(80), " +
              "estado varchar(80), " +
              "endereco varchar(80), " +
              "numero varchar(80), " +
              "complemento varchar(80), " +
              "bairro varchar(80), " +
              "cep varchar(80)" +
              ")");

          //$cordovaSQLite.deleteDB({ name: "delivery.db", iosDatabaseLocation:'default'});
        Ionic.io();
        var push = new Ionic.Push({
          debug:true,
          onNotification:function (message) {
            $ionicPopup.alert({
              title: 'Adivertência',
              template: message.text
            });
          }
        });
        push.register(function (token) {
          $localStorage.set('device_token',token.token);
        });
      });
        $ionicPlatform.registerBackButtonAction(function(e) {
            e.preventDefault();
            function showConfirm() {
                var confirmPopup = $ionicPopup.show({
                    title : 'Sair do Rango Delivery?',
                    template : 'Tem certeza de que deseja sair do Rango Delivery?',
                    buttons : [{
                        text : 'Cancelar',
                        type : 'button-assertive button-outline',
                    }, {
                        text : 'Sair',
                        type : 'button-assertive',
                        onTap : function() {
                            ionic.Platform.exitApp();
                        }
                    }]
                });
            };
            console.log($ionicHistory.backView());
            // Is there a page to go back to?
            if ($ionicHistory.backView()) {
                // Go back in history
                $ionicHistory.backView().go();
            } else {
                // This is the last page: Show confirmation popup
                showConfirm();
            }

            return false;
        }, 101);

    }).config(function ($stateProvider,$urlRouterProvider,OAuthProvider,OAuthTokenProvider,appConfig,$provide,ionicDatePickerProvider) {

    var datePickerObj = {
        inputDate: new Date(),
        setLabel: 'Selecionar',
        todayLabel: 'Hoje',
        closeLabel: 'Fechar',
        mondayFirst: false,
        weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthsList: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        defaultNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novenbro", "Dezembro"],
        templateType: 'popup',
        from: new Date(2012, 8, 1),
        to: new Date(2018, 8, 1),
        showTodayButton: true,
        dateFormat: 'dd MMMM yyyy',
        closeOnSelect: false,
        disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
      OAuthProvider.configure({
        baseUrl: appConfig.baseUrl,
        clientId: 'appid01',
        clientSecret: 'secret', // optional
        grantPath: '/oauth/access_token'
      });
      OAuthTokenProvider.configure({
        name: 'token',
        options: {
          secure: false
        }
      });
      $stateProvider
      .state('home',{
        url:'/home',
        templateUrl:'templates/home.html',
        controller:function ($scope) {

        }
      });
  // redirecionamento padrão
  $urlRouterProvider.otherwise('/guest-home');

  $provide.decorator('OAuthToken',['$localStorage','$delegate',function ($localStorage,$delegate) {
    Object.defineProperties($delegate,{
      setToken:{
        value:function (data) {
          return $localStorage.setObject('token',data);
        },
        enumerable:true,
        configurable:true,
        writable:true
      },
      getToken:{
        value:function () {
          return $localStorage.getObject('token');
        },
        enumerable:true,
        configurable:true,
        writable:true
      },
      removeToken:{
        value:function () {
          return $localStorage.getObject('token',null);
        },
        enumerable:true,
        configurable:true,
        writable:true
      }
    });
    return $delegate;
  }]);
}).service('cart',function () {
  this.items = [];
});
