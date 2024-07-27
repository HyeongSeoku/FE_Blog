import { useState } from "react";
import "../../styles/hamburger.css";
import { Link } from "react-router-dom";
import useUserStore from "store/user";

const HamburgerButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { userStore } = useUserStore();

  const toggleMenu = () => {
    setIsOpen((state) => !state);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button className="hamburger-container" onClick={toggleMenu}>
          <div className={"hamburger-line"}></div>
          <div className={"hamburger-line"}></div>
          <div className={`hamburger-line`}></div>
        </button>
      )}

      <div
        className={`fixed top-0 left-0 w-full h-full flex flex-col bg-white shadow-lg transition-all duration-300 transform ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {isOpen && (
          <button className="py-2 px-4 ml-auto" onClick={toggleMenu}>
            X
          </button>
        )}
        <nav>
          <ul
            className={`flex flex-col transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <li className="px-4 py-2 cursor-pointer flex">
              <Link to="/" className="w-full h-full" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            {userStore.isAdmin && (
              <li className="px-4 py-2 cursor-pointer flex">
                <Link
                  to="/write"
                  className="w-full h-full"
                  onClick={handleLinkClick}
                >
                  Write
                </Link>
              </li>
            )}
            <li className="px-4 py-2 cursor-pointer flex">
              <Link
                to="/about"
                className="w-full h-full"
                onClick={handleLinkClick}
              >
                About
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer flex">
              <Link
                to="/login"
                className="w-full h-full"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HamburgerButton;
