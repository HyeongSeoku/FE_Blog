import { useState } from "react";
import "../../../app/styles/hamburger.css";
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
      <button className="hamburger-container" onClick={toggleMenu}>
        <div className={"hamburger-line"}></div>
        <div className={"hamburger-line"}></div>
        <div
          className={`hamburger-line ${isOpen && "open-hamburger-last-line"}`}
        ></div>
      </button>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 transition-opacity duration-300 z-5 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={toggleMenu}
      ></div>
      <div
        className={`fixed top-0 right-0 w-1/3 h-fit bg-white transition-transform duration-300 z-10  ${isOpen ? "transform translate-x-0 visible" : "transform translate-x-full invisible"}`}
      >
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={handleLinkClick}>
                About
              </Link>
            </li>
            {userStore.isAdmin && (
              <li>
                <Link to="/write" onClick={handleLinkClick}>
                  Write
                </Link>
              </li>
            )}
            <li>
              <Link to="/login" onClick={handleLinkClick}>
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
