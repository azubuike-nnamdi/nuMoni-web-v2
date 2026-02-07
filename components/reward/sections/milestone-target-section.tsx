"use client";

import { RewardIcon } from "@/components/common/icon-svg";
import { Input } from "@/components/ui/input";
import { isNumericOnly } from "@/lib/helper";
import { MilestoneTargetSectionProps } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";

export default function MilestoneTargetSection({ milestoneTarget, setMilestoneTarget }: Readonly<MilestoneTargetSectionProps>) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -20 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          height: { duration: 0.3 },
          opacity: { duration: 0.2 },
          y: { duration: 0.3 }
        }}
        className="space-y-2 overflow-hidden"
      >
        <motion.label
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          htmlFor="milestoneTarget"
          className="text-sm font-medium text-gray-900"
        >
          Milestone Target  <span className="text-xs text-gray-600">(How Many Points Should They Meet Before Claiming.)</span> <span className="text-red-500">*</span>
        </motion.label>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="relative"
        >
          <Input
            type="text"
            placeholder="0"
            value={milestoneTarget}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow positive numeric values (no negative sign)
              if (isNumericOnly(value)) {
                setMilestoneTarget(value);
              }
            }}
            className="w-full pl-10 pr-3 py-6 focus:outline-none focus:ring-0 focus:border-none"
          />
          <RewardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-dark-green pointer-events-none h-4 w-4" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}