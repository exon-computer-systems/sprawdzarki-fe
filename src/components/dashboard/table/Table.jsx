import { useEffect, useState } from "react";
import styles from "./Table.module.css";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartsLegend } from "@mui/x-charts";

const Table = ({ playlistStats }) => {
    const [companyNames, setCompanyNames] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.68.247:1338/api/materials?populate=posts.brand"
                );
                const data = response.data.data;

                const brands = new Set(
                    data.flatMap((playlist) =>
                        playlist.attributes.posts.flatMap((post) =>
                            post.brand?.data?.attributes?.companyName
                                ? post.brand.data.attributes.companyName
                                : []
                        )
                    )
                );

                setCompanyNames([...brands]);
            } catch (err) {
                console.error("Failed to fetch playlists", err);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <section className={styles.container}>
            <section className={styles.table_wrapper}>
                {companyNames.map((comp) => {
                    const companyAds = playlistStats.filter(
                        (ad) => ad.brand?.data?.attributes.companyName === comp
                    );

                    const totalPlaysTime = companyAds.reduce(
                        (sum, ad) => sum + ad.playsTime,
                        0
                    );
                    const totalPlaysCount = companyAds.reduce(
                        (sum, ad) => sum + ad.playsCount,
                        0
                    );
                    const totalFullPlaysCount = companyAds.reduce(
                        (sum, ad) => sum + ad.fullPlaysCount,
                        0
                    );

                    const chartData = {
                        titles: companyAds.map((ad) => ad.title),
                        playsCount: companyAds.map((ad) => ad.playsCount),
                        fullPlaysCount: companyAds.map(
                            (ad) => ad.fullPlaysCount
                        ),
                    };

                    return (
                        <>
                            <h2>{comp}</h2>
                            <table className={styles.table} key={comp}>
                                <tbody>
                                    <tr>
                                        <th>{comp}</th>
                                        <th>Całkowity czas reklamy (s)</th>
                                        <th>Ilość odtworzeń</th>
                                        <th>Ilość pełnych odtworzeń</th>
                                    </tr>
                                    {companyAds.map((ad) => (
                                        <tr key={ad.id}>
                                            <td>{ad.title}</td>
                                            <td>{ad.playsTime} s</td>
                                            <td>{ad.playsCount}</td>
                                            <td>{ad.fullPlaysCount}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th>Podsumowanie</th>
                                        <th>{totalPlaysTime} s</th>
                                        <th>{totalPlaysCount}</th>
                                        <th>{totalFullPlaysCount}</th>
                                    </tr>
                                </tbody>
                            </table>

                            <section
                                className={`${styles.graph} ${styles.quarter_stats}`}
                            >
                                <BarChart
                                    series={[
                                        {
                                            name: "Plays Count",
                                            data: chartData.playsCount,
                                        },
                                        {
                                            name: "Full Plays Count",
                                            data: chartData.fullPlaysCount,
                                        },
                                    ]}
                                    height={300}
                                    xAxis={[
                                        {
                                            data: chartData.titles,
                                            scaleType: "band",
                                        },
                                    ]}
                                    margin={{
                                        top: 30,
                                        bottom: 50,
                                        left: 50,
                                        right: 30,
                                    }}
                                />

                                <section className={styles.legend}>
                                    <section className={styles.play_count}>
                                        <span
                                            className={styles.play_count_color}
                                        ></span>{" "}
                                        <span
                                            className={styles.play_count_text}
                                        >
                                            Ilośc odtworzeń
                                        </span>
                                    </section>
                                    <section className={styles.fullplay_count}>
                                        <span
                                            className={
                                                styles.fullplay_count_color
                                            }
                                        ></span>{" "}
                                        <span
                                            className={
                                                styles.fullplay_count_text
                                            }
                                        >
                                            Ilość pełnych odtworzeń
                                        </span>
                                    </section>
                                </section>
                            </section>
                        </>
                    );
                })}
            </section>
        </section>
    );
};

export default Table;
