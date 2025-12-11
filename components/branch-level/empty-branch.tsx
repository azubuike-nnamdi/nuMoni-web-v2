"use client"

import { emptyBranchIcon } from "@/constant/icons";
import { useBranchStore } from "@/stores/branch-store";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function EmptyBranch() {
  const { openDialog } = useBranchStore();



  return (
    <main>
      <motion.div
        className="flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-2xl my-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut"
        }}
      >
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.2
          }}
        >
          <Image src={emptyBranchIcon} alt="empty-branch" width={200} height={200} className="mx-auto" />
        </motion.div>

        <motion.h1
          className="text-xl font-bold text-gray-900 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.4
          }}
        >
          No Sub-Branches Yet
        </motion.h1>

        <motion.p
          className="text-sm text-gray-600 mb-8 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.6
          }}
        >
          You haven&apos;t added any sub-branches. Click the button below to create one and get started.
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
          <Button
            onClick={openDialog}
            className="bg-theme-dark-green hover:bg-theme-green text-white rounded-lg p-6 flex items-center gap-2 shadow-sm w-80 cursor-pointer"
          >
            <Plus className="w-4 h-4 font-semibold" />
            Add Branch
          </Button>
        </motion.div>
      </motion.div>
    </main>
  )
}