"use client"

import { emptyBranchIcon } from "@/constant/icons";
import { EmptyStateProps } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";

export default function EmptyState({ title, description }: Readonly<EmptyStateProps>) {
  return (
    <main>
      <section className="flex flex-col items-center justify-center gap-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            delay: 0.2
          }}
        >
          <Image src={emptyBranchIcon} alt="Empty Branch Illustration" width={200} height={200} />
        </motion.div>
        <motion.h1
          className="text-xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.4
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-sm text-gray-600 text-center w-8/12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.6
          }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.8
          }}
        >

        </motion.div>
      </section>
    </main>
  );
}