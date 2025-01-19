export default function SharedTableBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <tbody className="divide-y">{children}</tbody>;
}
