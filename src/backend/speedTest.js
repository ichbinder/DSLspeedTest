import speedTest from 'speedtest-net';

export default function speetTestPerTime( repeat, testTime ) {
  const average = {
    down: 0,
    up: 0,
    ping: 0,
    ip: 0,
    minDown: 230,
    maxDown: 0,
    minUp: 230,
    maxUp: 0,
  };
  return new Promise( ( resolveAverage ) => {
    ( function loop( i ) {
      if ( i < repeat ) {
        new Promise( ( resolve, reject ) => {
          speedTest.visual( { maxTime: testTime }, ( err, speedData ) => {
            if ( err ) reject( err );
            average.down += speedData.speeds.download;
            average.up += speedData.speeds.upload;
            average.ping += speedData.server.ping;
            average.ip = speedData.client.ip;
            console.log( 'Step: ', i, 'Down: ', speedData.speeds.download, 'Up: ', speedData.speeds.upload, 'Ping: ', speedData.server.ping );
            console.log( '----------------------------------------------' );
            if ( speedData.speeds.download > average.maxDown )
              average.maxDown = speedData.speeds.download;
            if ( speedData.speeds.download < average.minDown )
              average.minDown = speedData.speeds.download;
            if ( speedData.speeds.upload > average.maxUp )
              average.maxUp = speedData.speeds.upload;
            if ( speedData.speeds.upload < average.minUp )
              average.minUp = speedData.speeds.upload;
            resolve();
          } );
        } ).then( loop.bind( null, i + 1 ) )
        .catch( error => console.log( 'SpeetTest Error: ', error ) );
      } else {
        average.down = Number( ( average.down /= repeat ).toFixed( 2 ) );
        average.up = Number( ( average.up /= repeat ).toFixed( 2 ) );
        average.ping = Number( ( average.ping /= repeat ).toFixed( 2 ) );
        resolveAverage( average );
      }
    }( 0 ) );
  } );
}


// export default class CTGKNXConnector {
//
//   constructor( options ) {
//
//   }


// let formatDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
// var startDate = moment(formatDate).format("YYYY-MM-DD HH:mm:ss");
//
// sleep.sleep(5);
//
// formatDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
// var endDate = moment(formatDate).format("YYYY-MM-DD HH:mm:ss");
//
// var remainingDate = moment(endDate).diff(startDate, 'seconds');
//
// console.log(remainingDate); // at time of posting, 106 days
//
//
//
//
// console.log("test");
