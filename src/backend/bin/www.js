import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import rIndex from '../routes/rIndex';
import rSpeed from '../routes/rSpeed';


function server( ) {
  const app = express();
  // sd
  app.set( 'port', process.env.PORT || 8009 );

  // laden den bodyParser
  app.use( bodyParser.urlencoded( { extended: true } ) );
  app.use( bodyParser.json() );

  // View engine
  app.set( 'views', `${path.resolve( __dirname, '../views' )}` );
  app.set( 'view engine', 'pug' );

  // Lade die Statischen Datein in die Middleware
  app.use( express.static( `${path.resolve( __dirname, '../../frontend' )}` ) );

  // Meine eigenen Routes werden hier bekoant gemacht
  app.use( '/', rIndex );
  app.use( '/speed', rSpeed );

  // Error Handling
  app.use( ( req, res ) => {
    res.type( 'text/plain' );
    res.status( 404 );
    res.send( '404 - Not Found' );
  } );

  app.use( ( err, req, res ) => {
    console.error( err.stack );
    res.type( 'text/plain' );
    res.status( 500 );
    res.send( '500 - Internal error' );
  } );

  return app;
}

export default server;
