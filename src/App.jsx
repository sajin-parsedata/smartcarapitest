import React, {Component} from 'react';
import axios from 'axios';
import Smartcar from '@smartcar/auth';

import Connect from './components/Connect';
import Vehicle from './components/Vehicle';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vehicle: {},
    };

    this.authorize = this.authorize.bind(this);

    this.onComplete = this.onComplete.bind(this);

    this.smartcar = new Smartcar({
      clientId: "2d130ea0-0dcc-4364-b728-44b155b64581",
      redirectUri: "https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://192.168.2.43:3000",
      scope: ['read_vehicle_info'],
      testMode: true,
      onComplete: this.onComplete,
    });
  }

  onComplete(err, code, state) {
    console.log("code");
    console.log(code);
    return axios
      .get(`${"http://localhost:8000"}/exchange?code=${code}`)
      .then(_ => {
        return axios.get(`${"http://localhost:8000"}/vehicle`);
      })
      .then(res => {
        this.setState({vehicle: res.data});
      }
      );


  }

  authorize() {
    console.log("authorize");
    // this.smartcar.openDialog({forcePrompt: true});
    this.smartcar.openDialog({forcePrompt:true});
    
  }

  render() {
    return Object.keys(this.state.vehicle).length !== 0 ? (
      <Vehicle info={this.state.vehicle} />
    ) : (
      <Connect onClick={this.authorize} />
    );
  }
}

export default App;
