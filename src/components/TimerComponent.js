import React from 'react';
import * as Status from '../redux/status';

const getTimeLeft = (revealTime, maxTime) => {
  const dateNow = Date.now()/1000;
  console.log(dateNow);
  console.log(revealTime + maxTime);
  console.log( maxTime);
  console.log(revealTime );

  if (dateNow > revealTime + maxTime) {
    return 0;
  } else {
    return Math.floor(revealTime + maxTime - dateNow);
  }
}

export const Timer = (props) => {

  if ((props.players[0].status2 === Status.ST2.REVEALED 
    && props.players[1].status2 !== Status.ST2.REVEALED) 
    || 
    (props.players[1].status2 === Status.ST2.REVEALED 
    && props.players[0].status2 !== Status.ST2.REVEALED)) {
      const timeLeft = getTimeLeft(props.revealTime, props.maxTime);
      if (timeLeft > 0) {
        return (
          <div>
            <p className="action">1st commit revealed on {(new Date(props.revealTime).toLocaleString('en-GB'))}</p>
            <p className="action">2nd reveal to happen before the next {getTimeLeft(props.revealTime, props.maxTime)} seconds</p>
          </div>
        );
      } else {
        return (
          <div className="action">
            <p>Time's up !</p>
            <p>It's too late for the second player to reveal...</p>
          </div>
        );
      }
  } else {
    return (<div></div>);
  }
}