const rpc = require('./rpc/bitcoin');
const addr = require('./config').btcCompanyAddr;
const socket = require('socket.io-client')(rpc.host);
const kue = require('kue');

const queue = kue.createQueue();

socket.on('connection', console.log.bind(console, 'connected'));
socket.on('connect', socket.emit.bind(socket,'subscribe', 'inv'));

socket.on('tx', tx => {
  /*const tout = tx.vout.find(out => !!out[addr])
  if(!!!tout){
    return;
  }*/
  queue
    .create('tx', { id: tx.txid })
    .delay(10000)
    .save();
})