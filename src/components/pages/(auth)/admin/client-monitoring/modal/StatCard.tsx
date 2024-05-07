import * as React from "react";
import Image from "next/image";

interface StatCardProps {
  total: number;
  label: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ total, label, icon }) => {
  return (
    <div className="flex gap-3 px-5 py-5 font-semibold whitespace-nowrap rounded-xl border border-solid border-slate-400 max-w-[318px]">
      <div className="flex flex-col my-auto text-base tracking-wide text-slate-700">
        <div>TOTAL</div>
        <div className="mt-3.5">{label}</div>
      </div>
      <div className="justify-center items-center px-16 py-6 text-3xl tracking-wide text-center text-blue-700 bg-indigo-50 rounded-md border border-violet-200 border-solid">
        {total}
      </div>
      <Image src={icon} alt="" width={24} height={24} className="shrink-0 self-start w-6 aspect-square" />
    </div>
  );
};

function MyComponent() {
  const stats = [
    {
      total: 1,
      label: "CLIENTS",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/89e3f4cec946a59435e0578ce9f6ad29b36e6da03dddc51a72220e44d4cf9a6e?apiKey=f03b41d71adb4db9bce58baa93760ddb&",
    },
  ];

  return (
    <div>
      {stats.map((stat, index) => (
        <StatCard key={index} total={stat.total} label={stat.label} icon={stat.icon} />
      ))}
    </div>
  );
}

export default MyComponent;