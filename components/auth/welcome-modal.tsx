"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { numoniLogoDark } from "@/constant/icons";
import { highFiveImage } from "@/constant/images";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisterBusiness?: () => void;
}

export default function WelcomeModal({
  open,
  onOpenChange,
}: WelcomeModalProps) {
  const router = useRouter();

  const handleRegisterBusiness = () => {
    onOpenChange(false);
    router.push("/auth/business-registration");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">

        <DialogHeader>
          <DialogTitle className="sr-only">Welcome to nuMoni</DialogTitle>

          <DialogDescription className="sr-only">
            Welcome to nuMoni. You can now proceed to register your business as a verified account.
          </DialogDescription>

          <div className="flex justify-center my-6">
            <Image src={highFiveImage} alt="high five" width={300} height={300} />
          </div>
        </DialogHeader>
        <div className="bg-linear-to-b from-green-50 to-white">


          {/* Content */}
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-2">Welcome To</p>
              <Image
                src={numoniLogoDark}
                alt="nuMoni Logo"
                width={120}
                height={48}
                className="mx-auto h-10 w-auto"
              />
            </div>

            <p className="text-gray-700 text-sm">
              You can now proceed to register your business as a verified
              account.
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-green-800">
                Over 2,000+ Customers Ready To Shop And Waiting For Your
                Business Profile.
              </p>
            </div>

            <Button
              onClick={handleRegisterBusiness}
              className="w-full bg-black hover:bg-gray-800 text-white py-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-6"
            >
              Register My Business
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

