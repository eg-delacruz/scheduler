import Image from 'next/image';
import styles from './styles.module.scss';

//Assets
import big_blue_particle from '@assets/images/big_blue_girl_particle.svg';
import big_orange_particle from '@assets/images/big_orange_girl_particle.svg';
import small_blue_particle from '@assets/images/small_blue_girl_particle.svg';
import small_orange_particle from '@assets/images/small_orange_girl_particle.svg';

function AnimatedStandingGirl() {
  return (
    <div
      className={`hidden lg:block absolute xl:right-36 lg:right-6  bottom-6 w-96`}
    >
      <Image
        src='/images/home/standing_girl.svg'
        alt='Standing girl image'
        width={175}
        height={175}
        className='object-cover rounded-md -z-10'
      />
      <Image
        src={big_blue_particle.src}
        alt='Big blue particle'
        width={6}
        height={6}
        priority
        className={`${styles.particle} ${styles.particle1}`}
      />
      <Image
        src={big_orange_particle.src}
        alt='Big orange particle'
        width={6}
        height={6}
        priority
        className={`${styles.particle} ${styles.particle2}`}
      />
      <Image
        src={small_blue_particle.src}
        alt='Small blue particle'
        width={6}
        priority
        height={6}
        className={`${styles.particle} ${styles.particle3}`}
      />
      <Image
        priority
        src={small_orange_particle.src}
        alt='Small orange particle'
        width={6}
        height={6}
        className={`${styles.particle} ${styles.particle4}`}
      />
      <Image
        src={big_blue_particle.src}
        alt='Big blue particle'
        width={6}
        height={6}
        priority
        className={`${styles.particle} ${styles.particle5}`}
      />
      <Image
        src={big_orange_particle.src}
        alt='Big orange particle'
        width={6}
        height={6}
        priority
        className={`${styles.particle} ${styles.particle6}`}
      />
    </div>
  );
}

export default AnimatedStandingGirl;
