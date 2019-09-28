import React from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    count: state.count
  };
}

class Counter extends React.Component {

  increment = () => {
    this.props.dispatch({ type: "INCREMENT" });
  };
  
  decrement = () => {
    this.props.dispatch({ type: "DECREMENT" });
  };

  reset = () => {
    this.props.dispatch({ type: "RESET" });
  };

  render() {
    return (
      <div>
        <button onClick={this.decrement}>-</button>
        <span>{this.props.count}</span>
        <button onClick={this.increment}>+</button>
        <br />
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Counter);
