import React from "react";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
        <div className={styles.top}>
            <a href="#">Home</a>
            <a href="#/atrack">Anime</a>
            <a href="#/mtrack">Manga</a>
            <a href="#/other">Other</a>
        </div>
    </div>
  );
};

export default Header;
