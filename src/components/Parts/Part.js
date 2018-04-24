import React, { Component } from "react";

function getValue(arr, key) {
  console.log("arr, key: ", arr, key);

  let tObj = arr.find(el => el.key === key);
  console.log("tObj: ", tObj);

  return tObj.value;
}

class Part extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redo: false,
      editValue: "",
      editKey:""
    };
  }

  click = (key, event) => {
    this.setState({ redo: true, editValue: event.target.innerText,editKey:key });
    event.preventDefault();
  };

  blur = event => {
    this.setState({ redo: false });
    this.props.saveValue(this.state.editKey, this.state.editValue);
  };

  change = event => {
    this.setState({ editValue: event.target.value });
  };

  render() {
    return (
      <li>
        {(this.state.redo && this.state.editKey==="mainText") ? (
          <input
            type="text"
            value={this.state.editValue}
            onBlur={this.blur}
            onChange={this.change}
          />
        ) : (
          <span onClick={this.click.bind(this, "mainText")}>
            {getValue(this.props.values, "mainText")}
          </span>
        )}
      </li>
    );
  }
}

export default Part;
