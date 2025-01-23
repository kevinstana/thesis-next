export default function TableBody({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <tbody className="divide-y">{children}</tbody>;
  }
  