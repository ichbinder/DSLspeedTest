import low from 'lowdb';
import server from './bin/www';
import speedTimer from './speed/speedTestTimer';
import reconnect from './reconnect';

const db = low( './speedDB.json' );

db.defaults( { speed: [], reconnect: [] } )
  .write();

reconnect( ['17:00', '05:00'] );

speedTimer( 5, 10000 );

const app = server();

app.listen( app.get( 'port' ), () => {
  console.log( `Express ready on http://localhost:${app.get( 'port' )}` );
} );
