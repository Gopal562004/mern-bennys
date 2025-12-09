import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ConfirmationDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-card rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 elevation-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" size={24} className="text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            Discard Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
