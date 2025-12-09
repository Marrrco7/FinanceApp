import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

type AnimatedNumberProps = {
    value: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
};

const AnimatedNumber = ({
                            value,
                            decimals = 2,
                            prefix = "",
                            suffix = "",
                            className,
                        }: AnimatedNumberProps) => {
    const [displayValue, setDisplayValue] = useState<number>(value);
    const motionValue = useMotionValue(value);

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration: 0.6,
            ease: "easeOut",
        });

        return controls.stop;
    }, [value, motionValue]);

    useEffect(() => {
        const unsubscribe = motionValue.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return unsubscribe;
    }, [motionValue]);

    return (
        <span className={className}>
      {prefix}
            {displayValue.toFixed(decimals)}
            {suffix}
    </span>
    );
};

export default AnimatedNumber;
