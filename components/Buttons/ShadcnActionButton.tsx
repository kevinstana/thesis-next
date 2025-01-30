import { Button } from "../ui/button";

export default function ShadcnActionButton({
  text,
  className,
  handleClick,
  type,
  disabled,
}: Readonly<{
  text: string;
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
  handleClick: () => void;
  disabled?: boolean;
}>) {
  return (
    <Button disabled={disabled} type={type} className={className} onClick={handleClick}>
      {text}
    </Button>
  );
}
