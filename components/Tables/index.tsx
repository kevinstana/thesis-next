export default function Table({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="overflow-auto max-h-[70vh]">
        <table className="w-full divide-y">{children}</table>
      </div>
    );
  }
  