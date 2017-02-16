import server from './bin/www';
import speedTimer from './speedTestTimer';

const app = server();

speedTimer( 5, 10000 );

app.listen( app.get( 'port' ), () => {
  console.log( `Express ready on http://localhost:${app.get( 'port' )}` );
} );
