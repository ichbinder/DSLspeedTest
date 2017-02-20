import routerOnOff from 'onoff';
import sleep from 'sleep';
import low from 'lowdb';
import dateFormat from 'dateformat';
import moment from 'moment';

const db = low( './speedDB.json' );

export default function reconnect( time ) {
  const getReconnectPromise = value =>
    new Promise( ( resolve ) => {
      for ( let i = 0, len = time.length; i < len; i += 1 ) {
        const currentTime = dateFormat( new Date(), 'HH:MM' );
        if ( moment( currentTime ).isSame( time[i] ) ) {
          routerOnOff.writeSync( 0 );
          sleep.sleep( 30 );
          routerOnOff.writeSync( 1 );
          db.get( 'reconnect' )
          .push( { reconTime: dateFormat( new Date(), 'yyyy-mm-dd HH:MM:ss' ) } )
          .write();
        }
        sleep.sleep( 1 );
        resolve( value );
      }
    } );

  const loop = value =>
      getReconnectPromise( value ).then( result => loop( result ) );

  loop( true ).then( () => console.log( 'all done!' ) );
}
