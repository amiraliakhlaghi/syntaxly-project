import { IconType } from "react-icons";

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: IconType;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
    <div className="mb-4 flex items-center gap-2">
      <Icon size={20} className="text-blue-500" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

export default SectionCard;
