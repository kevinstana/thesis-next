import { IconProps } from "@/types/app-types";

export default function NavigationPrevious({
  className,
}: IconProps): JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.51332 10.0001L13.4754 5.27433C13.8415 4.92564 13.8415 4.36032 13.4754 4.01163C13.1093 3.66295 12.5157 3.66295 12.1496 4.01163L6.52459 9.36878C6.15847 9.71746 6.15847 10.2828 6.52459 10.6315L12.1496 15.9886C12.5157 16.3373 13.1093 16.3373 13.4754 15.9886C13.8415 15.6399 13.8415 15.0746 13.4754 14.7259L8.51332 10.0001Z"
        fill="#4C4F4F"
      />
    </svg>
  );
}
