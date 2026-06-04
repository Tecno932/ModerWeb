import { useState } from "react";

import { Link } from "react-router-dom";

import {
  Menu,
  X,
  Search,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import Container from "@/shared/ui/container/Container";

import NavbarSearch from "@/widgets/navbar-search/NavbarSearch";
import UserMenu from "@/widgets/user-menu/UserMenu";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <header className={styles.navbar}>
      <Container>
        <div className={styles.inner}>
          {/* MOBILE MENU BUTTON */}

          <button
            className={
              styles.mobileToggle
            }
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          {/* LEFT */}

          <div className={styles.left}>
            <Link
              to="/"
              className={styles.logo}
            >
              ModPlatform
            </Link>

            <nav
              className={styles.nav}
            >
              <Link to="/">
                Discover
              </Link>

              <Link to="/search">
                Search
              </Link>
            </nav>
          </div>

          {/* SEARCH */}

          <div className={styles.search}>
            <Search size={16} />

            <NavbarSearch />
          </div>

          {/* RIGHT */}

          <div className={styles.right}>
            <Link
              to="/create"
              className={
                styles.createButton
              }
            >
              + Upload
            </Link>

            {user ? (
              <UserMenu />
            ) : (
              <div
                className={
                  styles.auth
                }
              >
                <Link to="/login">
                  Login
                </Link>

                <Link
                  to="/register"
                  className={
                    styles.register
                  }
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}

        {mobileOpen && (
          <div
            className={
              styles.mobileMenu
            }
          >
            <Link
              to="/"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
            >
              Discover
            </Link>

            <Link
              to="/search"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
            >
              Search
            </Link>

            <Link
              to="/create"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
            >
              Upload
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}