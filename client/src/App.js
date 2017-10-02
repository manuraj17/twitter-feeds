import React, { Component } from 'react';
import { Image, List, Container, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import socketIOClient from "socket.io-client";
import './App.css';

const io = require('socket.io-client'); //('http://localhost:3000/');

class App extends Component {
  constructor(props) {
   super(props);

   this.state = {
     tweets: [],
   }
   this.socket = io.connect();
   this.socket.on('news', data => {
     this.updateTweet(data);
   });
  }
 
  updateTweet(data) {
   let tweets = this.state.tweets;
   if (tweets.length == 25) { 
     console.log("List limit, popping");
     tweets.shift(); 
   }
   tweets.push(data);
   this.setState({tweets: tweets});
  }

  onSocketOpen() {}

  onSocketData(e) {
   console.log(JSON.parse(e));
   this.setState({tweets: JSON.parse(e)});
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render(){
    const numbers = this.state.tweets;
    let list = [];
    list = numbers.map(e => 
      <List.Item key={e.id.toString()}>
        <Image avatar src={e.image} />
        <List.Content>
          <List.Header>{e.user}</List.Header>
          <List.Description>{e.text}</List.Description>
        </List.Content>
      </List.Item>
    ).reverse();
    return(
      <div>
        <Container>
        <Header as='h1'>#javascript</Header>
        <List>
          {list}
        </List>
        </Container>
      </div>
    )
  }
}

export default App;
