export default function Table({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full divide-y">{children}</table>
      </div>
    );
  }
  