import colors from "@/constants/colors";

const randomColorGenerator = () => {
  return colors[
    Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)]
  ];
};

export default randomColorGenerator;
