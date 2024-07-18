import styles from "./Styles.module.scss";

type Props = {
  color?: "yellow" | "red";
};

//Color can ba yellow or red
const WarningExclamation = ({ color = "yellow" }: Props) => {
  return (
    <div
      className={`${styles.container} ${
        color === "yellow" ? styles.yellow : color === "red" ? styles.red : ""
      }`}
    >
      <span
        className={`${
          color === "yellow" ? styles.yellow : color === "red" ? styles.red : ""
        }`}
      >
        !
      </span>
    </div>
  );
};

export default WarningExclamation;
