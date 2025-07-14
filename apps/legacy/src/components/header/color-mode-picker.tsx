import {
  IconButton,
  type IconButtonProps,
  useColorMode,
} from "components/core";
import { IoMdMoon } from "react-icons/io";
import { MdWbSunny } from "react-icons/md";

export const ColorModePicker = (props: Partial<IconButtonProps>) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      icon={
        colorMode === "dark" ? (
          <MdWbSunny fontSize="24px" color="var(--textSecondaryColor)" />
        ) : (
          <IoMdMoon fontSize="24px" color="var(--textSecondaryColor)" />
        )
      }
      aria-label={colorMode === "dark" ? "Light mode" : "Dark mode"}
      variant="ghost"
      {...props}
    />
  );
};
