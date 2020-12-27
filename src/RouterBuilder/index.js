const isUndefined = (value) => {
  return value === undefined;
};

let redirectPath = null;

const evaluateGuards = (guards, to, from, next) => {

  // clone the array so we do not accidentally modify it
  let guardsRemaining = guards.slice(0);
  const nextGuard = guardsRemaining.shift();

  if (isUndefined(nextGuard) || to.path === redirectPath) {
    next();
    return;
  }

  nextGuard(to, from, (nextArg) => {

    if (isUndefined(nextArg)) {
      evaluateGuards(guardsRemaining, to, from, next);
      return;
    }

    if (nextArg.path) {
      redirectPath = nextArg.path;
    }

    next(nextArg);
  });
};

export default class RouterBuilder {

  constructor() {
    this.middleware = {
      global: {},
      route: {},
    };
    this.routes = [];
  }

  addRoute(route, middleware = null) {
    this.addRoutes([route], middleware);
  }

  addRoutes(routes = [], middleware = null) {

    let routeMiddleware = [];

    if (Array.isArray(middleware)) {
      routeMiddleware = middleware;
    } else if (middleware) {
      routeMiddleware.push(middleware);
    }

    this.routes = [
      ...this.routes,
      ...this.applyMiddleware(routes, routeMiddleware),
    ];
  }

  applyMiddleware(routes = [], middleware = []) {
    return routes.map((route) => {

      if (isUndefined(route.meta)) {
        route.meta = {};
      }

      if (isUndefined(route.meta.middleware)) {
        route.meta.middleware = [];
      }

      route.meta.middleware = route.meta.middleware.concat(middleware);

      return route;
    });
  };

  beforeEach(to, from, next) {

    const middleware = this.middleware;
    let middlewareToApply = [];
    let middlewareKeys = [];

    // Global Middleware

    for (const [key, value] of Object.entries(middleware.global)) {
      middlewareToApply.push(value);
    }

    // Route Middleware

    if (to && to.meta && to.meta.middleware) {

      // Collect middlewareKeys

      if (Array.isArray(to.meta.middleware)) {
        to.meta.middleware.forEach((middlewareKey) => {
          middlewareKeys.push(middlewareKey);
        });
      } else {
        middlewareKeys.push(to.meta.middleware);
      }

      // Swap keys for actual middleware

      middlewareKeys.forEach((middlewareKey) => {
        if (this.middleware.route[middlewareKey]) {
          middlewareToApply.push(middleware.route[middlewareKey]);
        } else {
          console.log(`[routerBuilder] ${middlewareKey} hasn't been registered`);
        }
      });
    }

    return evaluateGuards(middlewareToApply, to, from, next);
  };

  getRoutes() {
    return this.routes;
  }

  registerGlobalMiddleware(key, middleware) {
    this.middleware.global[key] = middleware;
  }

  registerRouteMiddleware(key, middleware) {
    this.middleware.route[key] = middleware;
  }
}