import { WebSocketServer } from 'ws';

import { init } from 'raspi';
import { Serial } from 'raspi-serial';

let serial;
let _ws;

init(() => {
  serial = new Serial({
    portId: "/dev/ttyUSB0",
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: Serial.PARITY_NONE
  });
  serial.open(() => {
    serial.on('data', (data) => {
      _ws.send('mcu:' + data);
      // process.stdout.write(data);
    });
  });
});


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  _ws = ws
  ws.on('error', console.error);

  ws.on('message', function message(data) {

    serial.write(data);

    console.log('client: ' + data);
  });


});