import PlusIconGreen from '@/svg/PlusIconGreen';

export default function AddStageBtn({ handleAddStage }: { handleAddStage: any }) {
  return (
    <button
      onClick={handleAddStage}
      className="rounded-lg bg-white hover:bg-gray-100 hover:border-[#4a9d5e] text-[#65C979] border-2 border-[#65C979] py-1.5 px-6 font-bold text-[16px] flex items-center gap-2 transition-colors"
    >
      <PlusIconGreen />
      Add Stage
    </button>
  )
}
