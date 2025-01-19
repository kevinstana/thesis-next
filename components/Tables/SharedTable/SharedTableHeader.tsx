export default function SharedTableHeader({children}: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <thead>
            {children}
        </thead>
    )
  }