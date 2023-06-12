import { Text } from "react-native";

const SubText = ({
  borderWidth,
  borderColor,
  text,
  size,
  color,
  family,
  letterSpacing,
  align = "left",
  leading,
}) => {
  return (
    <Text
      style={{
        fontSize: size,
        color: color,
        fontFamily: family,
        letterSpacing: letterSpacing ? letterSpacing : -0.02,
        textAlign: align,
        lineHeight: leading,
        borderWidth: borderWidth,
        borderColor: borderColor,
      }}
    >
      {text}
    </Text>
  );
};

export default SubText;
