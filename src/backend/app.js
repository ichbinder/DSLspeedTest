import low from 'lowdb';
import server from './bin/www';
import speedTimer from './speed/speedTestTimer';

const db = low( './speedDB.json' );

db.defaults( { speed: [], reconnect: [] } )
  .write();

const app = server();

speedTimer( 5, 10000 );

app.listen( app.get( 'port' ), () => {
  console.log( `Express ready on http://localhost:${app.get( 'port' )}` );
} );
