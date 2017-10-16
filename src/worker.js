'use strict';

const rpc = require('./rpc/bitcoin');

const kue = require('kue');
const queue = kue.createQueue();

const opReturnRegexp = /^OP_RETURN\s(.*)$/;

queue.process('tx', 10, (job, done) => {
  rpc
    .tx(job.data.id)
    .then(tx => {
      tx.vout.forEach(vout => {
        const text = vout.scriptPubKey.asm
        if(opReturnRegexp.test(text)){
          const hex = text.match(opReturnRegexp)[1];
          const ethAddr = new Buffer(hex, 'hex').toString('ascii')
        }
      })
      done();
    })
    .catch(console.log);
});