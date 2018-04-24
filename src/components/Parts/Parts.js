import React from "react";

import Part from "./Part";

const Parts = props => {

  return (
    <ul style={{ color: props.globalValues.accentColor }}>
      {props.parts.map(el => (
        <Part
          key={el._id}
          globalValues={props.globalValues}
          values={el.values}
          saveValue={props.saveValue.bind(null,el)}
        />
      ))}
    </ul>
  );
};

export default Parts;
