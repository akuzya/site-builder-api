import React, { Component } from "react";

import Body from "./components/Body/Body";
import Menu from "./components/Menu";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {}
    };
  }

  changeColor = event => {
    console.log("event: ", event);
    var element = document.createElement("link");
    element.type = "text/css";
    element.rel = "stylesheet";
    element.href = "/change.css";
    element.id = "customcss";
    document.getElementsByTagName("head")[0].appendChild(element);
  };

  cancel = event => {
    let elem = document.getElementById("customcss");
    elem.parentNode.removeChild(elem);
  };

  getProject = event => {
    fetch("/api/getstructure?project=1111", {
      method: "get",
      mode: "cors",
      credentials: "include"
    })
      .then(res => res.ok && res.json())
      .then(res => {
        console.log("res: ", res);
        if (res && res.structure) {
          this.setState({ project: res.structure });
        }
      });
  };

  saveValue = (part, key, newValue) => {
    // console.log('part, key, newValue: ', part, key, newValue);

    // _id, part_id, part

    var data = new FormData();
    data.append("_id", this.state.project._id);
    data.append("part_id", part._id);

    let tObj = part.values.find(el => el.key === key);
    tObj.value = newValue;

    data.append("part", JSON.stringify(part));

    fetch("/api/saveparts", {
      method: "post",
      body: data,
      mode: "cors",
      credentials: "include"
    })
      .then(res => res.ok && res.json())
      .then(res => {
        if (res && res.structure) {
          this.setState({ project: res.structure });
        }
      });
  };

  render() {
    return (
      <div className="App">
        <Menu
          changeColor={this.changeColor}
          cancel={this.cancel}
          getProject={this.getProject}
        />
        <Body project={this.state.project} saveValue={this.saveValue} />
      </div>
    );
  }
}

export default App;
