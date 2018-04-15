const nameGroupAPI = __dirname.split('/').slice(-1)[0];
const _ = require('lodash');
const sol_config = require('../../config.sol');

module.exports = (API, redis) => {

    let contractFn = _.filter(sol_config._abi, {type: 'function'});
    if (contractFn && typeof contractFn === 'object' && contractFn.length > 0) {
        for (let key in contractFn) {
            let docs = {
                title: contractFn[key].name + 'Export function in ABI ',
                group: nameGroupAPI,

                level: 0,
                description: 'Export  in ABI statemutability view, type function method validate param and output json  ',
                param: [],
                response: []
            };
            for (let i1 in contractFn[key].inputs) {
                let name_param = contractFn[key].inputs[i1].name;
                if (!name_param || name_param === '') name_param = 'param_' + i1;
                docs.param.push({
                    name: name_param,
                    type: contractFn[key].inputs[i1].type,
                    title: 'return in contract func',
                    default: '',
                    necessarily: true
                })

            }
            for (let i2 in contractFn[key].outputs) {
                docs.response.push({
                    name: 'result.' + contractFn[key].outputs[i2].name,
                    type: contractFn[key].outputs[i2].type,
                    title: 'return in contract func',
                    default: '0'
                })
            }
            API.register('fn_' + contractFn[key].name, true, (user, param) => {
                return new Promise((resolve, reject) => {

                    let method = param.method.split('_fn_')[1];
                    let contractABI = _.find(sol_config._abi, {name: method});
                    if (!contractABI || contractABI.type !== 'function') {
                        return Promise.reject(API.error.create('Request function is not found function contract', 'param', {
                            pos: 'api/contract.js(' + param.method + '):#autogenerate_API_function :1',
                            param: param
                        }, 0));
                    }
                    let callParam = [];
                    for (let i_in in contractABI.inputs) {
                        let name_param = contractABI.inputs[i_in].name;
                        if (!name_param || name_param === '') name_param = 'param_' + i_in;
                        if (!param[name_param]) {
                            return Promise.reject(API.error.create('Request param is not found', 'param', {
                                pos: 'api/contract.js(' + param.method + '):#autogenerate_API_function :2',
                                param: param,
                                param_name_err: name_param,
                                contractABI_param: contractABI.inputs[i_in],
                            }, 0));
                        }
                        callParam.push(param[name_param]);
                    }

                    resolve({callParam,contractABI,method});

                }).then(_res=>{
                    return API.call('public_callFunctionContract', user, {
                        function: _res.method,
                        param: _res.callParam
                    }).then((res) => {
                        let response = {};
                        for (let i_out in  _res.contractABI.outputs) {
                            let name_param = _res.contractABI.outputs[i_out].name;
                            if (name_param === '') name_param = 'index_' + i_out;
                            if (!res[i_out])
                                response[name_param] = res.toString();
                            else
                                response[name_param] = res[i_out].toString();
                        }

                        return response;
                    });
                })
            }, docs);

        }
    }
};
