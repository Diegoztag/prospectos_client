const fs = require('fs');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const userdb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));
const helmet = require('helmet');
const request = require('request');

const ssoHost = 'https://sso.coppel.io:50061';

server.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
  })
);

// Sets "Strict-Transport-Security: max-age=5184000; includeSubDomains".
const sixtyDaysInSeconds = 5184000;
server.use(
  helmet.hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubDomains: true,
    preload: true,
  })
);

server.use(middlewares);
server.use(jsonServer.bodyParser);
const SECRET_KEY = '123456789';
const expiresIn = '8h';

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));
}

// Verify SSO the token
function verifySSOToken(token) {
  return new Promise((resolve, reject) => {
    let options = { headers: { 'Authorization': token }, json: true };

    request(`${ssoHost}/api/v1/verify`, { ...options, method: 'POST' }, (_verifyerror, _verifyresponse, verify) => {
      if (verify.meta.status === 'FAIL') reject(verify.meta.error.userMessage);
      else {
        request(`${ssoHost}/api/v2/me`, { ...options, method: 'GET' }, (_meerror, _meresponse, me) => {
          if (me.meta.status === 'FAIL') reject(me.meta.error.userMessage);
          else {
            let inLocalUsers = userdb.users.some(({ numeroempleado }) => { return numeroempleado.toString() === me.data.user} )
            if (!inLocalUsers) reject('No tienes acceso al recurso');
            else resolve()
          }
        });
      }
    });

  })
}

server.get('/auth/me', (req, res) => {
  const token = req.headers.authorization;
  const {username} = jwt.decode(token);
  const usuario = userdb.users.find(({ numeroempleado }) => numeroempleado.toString() === username)
  if (usuario === undefined) {
    const status = 401;
    const respuesta = {
      meta: { status: 'ERROR', count: 1 },
      data: {
        errorCode: 404,
        userMessage: 'Inicio de sesión invalido, verifique los datos',
        devMessage: 'Usuario no existente en la base de datos',
      }
    };
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.status(status).json(respuesta);
    return;
  }
  res.status(200).json({ meta: {}, data: usuario });
});

server.post('/auth/login', (req, res) => {
  const { username } = req.body;
  const usuario = userdb.users.find(({ numeroempleado }) => numeroempleado.toString() === username)
  if (usuario === undefined) {
    const status = 401;
    const respuesta = {
      meta: { status: 'ERROR', count: 1 },
      data: {
        errorCode: 404,
        userMessage: 'Usuario Invalido',
        devMessage: 'usuario no existe',
      },
    };
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.status(status).json(respuesta);
    return;
  }
  const access_token = createToken({ username });
  res.status(200).json({ meta: {}, data: { usuario, access_token } });
});

server.get('/centros/pdf', (_req, res) => {
  fs.readFile('src/assets/pdf/sample.pdf', (error, data) => {
    if (error) {
      res.json({ status: 'error', msg: error });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/pdf' });
      res.write(data);
      res.end();
    }
  });
});

// server.use(/^(?!\/auth).*$/, async (req, res, next) => {
//   const token = req.headers.authorization;
//   const method = req.headers['session-type'];

//   if (token === undefined || method === undefined) {
//     const status = 401;
//     const message = 'Error in authorization format';
//     res.status(status).json({ status, message });
//     return;
//   }

  // try {
  //   if (method === 'MSAL') {
  //     next();
  //   }
  //   else if (method === 'SSO') {
  //     await verifySSOToken(token)
  //     next();
  //   }
  //   else if (method === 'CST') {
  //     let verifyTokenResult = verifyToken(token);
  //     if (verifyTokenResult instanceof Error) throw verifyTokenResult;
  //     next();
  //   }
  // } catch (err) {
  //   const status = 401;
  //   const respuesta = {
  //     meta: { status: 'ERROR', count: 1 },
  //     data: {
  //       errorCode: 401,
  //       userMessage: 'No tienes acceso al recurso',
  //       devMessage: err,
  //     },
  //   };
  //   res.status(status).json(respuesta);
  // }
// });

server.use(router);
const args = require('minimist')(process.argv.slice(2));
const port = !args['port'] ? 3200 : args['port'];
const host = !args['host'] ? '0.0.0.0' : args['host'];

server.listen(port, host, () => {
  console.log(`JSON Server is running ${host} on port ${port}`);
});
