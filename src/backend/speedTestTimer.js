import dateFormat from 'dateformat';
import moment from 'moment';
import low from 'lowdb';
import sleep from 'sleep';
import speedInDB from './speedTest';

const db = low( './speedDB.json' );

db.defaults( { speed: [] } )
  .write();

// const SPEEDTEST_INTERVAL = 5; // Wie oft soll der SpeedTest ausgeführt werden.
// const SPEEDTEST_TIME = 5000; // Wie lange soll der SpeedTest ausgeführt werden 5000 = 5 Sikunden.
const SLEEP_TIMER = 1; // Wie lange soll gewartet werden bis die loop erneut ausgefürt wird.
// const SPEED_TIMER = 30; // Der Interval des SpeedTest in Minuten.

let currentTime = dateFormat( new Date(), 'yyyy-mm-dd HH:MM:ss' );
let nextHour = Number( currentTime.split( ' ' )[1].split( ':' )[0] ) + 1;

export default function speetTestPerTime( SPEEDTEST_INTERVAL, SPEEDTEST_TIME, ) {
  const getSpeedPromise = value =>
    new Promise( ( resolve ) => {
      sleep.sleep( SLEEP_TIMER );

      const starTime = moment( `${nextHour}:00:00`, 'HH:mm:ss' );
      currentTime = moment( currentTime ).add( SLEEP_TIMER, 'seconds' );
      const next = moment( starTime ).diff( currentTime, 'secents' );
      if ( next <= ( SLEEP_TIMER * 1000 ) && next >= ( ( SLEEP_TIMER ) * -1 ) * 1000 ) {
        speedInDB( SPEEDTEST_INTERVAL, SPEEDTEST_TIME )
          .then( ( averageSpeet ) => {
            currentTime = dateFormat( new Date(), 'yyyy-mm-dd HH:MM:ss' );
            nextHour = Number( currentTime.split( ' ' )[1].split( ':' )[0] ) + 1;

            db.get( 'speed' )
              .push( {
                id: db.get( 'speed' ).size() + 1,
                date: currentTime,
                download: averageSpeet.down,
                upload: averageSpeet.up,
                minDown: averageSpeet.minDown,
                minUp: averageSpeet.minUp,
                maxDown: averageSpeet.maxDown,
                maxMin: averageSpeet.maxMin,
                ping: averageSpeet.ping,
                clientIP: averageSpeet.ip,
              } )
              .write();
            resolve( value );
          } );
      } else {
        resolve( value );
      }
    } );

  const loop = value =>
    getSpeedPromise( value ).then( result => loop( result ) );

  loop( true ).then( () => console.log( 'all done!' ) );
}

// console.log(
//   db
//     .get( 'speed' )
//     .filter( i => i.date.match( new RegExp( '2017-02-12 19' ) ) )
//     .map( 'date' )
//     .value() );
