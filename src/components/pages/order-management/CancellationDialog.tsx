import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CancellationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cancellationReasons: string[];
  setCancellationReasons: (reasons: string[]) => void;
  customCancellationReason: string;
  setCustomCancellationReason: (reason: string) => void;
  onConfirm: () => void;
}

export const CancellationDialog = ({ 
  isOpen, 
  onOpenChange, 
  cancellationReasons, 
  setCancellationReasons, 
  customCancellationReason, 
  setCustomCancellationReason, 
  onConfirm 
}: CancellationDialogProps) => {
  const predefinedReasons = ["Price Mismatch", "Out of Stock", "Quality Issues", "Delivery Issues"];
  
  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setCancellationReasons([...cancellationReasons, reason]);
    } else {
      setCancellationReasons(cancellationReasons.filter(r => r !== reason));
    }
  };

  const isOtherSelected = cancellationReasons.includes("Other");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Cancellation</DialogTitle>
          <DialogDescription>
            Please select reason(s) for cancelling this order. You can select multiple reasons.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            {predefinedReasons.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <Checkbox 
                  id={reason}
                  checked={cancellationReasons.includes(reason)}
                  onCheckedChange={(checked) => handleReasonChange(reason, checked === true)}
                />
                <Label htmlFor={reason}>{reason}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="other"
                checked={isOtherSelected}
                onCheckedChange={(checked) => handleReasonChange("Other", checked === true)}
              />
              <Label htmlFor="other">Other</Label>
            </div>
          </div>
          {isOtherSelected && (
            <Textarea
              placeholder="Please enter other cancellation reasons..."
              value={customCancellationReason}
              onChange={(e) => setCustomCancellationReason(e.target.value)}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={cancellationReasons.length === 0 || (isOtherSelected && !customCancellationReason.trim())}
            variant="destructive"
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};