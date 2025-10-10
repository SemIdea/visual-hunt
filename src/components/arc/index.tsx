import { cn } from "@/lib/utils";
import styles from "./style.module.css";

const Arc = () => {
  return (
    <div
      className={cn(
        "w-full h-full absolute overflow-hidden z-0",
        styles.clipBottomHalf
      )}
    >
      <div className={styles.container}>
        <div className={cn(styles.elipse, styles.elipse1)}></div>
        <div className={cn(styles.elipse, styles.elipse2)}></div>
        <div className={cn(styles.elipse, styles.elipse3)}></div>
        <div className={cn(styles.elipse, styles.elipse4)}></div>
        <div className={cn(styles.elipse, styles.elipse5)}></div>
        <div className={cn(styles.elipse, styles.elipse6)}></div>
      </div>
    </div>
  );
};

export default Arc;
