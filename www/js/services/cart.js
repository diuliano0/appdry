angular.module('starter.services')
    .service('$cart', ['$localStorage','Cupom', function ($localStorage,Cupom) {
        var key = 'cart',cartAux = $localStorage.getObject(key);

        if(!cartAux){
            initCart();
        }

        this.setKey = function (addkey) {
            key = addkey;
            if(!$localStorage.getObject(key))
                initCart();

            return this;
        }

        this.clear = function () {
            initCart();
        };

        this.get = function () {
            return $localStorage.getObject(key);
        };

        this.getItem = function (i) {
            return this.get().items[i];
        };

        this.addItem = function (item) {
            var cart = this.get(), itemAux, exists=false;

            for (var index in cart.items) {
                itemAux = cart.items[index];
                if (itemAux.id == item.id) {
                    itemAux.qtd = itemAux.qtd + item.qtd;
                    itemAux.subtotal = calculateSubTotal(itemAux);
                    exists = true;
                    break;
                }
            }
            if(!exists){
                item.subtotal = calculateSubTotal(item);
                cart.items.push(item);
            }
            cart.total = getTotal(cart.items);
            $localStorage.setObject(key,cart);
        };

        this.removeItem = function (i) {
            var cart = this.get();
            cart.items.splice(i,1);
            cart.total = getTotal(cart.items);
            $localStorage.setObject(key,cart);

        };
        
        this.updateQtd = function (i,qtd) {
            var cart = this.get(), itemAux = cart.items[i];
            itemAux.qtd = qtd;
            itemAux.subtotal = calculateSubTotal(itemAux);
            cart.total = getTotal(cart.items);
            $localStorage.setObject(key,cart);
        }
        
        this.setCupom = function (code, value) {
            var cart = this.get();
            cart.cupom = {
                code:code,
                value:value
            };
            $localStorage.setObject(key,cart);
        };
        
        this.removeCupom = function () {
            var cart = this.get();
            cart.cupom = {
                code:null,
                value:0
            };
            $localStorage.setObject(key,cart);

        };

        this.getTotalFinal = function () {
            var cart = this.get();
            cart.total += cart.taxa;
            return cart.total -=(cart.cupom.value || 0);
        }

        this.getSubTotal = function () {
            var cart = this.get();
            return getTotal(cart.items);
        }
        
        this.setAddressDelivery = function (address) {
            var cart = this.get();
            cart.delivery_address = address;
            $localStorage.setObject(key,cart);
        }
        
        function calculateSubTotal(item) {
            return item.price * item.qtd;
        }

        function getTotal(items){
            var sum = 0;
           angular.forEach(items,function(item){
               sum += item.subtotal;
           });
            return sum;
        }

        function initCart(){
            $localStorage.setObject(key, {
                items: [],
                delivery_address:{},
                total: 0,
                taxa: 0,
                cupom:{
                    code:null,
                    value:0
                }
            });
        }
    }]);
