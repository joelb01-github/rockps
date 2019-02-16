import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import * as ActionTypes from '../redux/actionTypes';
import * as Status from '../redux/status';

const mapDispatchToProps = dispatch => {
  return {
    submitCommit: (index, choice, nounce, player) => dispatch({ 
      type: ActionTypes.SUBMIT_COMMIT_REQUEST, 
      payload: {
        index: index,
        choice: choice,
        nounce: nounce,
        player: player
      }}),
    revealCommit: (index, choice, nounce, player) => dispatch({ 
      type: ActionTypes.REVEAL_COMMIT_REQUEST, 
      payload: {
        index: index,
        choice: choice,
        nounce: nounce,
        player: player
      }})
  };
};

class PlayerForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      choices: [0, 0],
      nounces: [0, 0]
    };

    this.handleChangeChoice = this.handleChangeChoice.bind(this);
    this.handleChangeNounce = this.handleChangeNounce.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.handleNounce = this.handleNounce.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChangeChoice = (event) => {
    (this.props.index === 0) 
      ? this.setState({ choices: [event.target.value, this.state.choices[1]] })
      : this.setState({ choices: [this.state.choices[0], event.target.value] });
  };

  handleChangeNounce = (event) => { 
    (this.props.index === 0) 
      ? this.setState({ nounces: [event.target.value, this.state.nounces[1]] })
      : this.setState({ nounces: [this.state.nounces[0], event.target.value] });
  };

  handleChoice = (index) => { return this.state.choices[index]; };
  handleNounce = (index) => { return this.state.nounces[index]; };

  handleSubmit = (event) => {
    event.preventDefault();
    (this.props.type === 'commit')
      ? this.props.submitCommit(
        this.props.index,
        this.state.choices[this.props.index],
        this.state.nounces[this.props.index],
        this.props.player)
      : this.props.revealCommit(
        this.props.index,
        this.state.choices[this.props.index],
        this.state.nounces[this.props.index],
        this.props.player);

    (this.props.index === 0) 
      ? this.setState({ nounces: ['', this.state.nounces[1]] })
      : this.setState({ nounces: [this.state.nounces[0], ''] });
  };

  render() {

    const Commit = () => {
      if(this.props.player.act === Status.ACT.SENDING) {
        return (<></>);
      }
      else {
        return ( <Button>Commit</Button> );
      }
    }

    return(
      <Form onSubmit={(event) => this.handleSubmit(event)}>
        <FormGroup>
          <Label for="choice">Pick a choice</Label>
          <Input type="select" id="choice" name="choice" 
          value={this.handleChoice(this.props.index)} 
          onChange={(event) => this.handleChangeChoice(event)}>
            <option value="0">Rock</option>
            <option value="1">Paper</option>
            <option value="2">Scissor</option>
          </Input>
          <Label for="nounce">Pick a secret number</Label>
          <Input type="text" id="nounce" name="nounce" 
          value={this.handleNounce(this.props.index)} 
          onChange={(event) => this.handleChangeNounce(event)}
          placeholder="your secret number">
          </Input>
        </FormGroup>
        <Commit />
      </Form>
    );
  }

}

export default connect(null, mapDispatchToProps)(PlayerForm);