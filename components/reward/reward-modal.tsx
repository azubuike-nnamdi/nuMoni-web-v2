import { getButtonStyle, getIconColorClass } from "@/lib/helper";
import { RewardModalProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GiftIcon } from "../common/icon-svg";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export default function RewardModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  icon,
  iconColor = 'red',
  title,
  description,
  subDescription,
  primaryButtonText = "Confirm",
  secondaryButtonText = "Cancel",
  primaryButtonVariant = "default",
  secondaryButtonVariant = "outline",
  primaryButtonColor,
  secondaryButtonColor,
  isLoading = false,
  disabled = false
}: Readonly<RewardModalProps>) {

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl border-none">
        <DialogHeader>
          <div className="flex justify-center my-6">
            {icon ? (
              <div className={cn("flex items-center justify-center", getIconColorClass(iconColor))}>
                {icon}
              </div>
            ) : (
              <GiftIcon
                size={48}
                className={cn("text-red-500", getIconColorClass(iconColor))}
              />
            )}
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600 mt-2 text-center w-full sm:w-8/12 mx-auto">
            {description}
            {subDescription && (
              <span className="block mt-2">{subDescription}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-row gap-4 mt-6 w-full sm:w-6/12 mx-auto">
          <Button
            onClick={handleCancel}
            variant={secondaryButtonVariant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
            className="flex-1 px-6 py-6 rounded-lg font-medium shadow-none cursor-pointer"
            style={getButtonStyle(secondaryButtonVariant, secondaryButtonColor)}
            disabled={disabled || isLoading}
          >
            {secondaryButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={primaryButtonVariant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
            className="flex-1 px-6 py-6 rounded-lg font-medium shadow-none cursor-pointer"
            style={getButtonStyle(primaryButtonVariant, primaryButtonColor)}
            disabled={disabled || isLoading}
            isLoading={isLoading}
            loadingText={'loading...'}
          >
            {primaryButtonText}
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}