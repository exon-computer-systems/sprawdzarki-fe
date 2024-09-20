import styles from "./Statistics.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faArrowUpRightFromSquare,
  faChartColumn,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";

import Stats from "./stats/Stats";
import HiddenMenu from "./hiddenMenu/HiddenMenu";

const Statistics = () => {
  const [getStats, setGetStats] = useState([]);
  const [activeFilter, setActiveFilter] = useState("stats");
  const [changePlaylist, setChangePlaylist] = useState(0);
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleOpenMenu = () => {
    setToggleMenu(() => true);
  };

  const handleCloseMenu = () => {
    setToggleMenu(() => false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1338/api/materials?populate=posts"
        );
        const posts = response.data.data[0].attributes.posts;
        if (Array.isArray(posts)) {
          setGetStats(posts);
        } else {
          console.error("Posts data is not an array");
        }

        if (Array.isArray(posts)) {
          setGetStats(posts);
        } else {
          console.error("Posts data is not an array");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const brandNames = Array.isArray(getStats)
    ? getStats.map(item => item.brand || "Unknown Brand")
    : [];

  const playsTimeData = Array.isArray(getStats)
    ? getStats.map(item => item.playsTime || 0)
    : [];

  console.log(getStats);

  return (
    <section className={styles.container}>
      {toggleMenu && <HiddenMenu closeMenu={handleCloseMenu} />}
      <section className={styles.wrapper}>
        <section className={styles.nav}>
          <div className={styles.menu_bar}>
            <button className={styles.menu} onClick={handleOpenMenu}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h3>Dashboard</h3>
          </div>
          <div className={styles.admin_panel}>
            <a href="http://localhost:1338/admin">
              <p>Przejdź do panelu admina</p>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </div>
        </section>
        <secion className={styles.playlist_name}>
          <h3>Playlist1</h3>
        </secion>
        <section className={styles.filters}>
          <section className={styles.analytics}>
            <span
              onClick={() => setActiveFilter("stats")}
              className={`${styles.option} ${
                activeFilter === "stats" && styles.active
              }`}
            >
              <FontAwesomeIcon icon={faChartColumn} />
              <p>Statystyki</p>
            </span>
            <span className={styles.divider}></span>
            <span
              onClick={() => setActiveFilter("table")}
              className={`${styles.option} ${
                activeFilter === "table" && styles.active
              }`}
            >
              <FontAwesomeIcon icon={faTable} />
              <p>Tabela</p>
            </span>
          </section>
        </section>
        <span className={styles.section_divider}></span>
      </section>

      <section className={styles.graphs_section}>
        {activeFilter === "stats" ? (
          <Stats playsTimeData={playsTimeData} brandNames={brandNames} />
        ) : (
          ""
        )}
      </section>
    </section>
  );
};

export default Statistics;
