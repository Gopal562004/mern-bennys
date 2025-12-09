import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const UnsavedChangesDialog = ({ isOpen, onClose, onDiscard, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-lg elevation-8 max-w-md w-full p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <Icon name="AlertCircle" size={24} className="text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unsaved Changes
            </h3>
            <p className="text-sm text-muted-foreground">
              You have unsaved changes. Do you want to save them before leaving?
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="default"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
            fullWidth
          >
            Save Changes
          </Button>
          <Button
            variant="destructive"
            onClick={onDiscard}
            iconName="X"
            iconPosition="left"
            fullWidth
          >
            Discard Changes
          </Button>
          <Button variant="outline" onClick={onClose} fullWidth>
            Continue Editing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesDialog;
