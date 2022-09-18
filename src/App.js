import React from "react";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { initializeApp } from 'firebase/app'
import CardContainer from './CardContainer.js'

const MAX_NUMBER_OF_PLAYERS = 3

initializeApp({
  apiKey: "AIzaSyACfrYEmahY7CfS8YEhWwFpoKjqg9t6Pu0",
  authDomain: "card-game-4942b.firebaseapp.com",
  databaseURL: "https://card-game-4942b-default-rtdb.firebaseio.com",
  projectId: "card-game-4942b",
  storageBucket: "card-game-4942b.appspot.com",
  messagingSenderId: "389347034713",
  appId: "1:389347034713:web:da36bae9095d2ad016d348",
  measurementId: "G-R98N58Q3H6",
});

export const db = getDatabase();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joined: window.localStorage.getItem("joined")
    }
  }

  componentDidMount() {
    // try to join if player has not joined previously
    if (window.localStorage.getItem("joined") !== "yes") {

      let count;
      get(child(ref(db), "player_count")).then((snapshot) => {
        count = snapshot.val();

        // check if there's enough space to join
        if (count < MAX_NUMBER_OF_PLAYERS) {
          set(ref(db, "player_count"), count + 1)
          window.localStorage.setItem("joined", "yes");
          this.setState({
            joined: true
          })
        }
        else {
          this.setState({
            joined: false
          })
        }
      });
    }
  }

  clearSelection() {
    set(ref(db, "cards/" + window.localStorage.getItem("selectedIndex")), {
      is_selected: false
    })
    window.localStorage.setItem("selectedIndex", undefined);
  }

  render() {
    return (
      <div className="App">
        {
          this.state.joined ?
            <div>
              <button className="clear-btn" onClick={this.clearSelection}>Clear</button>
              <CardContainer />
            </div>:
            maxPlayersReached()
        }

      </div >
    );
  }
}


function maxPlayersReached() {
  return (
    <div>
      <h1>Max Players Reached</h1>
    </div>
  );
}

export default App;
