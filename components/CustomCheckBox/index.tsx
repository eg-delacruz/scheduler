//Styles
import styles from './styles.module.scss';

type Props = {
  boolean: boolean;
  setBoolean: (boolean: boolean) => void;
  name: string;
  children: React.ReactNode;
};

const CustomCheckBox = ({ boolean, setBoolean, name, children }: Props) => {
  return (
    <>
      <input
        id={name}
        className={styles.checkbox}
        type='checkbox'
        checked={boolean}
        onChange={() => {
          setBoolean(!boolean);
        }}
      />
      <label htmlFor={name} className={styles.label}>
        <div>{children}</div>
      </label>
    </>
  );
};

export default CustomCheckBox;
