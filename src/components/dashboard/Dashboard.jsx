import styles from "./Dashboard.module.css";
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
  const [playlistStats, setPlaylistStats] = useState([]);
  const [activeFilter, setActiveFilter] = useState("stats");
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylistName, setCurrentPlaylistName] = useState("");

  const toggleMenu = isVisible => setMenuVisible(isVisible);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1338/api/materials?populate=posts.media&populate=posts.brand"
        );
        const data = response.data.data;
        setPlaylists(data);

        if (data[currentPlaylistIndex]) {
          const playlist = data[currentPlaylistIndex];
          setPlaylistStats(playlist.attributes.posts);
          setCurrentPlaylistName(playlist.attributes.title);
        }
      } catch (err) {
        console.error("Failed to fetch playlists", err);
      }
    };

    fetchPlaylists();
  }, [currentPlaylistIndex]);

  const brandNames = playlistStats.map(
    item => item.brand.data?.attributes.companyName || "Unknown Brand"
  );
  console.log("brandNames", brandNames);
  const playsTimeData = playlistStats.map(item => item.playsTime || 0);

  return (
    <section className={styles.container}>
      {menuVisible && (
        <HiddenMenu
          closeMenu={() => toggleMenu(false)}
          setChangePlaylist={setCurrentPlaylistIndex}
          displayPlaylists={playlists}
          setPlaylistName={setCurrentPlaylistName}
        />
      )}
      <section className={styles.wrapper}>
        <section className={styles.nav}>
          <div className={styles.menu_bar}>
            <button className={styles.menu} onClick={() => toggleMenu(true)}>
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
        <section className={styles.playlist_name}>
          <h3>{currentPlaylistName}</h3>
        </section>
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
        {activeFilter === "stats" && (
          <Stats
            playsTimeData={playsTimeData}
            brandNames={brandNames}
            playlistStats={playlistStats}
          />
        )}
      </section>
    </section>
  );
};

export default Statistics;
