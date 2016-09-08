angular.module('starter.controllers')
    .controller('EstabelecimentosViewCtrl',[
        '$scope','$state','$ionicTabsDelegate','$stateParams','$ionicLoading','UserData','Estabelecimentos', '$ionicPopup','$cart',
        function ($scope,$state, $ionicTabsDelegate, $stateParams,$ionicLoading,UserData,Estabelecimentos, $ionicPopup, $cart) {

            var idEstabelecimento = $stateParams.id;
            var cart = $cart.setKey('cart_'+idEstabelecimento);

            $scope.selectTabWithIndex = function(index) {
                $ionicTabsDelegate.select(index);
            }
            defaultQtd();
            $scope.estabelecimentos = [];
            $ionicLoading.show({
                template: 'Carregando...'
            });

            var estabelecimento = Estabelecimentos.query({id:idEstabelecimento,include:'endereco,entrega,produtos,funcionamentos'}).$promise;
            estabelecimento.then(function(data){
                $scope.item = data.data;
                return Estabelecimentos.estabelecimentobycategory({id:idEstabelecimento}).$promise;
            }).then(function (data) {
                $scope.categories = data.data;
                $ionicLoading.hide();
            },function (dataError) {
                $ionicLoading.hide();
            });

            $scope.addItem = function (item) {
                item.qtd =1;
                $cart.addItem(item);
                $state.go('client.checkout');
            };
            
            $scope.addItem = function (item) {
                //item.qtd =1;
                //$cart.addItem(item);
                //$state.go('client.checkout');
                var myPopup = $ionicPopup.show({
                    templateUrl: 'templates/client/includeEstabelecimentos/formEstabelecimento.html',
                    title: item.name,
                    subTitle: item.description+' <b class="balanced">R$'+item.price+'</b>',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancelar' },
                        {
                            text: '<b>Adicionar</b>',
                            type: 'button-assertive',
                            onTap: function(e) {
                                //console.log(e);
                                return parseInt($scope.data.qtd);
                            }
                        }
                    ]
                });

                myPopup.then(function(res) {
                    if(res) {
                        if (parseInt(res) < 1) {
                            $ionicPopup.alert({
                                title: 'Adivertência',
                                template: 'Quantidade invalida!'
                            });
                            defaultQtd();
                            return;
                        }

                        item.qtd = parseInt(res);
                        item.observacoes = $scope.data.observacoes;
                        cart.addItem(item);
                        $ionicPopup.alert({
                            title: 'Adivertência',
                            template: 'Item adcionado ao carrinho'
                        });

                    }
                    defaultQtd();
                });
            };
            $scope.goCheckout = function () {
                $state.go('client.checkout',{id:idEstabelecimento});
            }
            function defaultQtd() {
                $scope.data = {
                    qtd:1,
                    observacoes:null
                };
            }
        }]);