import { Link } from "react-router-dom";

import { Search } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import Container from "@/shared/ui/container/Container";
import NavbarSearch from "@/widgets/navbar-search/NavbarSearch";
import UserMenu from "@/widgets/user-menu/UserMenu";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className={styles.navbar}>
      <Container>
        <div className={styles.inner}>
          {/* LEFT */}

          <div className={styles.left}>
            <Link
              to="/"
              className={styles.logo}
            >
              ModPlatform
            </Link>

            <nav className={styles.nav}>
              <Link to="/">
                Discover
              </Link>

              <Link to="/search">
                Search
              </Link>
            </nav>
          </div>

          {/* CENTER */}

          <div className={styles.search}>
            <Search size={18} />

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
      </Container>
    </header>
  );
}