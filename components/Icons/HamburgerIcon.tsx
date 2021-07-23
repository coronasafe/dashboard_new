import { Menu, X } from "react-feather";

export interface HamburgerIconProps {
  isOpen: boolean;
  onClick?: () => void;
}

const HamburgerIcon: React.FunctionComponent<HamburgerIconProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button className="cursor-pointer text-primary-700 focus:ring-2 rounded-sm">
      {isOpen ? <X onClick={onClick} /> : <Menu onClick={onClick} />}
    </button>
  );
};

export default HamburgerIcon;
