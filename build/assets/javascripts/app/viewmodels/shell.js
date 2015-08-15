define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'demo', title:'GameDemo', moduleId: 'viewmodels/demo', nav: true }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});