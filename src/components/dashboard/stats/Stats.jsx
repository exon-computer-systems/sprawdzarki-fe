import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import styles from "./Stats.module.css";
const Stats = ({ playsTimeData, brandNames, playlistStats }) => {
  const [getPercentage, setGetPercentage] = useState([]);
  const getTotalTime = () => {
    return playlistStats
      .filter(e => e.playsTime >= 0)
      .map(e => e.playsTime)
      .reduce((acc, curr) => acc + curr, 0);
  };

  useEffect(() => {
    const totalPlays = playlistStats.reduce(
      (acc, ad) => acc + ad.playsCount,
      0
    );

    const formattedData = playlistStats.map(ad => ({
      id: ad.id,
      value: ((ad.playsCount / totalPlays) * 100).toFixed(2),
      label: ad.title,
    }));

    setGetPercentage(formattedData);
  }, [playlistStats]);

  const getTotalPercent = () => {
    console.log(playlistStats.filter(e => e.playsCount >= 0));
  };

  getTotalPercent();

  const getTotalAds = () => {
    return playlistStats.reduce((acc, curr) => acc + curr.playsCount, 0);
  };

  return (
    <>
      <section className={styles.overview}>
        <section className={styles.bar_item}>
          <p>Ilość reklam</p>
          <span>{playlistStats.length}</span>
        </section>
        <section className={styles.bar_item}>
          <p>Całkowity czas</p>
          <span>{getTotalTime()} sek</span>
        </section>
        <section className={styles.bar_item}>
          <p>Łączna ilość odtworzeń</p>
          <span>{getTotalAds()}</span>
        </section>
        <section className={styles.bar_item}>
          <p>Wyświetlone reklamy</p>
          <span>75%</span>
        </section>
      </section>
      <section className={styles.graph_container}>
        <section className={`${styles.graph} ${styles.brand_stats}`}>
          <h2>Statystyki marek</h2>
          <BarChart
            xAxis={[
              {
                id: "barCategories",
                data: brandNames.length
                  ? brandNames
                  : ["Bosch", "Makita", "Amica"],
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: playsTimeData.length ? playsTimeData : [10, 20, 30],
              },
            ]}
            width={400}
            height={250}
          />
        </section>
        <section className={`${styles.graph} ${styles.quarter_stats}`}>
          <h2>Statystyki kwartalne</h2>
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            width={350}
            height={150}
            xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </section>
        <section className={`${styles.graph} ${styles.quarter_stats}`}>
          <h2>
            Procentowy udział reklam na podstawie ogólnej liczby odtworzeń
          </h2>
          <PieChart
            series={[
              {
                data: getPercentage,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            width={400}
            height={200}
          />
        </section>
      </section>
    </>
  );
};

export default Stats;
