import React from "react";
import propType from "prop-types";

const Divider = ({ thick = 2, color, isVertical, margin }) => {
  return (
    <div
      style={{
        width: isVertical ? `${thick}px` : "100%",
        height: isVertical ? "100%" : `${thick}px`,
        backgroundColor: color ?? "#F2F4F7",
        margin: margin ?? 0,
      }}
    />
  );
};

Divider.propTypes = {
  thick: propType.number,
  color: propType.string,
  isVertical: propType.bool,
  margin: propType.string,
};

export default Divider;
