import styles from "./HiddenMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const HiddenMenu = ({ closeMenu }) => {
  return (
    <section className={styles.container}>
      <section className={styles.heading}>
        <button onClick={closeMenu}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className={styles.heading}>Dashboard</h2>
      </section>
      <section className={styles.wrapper}>
        <span className={styles.divider}></span>
        <section className={styles.option}>Playlist1</section>
        <span className={styles.divider}></span>
        <section className={styles.option}>Playlist2</section>
      </section>
    </section>
  );
};

export default HiddenMenu;
