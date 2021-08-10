// configure our routes
angular.module('awApp').config(function($stateProvider, $urlServiceProvider) {

   $urlServiceProvider.rules.otherwise({ state: 'home' });

   $stateProvider.state('universe', {
     url: '/universe',
     component: 'universe',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('welcome', {
     url: '/welcome',
     component: 'welcome',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('client', {
     url: '/client',
     component: 'client',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('portal', {
     url: '/portal',
     component: 'portal',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });


   $stateProvider.state('chat', {
     url: '/chat',
     component: 'chat',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });




   $stateProvider.state('a1', {
     url: '/a1',
     component: 'a1',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });


   $stateProvider.state('c1', {
     url: '/c1',
     component: 'c1',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });


    $stateProvider.state('sessionHall', {
      url: '/sessionHall',
      component: 'sessionHall',
      params: {
        roomService: null,
      },
      resolve: {
        roomService: function($transition$) {
          console.log("$transition$", $transition$);
          console.log("$transition$.params()", $transition$.params());
          // console.log("$transition$.$to()", $transition$.$to());
          return $transition$.params().roomService;
        },
      },
    });





   $stateProvider.state('sessionMain', {
     url: '/sessionMain',
     component: 'sessionMain',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('teamsConfig', {
     url: '/teamsConfig',
     component: 'teamsConfig',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('teamsConfigWithId', {
     // url: '/teamsConfig/:roomId',
     url: '/teamsConfigWithId/:roomId',
     component: 'teamsConfig',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$, navigationService) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         const roomId      = $transition$.params().roomId;
         const roomService = navigationService.getFromPool(roomId);
         if(!roomService) {
           throw new Error("roomService not found for roomId: " + roomId);
         }
         return roomService;
       },
     },
   });

   $stateProvider.state('contentConfig', {
     url: '/contentConfig',
     component: 'contentConfig',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });



   $stateProvider.state('instanceBegin', {
     url: '/instanceBeginCn',
     component: 'instanceBeginCn',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('instanceTeller', {
     url: '/instanceTellerCn',
     component: 'instanceTellerCn',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   // $stateProvider.state('instanceTellerWithId', {
   //   url: '/instanceTellerCn/:roomId',
   //   component: 'instanceTellerCn',
   //   params: {
   //     roomService: null,
   //   },
   //   resolve: {
   //     roomService: function($transition$, navigationService) {
   //       console.log("$transition$", $transition$);
   //       console.log("$transition$.params()", $transition$.params());
   //       // console.log("$transition$.$to()", $transition$.$to());
   //       const roomId      = $transition$.params().roomId;
   //       const roomService = navigationService.getFromPool(roomId);
   //       if(!roomService) {
   //         throw new Error("roomService not found for roomId: " + roomId);
   //       }
   //       return roomService;
   //     },
   //   },
   // });

   $stateProvider.state('instanceTeller_force', {
     url: '/instanceTeller_force',
     component: 'instanceTellerCn',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function(navigationService) {
         const roomServiceName = "teller";
         const roomService = navigationService.getRoomService(roomServiceName);
         if(!roomService) {
           throw new Error("roomService not found for roomServiceName", roomServiceName);
         }
         return roomService;
       },
     },
   });



   $stateProvider.state('instanceGuesser', {
     url: '/instanceGuesserCn',
     component: 'instanceGuesserCn',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });

   $stateProvider.state('instanceGuesser_force', {
     url: '/instanceGuesser_force',
     component: 'instanceGuesserCn',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function(navigationService) {
         const roomServiceName = "guesser";
         const roomService = navigationService.getRoomService(roomServiceName);
         if(!roomService) {
           throw new Error("roomService not found for roomServiceName", roomServiceName);
         }
         return roomService;
       },
     },
   });




   $stateProvider.state('instanceEnd', {
     url: '/instanceEndCn',
     component: 'instanceEndCn',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });








   $stateProvider.state('cr1', {
     url: '/cr1',
     component: 'cr1',
     params: {
       roomService: null,
     },
     resolve: {
       roomService: function($transition$) {
         console.log("$transition$", $transition$);
         console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().roomService;
       },
     },
   });


   // $stateProvider.state('client', {
   //   url: '/client',
   //   component: 'client',
   // });

   $stateProvider.state('serverFace', {
     url: '/serverFace',
     component: 'serverFace',
   });




   $stateProvider.state('prout', {
     url: '/prout',
     component: 'prout',
   });

   $stateProvider.state('home', {
     url: '/home',
     component: 'home',
   });

   $stateProvider.state('home!', {
     url: '/home!',
     onEnter: function($state) {
        $state.go('home', {}, {reload : true});

        // console.log("reload please", $state.$current.name);
        // if($state.$current.name == 'home') {
        //   $state.reload();
        // } else {
        //   $state.go('home', {}, {reload : true});
        // }
		  }
   });


   //session
   $stateProvider.state('session', {
     url: '/session',
   });

   $stateProvider.state('session.create', {
     url: '/create',
     component: 'sessionCreate',
     resolve : {
       formModel: function(gameService) {
         return gameService.session_config_formModel_p();
       },
     }
   });

   $stateProvider.state('session.list', {
     url: '/list',
     component: 'sList',
     resolve: {
       sessions: function(gameService) {
         return  gameService.getSessionsMap();
       }
     }
   });

   $stateProvider.state('session.detail', {
     url: '/detail',
     component: 'sessionDetail',
     params: {
       session: null,
     },
     resolve: {
       session: function($transition$) {
         // console.log("$transition$", $transition$);
         // console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().session;
       }
     },
   });

   $stateProvider.state('session.current', {
     url: '/current',
   });

   $stateProvider.state('session.current.config', {
     url: '/config',
   });

   $stateProvider.state('session.current.config.teams', {
     url: '/teams',
     component: 'teamsConfig',
     params: {
       teamsConfig: null,
     },
     resolve: {
       teamsConfig: function($transition$) {
         return $transition$.params().teamsConfig;
       }
     },
   });

   $stateProvider.state('session.current.config.content', {
     url: '/content',
     component: 'sessionDetail',
     params: {
       session: null,
     },
     resolve: {
       session: function($transition$) {
         // console.log("$transition$", $transition$);
         // console.log("$transition$.params()", $transition$.params());
         // console.log("$transition$.$to()", $transition$.$to());
         return $transition$.params().session;
       }
     },
   });

   $stateProvider.state('session.current.game', {
     url: '/game',
   });


   //instance



   //content
   $stateProvider.state('content', {});

   $stateProvider.state('content.grid', {});

   $stateProvider.state('content.grid.create', {
     url: '/content/grid/create',
     component: 'cGridCreate',
   });

});
