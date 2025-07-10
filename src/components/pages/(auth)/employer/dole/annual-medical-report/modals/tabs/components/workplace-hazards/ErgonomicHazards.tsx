import React from "react";

interface ErgonomicHazardsProps {
  register: any;
  setValue?: any;
  watch?: any;
}

const ErgonomicHazards: React.FC<ErgonomicHazardsProps> = ({ register, setValue, watch }) => {
  // Watch values for all fields
  const exhausting_physical_work_sources = watch ? watch("exhausting_physical_work_sources") : "";
  const exhausting_physical_work_workers_exposed = watch ? watch("exhausting_physical_work_workers_exposed") : "";
  const prolonged_standing_sources = watch ? watch("prolonged_standing_sources") : "";
  const prolonged_standing_workers_exposed = watch ? watch("prolonged_standing_workers_exposed") : "";
  const excessive_mental_effort_sources = watch ? watch("excessive_mental_effort_sources") : "";
  const excessive_mental_effort_workers_exposed = watch ? watch("excessive_mental_effort_workers_exposed") : "";
  const unfavorable_work_posture_sources = watch ? watch("unfavorable_work_posture_sources") : "";
  const unfavorable_work_posture_workers_exposed = watch ? watch("unfavorable_work_posture_workers_exposed") : "";
  const static_monotonous_work_sources = watch ? watch("static_monotonous_work_sources") : "";
  const static_monotonous_work_workers_exposed = watch ? watch("static_monotonous_work_workers_exposed") : "";
  const others_sources = watch ? watch("others_sources") : "";
  const others_workers_exposed = watch ? watch("others_workers_exposed") : "";

  return (
    <>
      {/* Desktop layout - hidden on mobile: Exhausting Physical Work */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Exhausting Physical Work
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`exhausting_physical_work_sources`)}
              id={`exhausting_physical_work_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`exhausting_physical_work_workers_exposed`)}
              id={`exhausting_physical_work_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Exhausting Physical Work */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Exhausting Physical Work</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={exhausting_physical_work_sources || ""}
              onChange={(e) => setValue && setValue("exhausting_physical_work_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={exhausting_physical_work_workers_exposed || ""}
              onChange={(e) => setValue && setValue("exhausting_physical_work_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Prolonged Standing */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Prolonged Standing
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`prolonged_standing_sources`)}
              id={`prolonged_standing_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`prolonged_standing_workers_exposed`)}
              id={`prolonged_standing_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Prolonged Standing */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Prolonged Standing</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={prolonged_standing_sources || ""}
              onChange={(e) => setValue && setValue("prolonged_standing_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={prolonged_standing_workers_exposed || ""}
              onChange={(e) => setValue && setValue("prolonged_standing_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Excessive Mental Effort */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Excessive Mental Effort
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`excessive_mental_effort_sources`)}
              id={`excessive_mental_effort_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`excessive_mental_effort_workers_exposed`)}
              id={`excessive_mental_effort_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Excessive Mental Effort */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Excessive Mental Effort</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={excessive_mental_effort_sources || ""}
              onChange={(e) => setValue && setValue("excessive_mental_effort_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={excessive_mental_effort_workers_exposed || ""}
              onChange={(e) => setValue && setValue("excessive_mental_effort_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Unfavorable Work Posture */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Unfavorable Work Posture
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`unfavorable_work_posture_sources`)}
              id={`unfavorable_work_posture_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`unfavorable_work_posture_workers_exposed`)}
              id={`unfavorable_work_posture_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Unfavorable Work Posture */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Unfavorable Work Posture</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={unfavorable_work_posture_sources || ""}
              onChange={(e) => setValue && setValue("unfavorable_work_posture_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={unfavorable_work_posture_workers_exposed || ""}
              onChange={(e) => setValue && setValue("unfavorable_work_posture_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Static/ Monotonous Work */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Static/ Monotonous Work
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2 flex flex-row items-center">
            <input
              type="text"
              {...register(`static_monotonous_work_sources`)}
              id={`static_monotonous_work_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`static_monotonous_work_workers_exposed`)}
              id={`static_monotonous_work_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Static/ Monotonous Work */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Static/ Monotonous Work</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={static_monotonous_work_sources || ""}
              onChange={(e) => setValue && setValue("static_monotonous_work_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={static_monotonous_work_workers_exposed || ""}
              onChange={(e) => setValue && setValue("static_monotonous_work_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile: Others */}
      <div className="hidden md:grid grid-cols-3 gap-6 pb-6">
        <div className="flex justify-start items-center pl-6">
          <div className="grid-item">
            <h1 className="block text-sm font-medium text-center items-start leading-6 text-gray-900">
              Others
            </h1>
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="text"
              {...register(`others_sources`)}
              id={`others_sources`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid-item">
          <div className="mt-2">
            <input
              type="number"
              {...register(`others_workers_exposed`)}
              id={`others_workers_exposed`}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      {/* Mobile layout - hidden on desktop: Others */}
      <div className="pl-7 block md:hidden mb-6">
        <h2 className="font-medium mb-2 text-sm">Others</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sources</label>
            <input
              type="text"
              value={others_sources || ""}
              onChange={(e) => setValue && setValue("others_sources", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">No. of Workers Exposed</label>
            <input
              type="number"
              value={others_workers_exposed || ""}
              onChange={(e) => setValue && setValue("others_workers_exposed", e.target.value)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ErgonomicHazards;
