import gpio from 'pi-gpio';
import low from 'lowdb';
import dateFormat from 'dateformat';
import moment from 'moment';

const db = low( './speedDB.json' );

export default function reconnect( time ) {
  const getReconnectPromise = value =>
    new Promise( ( resolve ) => {
      for ( let i = 0, len = time.length; i < len; i += 1 ) {
        const currentTime = dateFormat( new Date(), 'HH:MM:ss' );
        if ( moment( currentTime ).isSame( time[i] ) )
          gpio.open( 7, 'output', ( err ) => {
            if ( err ) console.log( 'Es gab ein fheler:', err );
            else {
              gpio.write( 7, 1, () => {
                gpio.close( 7 );
                db.get( 'reconnect' )
                .push( { reconTime: dateFormat( new Date(), 'yyyy-mm-dd HH:MM:ss' ) } )
                .write();
              } );
            }
          } );
        resolve( value );
      }
    } );

  const loop = value =>
      getReconnectPromise( value ).then( result => loop( result ) );

  loop( true ).then( () => console.log( 'all done!' ) );
}
