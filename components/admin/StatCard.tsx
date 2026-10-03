import { IconType } from "react-icons";

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: IconType;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}
    >
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {value.toLocaleString()}
      </p>
    </div>
  </div>
);

export default StatCard;
