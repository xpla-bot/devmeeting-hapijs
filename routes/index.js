const products = require('./api/products/products')

exports.register = (server, options, next) => {
  server.views({
    engines: {
      'html': {
        module: require('handlebars')
      }
    },
    path: 'templates'
  })

  server.method('fibonacci', (n, next) => {
    if (n < 2) {
      return next(null, n);
    }

    server.methods.fibonacci(n - 1, (e1, a) => {
      server.methods.fibonacci(n - 2, (e2, b) => {
        next(e1 || e2, a + b)
      })
    })
  }, {
    cache: {
      expiresIn: 60000,
      generateTimeout: 5000
    }
  })

  server.route({
    method: 'GET',
    path: '/fib/{n}',
    handler(request, reply) {
      const { n } = request.params;
      server.methods.fibonacci(parseInt(n), (err, res) => {
        reply(err || res)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler (_request, reply) {
        reply.view('index', {
          products: JSON.stringify(products.list)
        })
      },
      tags: ['html'],
      description: 'Render index page.',
      notes: 'It is not an API!'
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'index',
    version: '1.0.0'
  }
}
