const isUndefined = (value) => {
  return value === undefined;
};

export default class RouterBuilder {

  constructor() {
    this.routes = [];
  }

  addRoute(route, middleware = null) {
    this.addRoutes([route], middleware);
  }

  addRoutes(routes = [], middleware = null) {

    let routeMiddleware = [];

    if (Array.isArray(middleware)) {
      routeMiddleware = middleware;
    } else {
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

  getRoutes() {
    return this.routes;
  }
}