import Link from "next/link";
import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
export function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  useEffect(() => {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth <= 768)
      setIsMobile(true);
  }, [])
  
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={"/"}>
          <img src="/images/logo.svg" alt="ig.news" />
        </Link>
        {isMobile ? (
          <button className={styles.mobileMenu} onClick={()=>{setMobileMenuIsOpen(!mobileMenuIsOpen)}}><FaBars/></button>
        ) : (
          <>
            <nav>
              <ActiveLink activeClassName={styles.active} href="/">
                <a>Home</a>
              </ActiveLink>
              <ActiveLink
                activeClassName={styles.active}
                href="/posts"
                prefetch
              >
                <a>Posts</a>
              </ActiveLink>
            </nav>
            <SignInButton />
          </>
        )}
      </div>
      <div
        className={`${styles.headerMobile} ${mobileMenuIsOpen ? styles.headerMobileActive : ""}`}
      >
        <button className={styles.closeMenuButton} onClick={()=>{setMobileMenuIsOpen(!mobileMenuIsOpen)}}>
          <FiX color="#737380" className={styles.closeIcon} />
        </button>
        <SignInButton />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>
      </div>
      <div className={styles.menuBackdrop}></div>
    </header>
  );
}
