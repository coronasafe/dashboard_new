import { Backdrop, Transition } from "@windmill/react-ui"
import { useState } from "react"
import HamburgerIcon from "../lib/assets/icons/HamburgerIcon"
import CoronaSafeIcon from "../lib/assets/icons/CoronaSafeLogo"
import { Sidebar } from "./Sidebar"
import Link from "next/link"

interface NavBarProps {}

const NavBar: React.FunctionComponent<NavBarProps> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center bg-white shadow-md h-12 px-5">
      <HamburgerIcon
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <Link href="/">
        <button
          type="button"
          aria-label="Care Dashboard"
          className="hidden mx-5 md:block"
        >
          <span className="flex text-2xl subpixel-antialiased font-black leading-none text-primary-500">
            Care Dashboard
          </span>
        </button>
      </Link>

      <div className="ml-auto">
        <CoronaSafeIcon />
      </div>

      <Transition show={isOpen}>
        <>
          <Transition
            enter="transition ease-in-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in-out duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Backdrop className="top-12" onClick={(_) => setIsOpen(false)} />
          </Transition>

          <Transition
            enter="transition ease-in-out duration-150"
            enterFrom="opacity-0 transform -translate-x-20"
            enterTo="opacity-100"
            leave="transition ease-in-out duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 transform -translate-x-20"
          >
            <Sidebar />
          </Transition>
        </>
      </Transition>
    </div>
  )
}

export default NavBar
