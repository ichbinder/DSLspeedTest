import express from 'express';
import dateFormat from 'dateformat';
import moment from 'moment';
import low from 'lowdb';

const db = low( './speedDB.json' );
const router = new express.Router();

router
  .post( '/lastHours', ( req, res ) => {
    if ( !req.body.hours ) {
      res.status( 400 ).json( {
        message: 'Bitte geben sie das hours ein.',
        error: true,
      } );
    } else {
      const currentTime = dateFormat( new Date(), 'yyyy-mm-dd HH:MM:ss' );
      res.status( 200 ).json(
        db
          .get( 'speed' )
          .filter( ( i ) => {
            const pastTime = moment( currentTime ).subtract( req.body.hours, 'hours' );
            if ( moment( i.date ).isBetween( pastTime, currentTime ) )
              return i;
            return null;
          } )
          .value()
      );
    }
  } )
  .post( '/getWeek', ( req, res ) => {
    if ( !req.body.week ) {
      res.status( 400 ).json( {
        message: 'Bitte geben sie das week ein.',
        error: true,
      } );
    } else {
      res.status( 200 ).json(
        db
          .get( 'speed' )
          .filter( ( i ) => {
            const dayOfWeek = moment().isoWeek( req.body.week );
            const startOfWeek = moment( dayOfWeek ).startOf( 'week' );
            const endOfWeek = moment( dayOfWeek ).endOf( 'week' );
            if ( moment( i.date ).isBetween( startOfWeek, endOfWeek ) )
              return i;
            return null;
          } )
          .value()
      );
    }
  } )
  .post( '/getMonth', ( req, res ) => {
    if ( !req.body.week ) {
      res.status( 400 ).json( {
        message: 'Bitte geben sie das month ein.',
        error: true,
      } );
    } else {
      res.status( 200 ).json(
        db
          .get( 'speed' )
          .filter( ( i ) => {
            const dayOfMonth = moment().month( req.body.week - 1 );
            const startOfMonth = moment( dayOfMonth ).startOf( 'month' );
            const endOfMonth = moment( dayOfMonth ).endOf( 'month' );
            if ( moment( i.date ).isBetween( startOfMonth, endOfMonth ) )
              return i;
            return null;
          } )
          .value()
      );
    }
  } );

module.exports = router;
