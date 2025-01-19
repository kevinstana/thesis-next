export default function SharedTableAndPaginationContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      <div className="overflow-hidden rounded-lg border mx-auto max-w-full lg:w-[80vw]">
        {children}
      </div>
    </div>
  );
}
