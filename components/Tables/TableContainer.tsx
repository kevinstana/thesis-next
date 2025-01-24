export default function TableContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      {/* <div className="overflow-hidden rounded-lg border mx-auto max-w-full lg:w-[80vw]"> */}
      <div className="overflow-hidden top-16 rounded-lg border mx-auto h-full w-full">
        {children}
      </div>
    </div>
  );
}
