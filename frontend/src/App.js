import './App.css';
import {useState, useEffect} from 'react';

import { serverAuthorization } from './serverSigner';

const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
fcl.config()
    .put("accessNode.api", "https://testnet.onflow.org")
    .put("discovery.wallet", "https://flow-wallet-testnet.blocto.app/authn");

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, [])

  const multiSign = async () => {
    const transactionId = await fcl.send([
      fcl.transaction`
      transaction(number: Int) {
        prepare(frontendUser: AuthAccount, backendAdmin: AuthAccount) {
          
        }
      }
      `,
      fcl.args([
        fcl.arg(2, t.Int)
      ]),
      fcl.payer(serverAuthorization),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz, serverAuthorization]),
      fcl.limit(9999)
    ]).then(fcl.decode);

    console.log(transactionId);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{user && user.addr ? user.addr : "Not logged in."}</h1>
        <div>
          <button onClick={() => fcl.authenticate()}>Log In</button>
          <button onClick={() => fcl.unauthenticate()}>Log Out</button>
        </div>
        <button onClick={() => multiSign()}>Run Multi-Sign Tx</button>
      </header>
    </div>
  );
}

export default App;
