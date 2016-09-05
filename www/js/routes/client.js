angular.module('starter').config(
    function ($stateProvider,$urlRouterProvider,OAuthProvider,OAuthTokenProvider,appConfig,$provide) {
    "use strict";
        $stateProvider.state('client',{
            cache:false,
            abstract:true,
            url:'/client',
            templateUrl:'templates/client/menu.html',
            controller:'ClientMenuCtrl'
        })
            .state('client.order',{
                url:'/order',
                templateUrl:'templates/client/order.html',
                controller:'ClientOrderCtrl'
            }).state('client.checkout',{
            cache:false,
            url:'/checkout',
            templateUrl:'templates/client/checkout.html',
            controller:'ClientCheckoutCtrl'
        })
            .state('client.checkout_item_detail',{
                url:'/checkout/detail/:index',
                templateUrl:'templates/client/checkout_item_detail.html',
                controller:'ClientCheckoutDetailCtrl'
            })
            .state('client.checkout_successfull',{
                cache:false,
                url:'/checkout/successfull',
                templateUrl:'templates/client/checkout_successfull.html',
                controller:'ClientCheckoutSuccessfull'
            })
            .state('client.view_products',{
                url:'/view_products',
                templateUrl:'templates/client/view_products.html',
                controller:'ClientViewProductCtrl'
            })
            .state('client.view_order',{
                cache:false,
                url:'/view_order/:id',
                templateUrl:'templates/client/view_order.html',
                controller:'ClientViewOrderCtrl'
            })
            .state('client.view_delivery',{
                cache:false,
                url:'/view_delivery/:id',
                templateUrl:'templates/client/view_delivery.html',
                controller:'ClientViewDeliveryCtrl'
            })
            .state('client.estabelecimentos',{
                url:'/estabelecimentos',
                templateUrl:'templates/client/estabelecimentos.html',
                controller:'EstabelecimentosCtrl'
            })
            .state('client.estabelecimentos_view',{
                url:'/estabelecimentos_view',
                templateUrl:'templates/client/estabelecimentos_view.html',
                controller:'EstabelecimentosViewCtrl'
            });
    });
