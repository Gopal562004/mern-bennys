import React, { useEffect } from "react";
import Icon from "../../../components/AppIcon";

const SuccessNotification = ({ isVisible, message, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] animate-in slide-in-from-right">
      <div className="bg-success text-success-foreground rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[320px] elevation-8">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon
            name="CheckCircle2"
            size={20}
            className="text-success-foreground"
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-smooth"
          aria-label="Close notification"
        >
          <Icon name="X" size={18} className="text-success-foreground" />
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
