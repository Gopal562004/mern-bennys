import React from "react";
import Icon from "../../../components/AppIcon";

const FormHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="FilePlus" size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Movie</h1>
          <p className="text-muted-foreground mt-1">
            Create a new movie entry in the database
          </p>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <Icon
            name="Info"
            size={20}
            className="text-primary mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-foreground">
            <p className="font-medium mb-1">Required Information</p>
            <p className="text-muted-foreground">
              All fields marked with <span className="text-error">*</span> are
              mandatory. Ensure all information is accurate before submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
