import routes from "../../routes/Sidebar";
import SidebarMenu from "./SidebarMenu";

export interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  return (
    <ul className="bg-white fixed flex flex-col inset-0 z-50 py-4 min-h-full top-12 w-full max-w-xs dark:text-gray-400 text-gray-500">
      {routes.map((route) => (
        <SidebarMenu key={route.name} {...route} />
      ))}
    </ul>
  );
};

export default Sidebar;
