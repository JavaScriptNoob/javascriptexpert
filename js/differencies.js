angular.module('chatApp')
.controller('ChatCtrl', ['chatService', '$firebaseAuth', chatCtrl]);

function chatCtrl(chatService, $firebaseAuth){
    var vm = this;
    var auth = $firebaseAuth();

    // vm.messages = chatService.getMessages();
    // vm.messagesToShow = chatService.getMessagesToShow();

    // vm.addMessage = function(){
    //     if( vm.author != null ){
    //         var message = {
    //             authorId: vm.author.uid,
    //             author: vm.author.displayName,
    //             authorImg: vm.author.photoURL,
    //             message: vm.newMessage
    //         }
    //     }else{
    //         alert('Санала зарегистрируйтесь');
    //     }
    //     if( vm.newMessage != '' ){
    //         chatService.addMessage(message);
    //         vm.newMessage = '';
    //     }else{
    //         alert('Введите сообщение')
    //     }
    // }
    
    vm.login = function(){
        auth.$signInWithPopup('google');
    };
    vm.logout = function(){
        auth.$signOut();
    };

    auth.$onAuthStateChanged(function(authData) {
        vm.author = authData;
    });
    
}


