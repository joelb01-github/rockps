import React from 'react';
import { Card, CardHeader, CardBody, CardText, CardFooter } from 'reactstrap';
import PlayerForm from './PlayerFormComponent';
import * as Status from '../redux/status';

const Player = (props) => {
    
  const ShowAction = ({ player }) => {
    if (player.act !== Status.ACT.NONE ) {
        return (<span className="action"> {player.act} </span>);
      }
    else { return (<> </>); }
  };

  const Commit = ({ index, player }) => {
    if (player.status1 === Status.ST1.NOT_COMMITTED) {
      return ( 
        <PlayerForm 
          index={index} 
          type={'commit'}
          player={player}/> 
      );
    }
    else {
      return (
        <>
          <CardText>{player.status1}</CardText> 
          <CardText>Contract used: {player.addr}</CardText>
        </>
      );
    }
  }

  const Reveal = ({ index, player }) => {
    if ( player.status1 === Status.ST1.COMMITTED
    && player.status2 === Status.ST2.NOT_REVEALED
    && player.pl2status1 === Status.ST1.COMMITTED) {
      return (
        <PlayerForm 
          index={index} 
          type={'reveal'}
          player={player}/> 
      );
    }
    else if (player.pl2status1 === Status.ST1.NOT_COMMITTED) {
      return (
        <CardText>{Status.ACT.PENDING}</CardText> 
      );
    }
    else {
      return (
        <CardText>{player.status2}</CardText> 
      );
    }
  }

  return (
    <Card>
      <CardHeader tag="h4">{props.name}</CardHeader>
      <div>
        <CardHeader tag="h6">Phase 1: Commit</CardHeader>
        <CardBody>
          <Commit 
            index={props.index} 
            player={props.player} />
        </CardBody>
      </div>
      <div>
        <CardHeader tag="h6">Phase 2: Reveal</CardHeader>
        <CardBody>
          <Reveal
            index={props.index} 
            player={props.player} />
        </CardBody>
      </div>
      <CardFooter className="text-muted">
        <ShowAction player={props.player} />
      </CardFooter>
    </Card>
  );

};

export default Player;