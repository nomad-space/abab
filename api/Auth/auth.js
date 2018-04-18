const random = require('random-node');
const passwordHash = require('password-hash');
const db = require('../../app/modules/db');
const mail = require('../../app/modules/mail');
const config = require('../../app/modules/config');
const nameGroupAPI = __dirname.split('/').slice(-1)[0];

// return new Promise((resolve, reject) => {});
module.exports = (API, redis) => {

    API.register('registration_email', true, (user, param) => {
        return new Promise((resolve, reject) => {
            if (!param.email && typeof param.email !== 'string')
                return reject(API.error.create('Request param "email" incorrect', 'param', {
                    pos: 'api/auth.js(registration_email):#1',
                    param: param
                }, 0));
            if (!param.name && typeof param.name !== 'string')
                return reject(API.error.create('Request param "name" incorrect', 'param', {
                    pos: 'api/auth.js(registration_email):#2',
                    param: param
                }, 0));
            if (!param.surname && typeof param.surname !== 'string')
                return reject(API.error.create('Request param "surname" incorrect', 'param', {
                    pos: 'api/auth.js(registration_email):#3',
                    param: param
                }, 0));
            if (!param.password && typeof param.password !== 'string')
                return reject(API.error.create('Request param "password" incorrect', 'param', {
                    pos: 'api/auth.js(registration_email):#4',
                    param: param
                }, 0));

            param.password = passwordHash.generate(param.password);
            return resolve(param);

        }).then(() => {
            return db.users.find({
                email: param.email,
            }).count().then(function (cnt) {
                if (cnt !== 0) {
                    return Promise.reject(API.error.create('This "email" already in use', 'api', {
                        pos: 'api/auth.js(registration_email):#5',
                        param: param
                    }, 1));
                }
                return db.users({

                    email: param.email,
                    phone: null,
                    name: param.name,
                    surname: param.surname,
                    password: param.password,
                    birthday: '00.00.0000',
                    address: '',
                    last_ip: '0.0.0.0',
                    api: {
                        key: random.key(5, 5, 5, 8) + '-' + (new Date().getTime()),
                        secret: random.str(20, 25),
                        white_ip: '*.*.*.*',
                        status: true // secure  default false
                    },
                    activate_hash: random.key(4, 6, 6, 8) + '-' + (new Date().getTime()),

                    settings: {},
                    activate: false
                }).save()


            }).then(function (document) {
                mail.send(param.email,
                    'Activate you account Nomad.space',
                    'Hi ' + document.email + ', You have successfully created an Nomad.space account. To complete the process, activate your account. '+config.get('shema')+'://'+config.get('domain')+config.get('server_path')+config.get('api_path')+'/public_activate_email/?email=' + document.email + '&hash=' + document.activate_hash + ' If you have any questions about this email, contact us. https://nomad.space/support Regards, The Nomad.space team',
                    'Hi ' + document.email + ', You have successfully created an Nomad.space account. To complete the process, activate your account. <br>'+config.get('shema')+'://'+config.get('domain')+config.get('server_path')+config.get('api_path')+'public_activate_email/?email=' + document.email + '&hash=' + document.activate_hash + ' <br><br>If you have any questions about this email, contact us. <br>https://nomad.space/support <br><br>Regards, The Nomad.space team');
                return {
                    user: document,
                    success: true
                };
            }).catch(API.error.validate);
        })


    }, {
        title: 'Registration user for email',
        group: nameGroupAPI,

        level: 0,// 0 public,1 user,2 admin,3 server
        description: 'Registration user for email method send verify message to "email" smtp ',
        param: [
            {
                name: 'email',
                type: "string",
                title: 'user Email',
                necessarily: true
            }, {
                name: 'password',
                type: "string",
                title: 'user password',
                necessarily: true
            }, {
                name: 'name',
                type: "string",
                title: 'user name',
                necessarily: true
            }, {
                name: 'surname',
                type: "string",
                title: 'user name',
                necessarily: true
            },

        ],
        response: [
            {name: 'success', type: "string", title: 'Status request method', default: 'true, false'},
            {name: 'user_id', type: "string", title: 'user id', default: '12345'},
            {name: 'error', type: "string", title: '', default: 'Example: Error code'},
            {name: 'latency_ms', type: "int(11)", title: 'Request processing time in ms', default: '122'}
        ]
    });

    API.register('auth_email', true, (user, param) => {
        return new Promise((resolve, reject) => {

            if (!param.email)
                return reject(API.error.create('Request param "email" incorrect', 'param', {
                    pos: 'api/auth.js(auth_email):#1',
                    param: param
                }, 0));
            if (!param.password)
                return reject(API.error.create('Request param "password" incorrect', 'param', {
                    pos: 'api/auth.js(auth_email):#2',
                    param: param
                }, 0));
            return resolve(param);
        }).then(() => {

            return db.users.findOne({
                email: param.email,
            })
        }).then(function (document) {
            if (!document) {
                return Promise.reject(API.error.create('"email" or "password" incorrect', 'param', {
                    pos: 'api/auth.js(auth_email):#3',
                    param: param
                }, 1));
            }
            if (!passwordHash.verify(param.password, document.password))
                return Promise.reject(API.error.create('"email" or "password" incorrect', 'param', {
                    pos: 'api/auth.js(auth_email):#4',
                    param: param
                }, 1));
            if (!document.activate) {
                mail.send(param.email,
                    'Activate you account Nomad.space',
                    'Hi ' + document.email + ', You have successfully created an Nomad.space account. To complete the process, activate your account. https://nomad.space/api/v1/?method=public_activate_email&email=' + document.email + '&hash=' + document.activate_hash + ' If you have any questions about this email, contact us. https://Nomad.space/support Regards, The Nomad.space team',
                    'Hi ' + document.email + ', You have successfully created an Nomad.space account. To complete the process, activate your account. <br>https://nomad.space/api/v1/?method=public_activate_email&email=' + document.email + '&hash=' + document.activate_hash + ' <br><br>If you have any questions about this email, contact us. <br>https://Nomad.space/support <br><br>Regards, The Nomad.space team');

                return Promise.reject(API.error.create('This account not activate. We resend the message for activate account', 'param', {
                    pos: 'api/auth.js(auth_email):#5',
                    param: param
                }, 1));
            }
            return {
                user: filterObject(document._doc, [
                    '_id',
                    'api', // secure delete this param in result
                    'name',
                    'surname',
                    'birthday',
                    'email',
                    'phone',
                    'address',
                    'last_ip',
                    'update_at',
                    'create_at',
                ])
            };
        }).catch(API.error.validate);


    }, {
        title: 'Login user for email',
        group: nameGroupAPI,

        level: 0,// 0 public,1 user,2 admin,3 server
        description: 'Login user for email method send verify message to "email" from smtp smtp',
        param: [
            {
                name: 'email',
                type: "string",
                title: 'user Email',
                necessarily: true
            }, {
                name: 'password',
                type: "string",
                title: 'user password',
                necessarily: true
            },

        ],
        response: [
            {name: 'success', type: "string", title: 'Status request method', default: 'true, false'},
            {name: 'user', type: "object", title: 'data user info', default: '{_id)}'},
            {name: 'error', type: "string", title: '', default: 'Example: Error code'},
            {name: 'latency_ms', type: "int(11)", title: 'Request processing time in ms', default: '122'}
        ]
    });
    API.register('activate_email', true, (user, param) => {
        return new Promise((resolve, reject) => {

            if (!param.email)
                return reject(API.error.create('Request param "email" incorrect', 'param', {
                    pos: 'api/auth.js(activate_email):#1',
                    param: param
                }, 0));
            return resolve(param);

        }).then(() => {

            return db.users.findOne({
                email: param.email,
            })
        }).then(document => {
            if (!document) {
                return Promise.reject(API.error.create('"email" not found', 'param', {
                    pos: 'api/auth.js(activate_email):#2',
                    param: param
                }, 1));
            }
            if (document.activate_hash !== param.hash) {
                return Promise.reject(API.error.create('Request param "hash" incorrect', 'param', {
                    pos: 'api/auth.js(activate_email):#3',
                    param: param
                }, 1));
            }
            if (document.activate) {
                return Promise.reject(API.error.create('Account already active', 'param', {
                    pos: 'api/auth.js(activate_email):#4',
                    param: param
                }, 1));
            }
            return db.users.update({email: document.email}, {activate: true}).then(function () {


                return {
                    message: 'Activate success',
                    success: true
                };
            })
        })


    }, {
        title: 'Login user for email',
        group: nameGroupAPI,

        level: 0,// 0 public,1 user,2 admin,3 server
        description: 'Login user for email method send verify message to "email" from smtp smtp',
        param: [
            {
                name: 'email',
                type: "string",
                title: 'user Email',
                necessarily: true
            }, {
                name: 'password',
                type: "string",
                title: 'user password',
                necessarily: true
            },

        ],
        response: [
            {name: 'success', type: "string", title: 'Status request method', default: 'true, false'},
            {name: 'user', type: "object", title: 'data user info', default: '{_id)}'},
            {name: 'error', type: "string", title: '', default: 'Example: Error code'},
            {name: 'latency_ms', type: "int(11)", title: 'Request processing time in ms', default: '122'}
        ]
    });
};