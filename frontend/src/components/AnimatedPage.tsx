import { motion } from "framer-motion";

type AnimatedPageProps = {
    children: React.ReactNode;
};

const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

// Keep it simple: let Framer Motion use its default easing
const pageTransition = {
    duration: 0.25,
};

export function AnimatedPage({ children }: AnimatedPageProps) {
    return (
        <motion.div
            className="space-y-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
}
