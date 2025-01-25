export default function ActionButton({
  icon,
  handleClick,
}: Readonly<{
  icon: JSX.Element;
  handleClick: () => void;
}>) {
  return (
    <button className="p-2 rounded-lg hover:bg-neutral-200" onClick={handleClick}>
      {icon}
    </button>
  );
}
