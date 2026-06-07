import { motion } from "framer-motion";

import { useRise, CountUp } from "../design-system/animations/scroll-primitives";
import { BORDER } from "../design-system/tokens";
import { stats } from "../../domain/data/stats";

export function StatsSection() {
  const rise = useRise();

  return (
    <section id="stats" className={`scroll-mt-20 border-y ${BORDER} bg-elegant-muted tile-bg-muted`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              {...rise(index * 0.05)}
              className={`rounded-none border ${BORDER} bg-elegant-surface p-6 text-center`}
            >
              <CountUp value={stat.value} className="text-[2rem] font-medium text-elegant-text" />
              <p className="mt-2 font-mono text-sm uppercase tracking-widest text-elegant-text/50">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
