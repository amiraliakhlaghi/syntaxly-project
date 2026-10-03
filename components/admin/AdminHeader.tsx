const AdminHeader = ({
  content,
  total,
}: {
  content: string;
  total?: number;
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{content}</h1>
        {total !== undefined && (
          <p className="text-sm text-muted-foreground">
            Total {total} {content.toLowerCase()}
          </p>
        )}
      </div>
    </div>
    // <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
    //   {content}
    // </h1>
  );
};

export default AdminHeader;
