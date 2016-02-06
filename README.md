# Microservice Registry

For a project, I had a need to monitor multiple Node.js micro processes; specifically, I wanted a way to register services with one another without relying on hard coding ports, and to notify services when they were ready.

This project is pretty specific to my use case but feel free to fork. To use, every microservice should first register itself:

## Set Up

```
var service = require('microservice-registry');
var name = 'foo';
var options = {
  bar: 'baz'
};
service.register(name, options);
```

Then, once the service is ready, call ready:
```
app.listen(app.get('port'), function() {
  service.ready();
});
```

This will broadcast to any listening microservices that this app is ready to go.

To listen for other apps, pass in a 'services' array on register that includes the names of the various services you're listening for:

```
var service = require('microservice-registry');
var name = 'norf';
var options = {
  services: [ 'foo' ]
};
service.register(name, options);

// this will be called only when all services are ready
service.ready(function() {
  app.listen(app.get('port'), function() {
  });
});
```

That's it!

## Retrieving a service

To get a service, just call:

```
service.get('foo');
```

This will return any registered services that match that name.
