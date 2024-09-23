import styles from "./HiddenMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const HiddenMenu = ({
  closeMenu,
  setChangePlaylist,
  displayPlaylists,
  setPlaylistName,
}) => {
  return (
    <section className={styles.container}>
      <section className={styles.heading}>
        <button onClick={closeMenu}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className={styles.heading}>Dashboard</h2>
      </section>
      {displayPlaylists.map((e, index) => (
        <section className={styles.wrapper} key={e.id}>
          <span className={styles.divider}></span>

          <section
            onClick={() => {
              setChangePlaylist(index);
              setPlaylistName(e.attributes.title);
            }}
            className={styles.option}
          >
            {e.attributes.title}
          </section>
        </section>
      ))}
    </section>
  );
};

export default HiddenMenu;
