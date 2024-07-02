import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const ResponsiveImage = ({ src, width, height, objectFit, alt, bgColor }) => {
  return (
    <div
      style={{
        width: width ?? "100%",
        position: "relative",
        height: height ?? "100%",
        backgroundColor: bgColor ?? "transparent",
      }}
    >
      <Image
        src={src}
        alt={alt ?? "icon"}
        objectFit={objectFit ?? "contain"}
        layout="fill"
      />
    </div>
  );
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  objectFit: PropTypes.string,
};

export default ResponsiveImage;
