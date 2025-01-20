import { IconProps } from "@/types/app-types";

export default function CheckMark({
  className,
}: Readonly<IconProps>): JSX.Element {
  return (
    <svg
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.75174 15C7.52813 15 7.30433 14.9158 7.13341 14.7469L3.25679 10.9185C2.91476 10.5808 2.91437 10.0329 3.25582 9.6946C3.59726 9.35653 4.15142 9.35614 4.49326 9.69383L7.75174 12.9117L15.5067 5.25325C15.8486 4.91517 16.4025 4.91575 16.7442 5.25402C17.0856 5.59229 17.0852 6.14017 16.7432 6.47786L8.37008 14.7469C8.19916 14.9158 7.97535 15 7.75174 15Z"
        fill="currentColor"
      />
    </svg>
  );
}
