import styles from './styles.module.scss';

type Props = {
  color?: 'white' | 'blue' | 'orange';
};

//Intended to use within buttons when loading
function SpinnerLoader({ color = 'white' }: Props) {
  return <div className={`${styles.loader} ${styles[color]}`}></div>;
}

export default SpinnerLoader;
