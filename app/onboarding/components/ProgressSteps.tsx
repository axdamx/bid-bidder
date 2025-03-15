"use client";

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = ["Details", "Role", "Profile"];
  
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
              ${
                index + 1 === currentStep
                  ? "border-primary bg-primary text-white"
                  : index + 1 < currentStep
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-300"
              }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-12 ${
                index + 1 < currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
