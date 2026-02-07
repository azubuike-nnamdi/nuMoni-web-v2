'use client';

import { cashBackIcon, rightArrowWhiteIcon } from "@/constant/icons";
import { benefitsData, whatYouCanDoData } from "@/data";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import CreateRewardRuleModal from "./create-reward-rule-modal";

export default function EmptyReward() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main>
      <main className="bg-white rounded-2xl p-6">
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Custom Reward Tables Section */}
          <div className="flex-2  bg-theme-dark-green rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Custom Reward Tables</h1>

            {/* Central Illustration */}
            <div className="flex items-center justify-center mb-8">
              <Image src={cashBackIcon} alt="Cash Back Illustration" width={300} height={300} />
            </div>

            <p className="text-white text-lg max-w-md text-center">
              Easily set up how customers earn points and keep your rewards aligned with your business goals.
            </p>
          </div>

          {/* What You Can Do Section */}
          <div className="flex-1 bg-[#FAFAFA] border border-gray-100 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What You Can Do</h2>
            <div className="space-y-4">
              {whatYouCanDoData.map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-white rounded-lg p-4 border-gray-100 border">
                  <Image src={item.icon} alt={item.alt} width={24} height={24} className="mt-1" />
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="flex-1 bg-[#FAFAFA] border border-gray-100 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits</h2>
            <div className="space-y-4">
              {benefitsData.map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-white rounded-lg p-4 border-gray-100 border">
                  <Image src={item.icon} alt={item.alt} width={24} height={24} className="mt-1" />
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <section className=" max-w-xs mx-auto flex flex-col items-center justify-center gap-4 bg-white rounded-2xl p-6 my-4">
        <p className="text-center text-gray-900 text-xl font-medium">
          Ready to create your table? Click the button below.
        </p>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-theme-dark-green hover:bg-theme-dark-green text-white rounded-lg p-6 flex items-center gap-2 shadow-sm max-w-md w-full cursor-pointer"
        >
          Create Reward table
          <Image src={rightArrowWhiteIcon} alt="arrow-right" width={20} height={20} />
        </Button>
      </section>

      {/* Modal */}
      <CreateRewardRuleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </main>
  );
}