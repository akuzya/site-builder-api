import React, { Component } from "react";
import "./Body.css";
import Parts from "../Parts/Parts";

function remap(gV) {
  let tObj = {};
  gV.forEach(el => {
    tObj[el.key] = el.value;
  });
  return tObj;
}

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "projects list",
      projectId: 0
    };
  }

  render() {
    let { project, saveValue } = this.props;
    return (
      <div className="main-body customer">
        {project.project}
        {project.parts && (
          <Parts
            globalValues={remap(project.globalValues)}
            parts={project.parts}
            saveValue={saveValue}
          />
        )}
      </div>
    );
  }
}

export default Body;
