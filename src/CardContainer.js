import React from "react";
import './index.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { db } from './App.js'


class CardContainer extends React.Component {

  onCardSelected(newSelectedIndex) {
    // select clicked card and unselect previous one
    this.updateDatabaseValue(window.localStorage.getItem("selectedIndex"), false);
    this.updateDatabaseValue(newSelectedIndex, true);
    window.localStorage.setItem("selectedIndex", newSelectedIndex);
  }

  updateDatabaseValue(index, val) {
    const db = getDatabase();
    set(ref(db, 'cards/' + index), {
      is_selected: val
    });
  }

  render() {
    return (
      <div className="card-container">
        {
          [...Array(5)].map((e, i) => <Card key={i} index={i} callback={(i) => this.onCardSelected(i)} />)
        }
      </div>
    );
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }
  componentDidMount() {
    const isSelectedRef = ref(db, 'cards/' + this.props.index + "/is_selected");

    // the passed arrow function will get called whenever the value in database changes 
    onValue(isSelectedRef, (snapshot) => {
      // setting state will cause this component to re-render as state is being used in render method
      this.setState({
        isSelected: snapshot.val()
      });
    });
  }

  onClicked() {
    // don't select already selected cards
    if (!this.state.isSelected) {
      this.props.callback(this.props.index)
    }
  }

  render() {
    let className = "card";

    // add to class list according to selection status for applying styles
    if (this.state.isSelected) {
      if (this.props.index == window.localStorage.getItem("selectedIndex")) {
        className += " selected-by-me-card";
      }
      else {
        className += " selected-card";
      }
    } else {
      className += " unselected-card";
    }
    return (
      <div className={className} onClick={() => this.onClicked()} ></div>
    );
  }
}

export default CardContainer;  