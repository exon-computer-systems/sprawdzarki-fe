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
import Table from "./table/Table";

const Statistics = () => {
    const [playlistStats, setPlaylistStats] = useState([]);
    const [activeFilter, setActiveFilter] = useState("stats");
    const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [currentPlaylistName, setCurrentPlaylistName] = useState("");
    const [isAdminPanel, setIsAdminPanel] = useState(false);

    const toggleMenu = (isVisible) => setMenuVisible(isVisible);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.68.247:1338/api/materials?populate=posts.media&populate=posts.brand"
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
        (item) => item.brand.data?.attributes.companyName || "Unknown Brand"
    );
    console.log("brandNames", brandNames);
    const playsTimeData = playlistStats.map((item) => item.playsTime || 0);

    const toggleAdminPanel = () => {
        setIsAdminPanel(!isAdminPanel);
    };

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
                        <button
                            className={styles.menu}
                            onClick={() => toggleMenu(true)}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <h3>Dashboard</h3>
                    </div>

                    <div className={styles.admin_panel}>
                        <button
                            onClick={toggleAdminPanel}
                            className={styles.admin_button}
                        >
                            <p>
                                {isAdminPanel
                                    ? "Przejdź do panelu statystyk"
                                    : "Przejdź do panelu admina"}
                            </p>
                            <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                                style={{ marginLeft: "10px" }}
                            />
                        </button>
                    </div>
                </section>

                <section className={styles.playlist_name}>
                    <h3>{currentPlaylistName}</h3>
                </section>

                <section className={styles.iframe}>
                    {isAdminPanel ? (
                        <iframe
                            src="http://192.168.68.247:1338/admin" // można zmienić na inny port/link
                            title="Admin Panel"
                            className={styles.iframe}
                        ></iframe>
                    ) : (
                        <>
                            <section className={styles.filters}>
                                <section className={styles.analytics}>
                                    <span
                                        onClick={() => setActiveFilter("stats")}
                                        className={`${styles.option} ${
                                            activeFilter === "stats" &&
                                            styles.active
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faChartColumn} />
                                        <p>Statystyki</p>
                                    </span>
                                    <span className={styles.divider}></span>
                                    <span
                                        onClick={() => setActiveFilter("table")}
                                        className={`${styles.option} ${
                                            activeFilter === "table" &&
                                            styles.active
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faTable} />
                                        <p>Tabela</p>
                                    </span>
                                </section>
                            </section>
                            <span className={styles.section_divider}></span>

                            <section className={styles.graphs_section}>
                                {activeFilter === "stats" ? (
                                    <Stats
                                        playsTimeData={playsTimeData}
                                        brandNames={brandNames}
                                        playlistStats={playlistStats}
                                    />
                                ) : (
                                    <Table
                                        brandNames={brandNames}
                                        playsTimeData={playsTimeData}
                                        playlistStats={playlistStats}
                                    />
                                )}
                            </section>
                        </>
                    )}
                </section>
            </section>
        </section>
    );
};

export default Statistics;
