export default function AddStageBtn({handleAddStage}: {handleAddStage: any}) {
  return (
    <button
      onClick={handleAddStage}
      className="rounded-lg bg-[#65c979] hover:bg-[#5cb86f] text-white py-2 px-6 font-bold text-[15px] my-6"
    >
      ADD STAGE
    </button>
  )
}
