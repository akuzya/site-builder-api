import React from "react";

const Menu = props => {
  return (
    <div>
      <button onClick={props.changeColor}>Поменяй цвет</button>
      <button onClick={props.cancel}>Отмена</button>
      <button onClick={props.getProject}>Получить</button>
    </div>
  );
};

export default Menu;
