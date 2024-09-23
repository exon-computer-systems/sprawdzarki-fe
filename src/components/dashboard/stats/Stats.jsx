import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import styles from "./Stats.module.css";
const Stats = ({ playsTimeData, brandNames, playlistStats }) => {
  const getTotalTime = () => {
    return playlistStats
      .filter(e => e.playsTime >= 0)
      .map(e => e.playsTime)
      .reduce((acc, curr) => acc + curr, 0);
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
      </section>
    </>
  );
};

export default Stats;
