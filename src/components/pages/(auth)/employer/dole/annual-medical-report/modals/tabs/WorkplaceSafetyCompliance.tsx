"use client";

import { useState } from "react";

import AutoCalculateTotals from "./components/workplace-safety-compliance/AutoCalculateTotals";
import ToggleSection from "./components/ToggleSection";
import OccupationalAccident from "./components/workplace-safety-compliance/OccupationalAccident";
import Immunization from "./components/workplace-safety-compliance/Immunization";

function WorkplaceSafetyCompliance({
  register,
  handleSubmit,
  setSelectedTab,
  setValue,
  watch,
}: {
  register: any;
  handleSubmit: any;
  setSelectedTab: any;
  setValue: any;
  watch: any;
}) {
  const [isOccupationalAccidentOpen, setIsOccupationalAccidentOpen] =useState(false);
  const [isImmunizationOpen, setIsImmunizationOpen] = useState(false);

  const toggleImmunizationOpen = () =>
    setIsImmunizationOpen(!isImmunizationOpen);
  const toggleOccupationalAccidentOpen = () =>
    setIsOccupationalAccidentOpen(!isOccupationalAccidentOpen);

  const onSubmit = handleSubmit(() => {
    setSelectedTab(7);
  });

  return (
    <form onSubmit={onSubmit}>
      {/* Include the AutoCalculateTotals component */}
      <AutoCalculateTotals watch={watch} setValue={setValue} />
      <>
        <div className="pr-8">
          {/* Occupational Accident Section */}
          <ToggleSection
            title="a. Report of Occupational Accidents/Injuries:"
            isOpen={isOccupationalAccidentOpen}
            onToggle={toggleOccupationalAccidentOpen}
          >
            <OccupationalAccident register={register} setValue={setValue} watch={watch} />
          </ToggleSection>

          {/* Immunization Section */}
          <ToggleSection
            title="b. Immunization Program (Indicate number immunized)"
            isOpen={isImmunizationOpen}
            onToggle={toggleImmunizationOpen}
          >
            <Immunization register={register} setValue={setValue} watch={watch} />
          </ToggleSection>
        </div>
      </>
      <hr />
      <div className="py-4 px-4 flex justify-between">
        <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(5)}
        >
          Back
        </button>
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default WorkplaceSafetyCompliance;
