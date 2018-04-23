"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PartsFooter = function PartsFooter(props) {
    return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
            "h6",
            null,
            props.adress
        ),
        _react2.default.createElement(
            "h3",
            null,
            props.copyright
        )
    );
};

exports.default = PartsFooter;