import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    console.log("Constructor");
    this.state = { users: [] };
  }

  componentDidMount(){
    fetch('/users')
    .then(res => res.json())
    .then(users => {
      console.log("Recieved: ", users);
      this.setState({users})
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user => 
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

export default App;
