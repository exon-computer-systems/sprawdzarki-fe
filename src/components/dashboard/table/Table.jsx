import styles from "./Table.module.css";

const Table = ({ playlistStats, playsTimeData, brandNames }) => {
  return (
    <section className={styles.container}>
      <section className={styles.table_wrapper}>
        <table>
          <tbody>
            <tr>
              <th>Nazwa reklamy</th>
              <th>Marka</th>
              <th>Całkowity czas reklamy (s)</th>
              <th>Ilość odtworzeń</th>
              <th>Ilość pełnych odtworzeń</th>
            </tr>
            {playlistStats.map((ad, i) => (
              <>
                <tr key={ad.id}>
                  <th>{ad.title}</th>
                  <th>{ad.brand.data?.attributes.companyName}</th>
                  <th>{ad.playsTime} s</th>
                  <th>{ad.playsCount}</th>
                  <th>{ad.fullPlaysCount}</th>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default Table;
