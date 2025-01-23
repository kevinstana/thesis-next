import { IconProps } from "@/types/app-types";

export default function NavigationLast({
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
        d="M13.2 15.4C13.2 15.8971 13.6029 16.3 14.1 16.3C14.5971 16.3 15 15.8971 15 15.4L15 4.39999C15 3.90294 14.5971 3.5 14.1 3.5C13.6029 3.5 13.2 3.90294 13.2 4.4L13.2 15.4Z"
        fill="#4C4F4F"
      />
      <path
        d="M4.6242 14.6257L9.58629 9.89988L4.6242 5.17408C4.25808 4.8254 4.25808 4.26007 4.6242 3.91139C4.99031 3.56271 5.58391 3.56271 5.95002 3.91139L11.575 9.26853C11.9411 9.61722 11.9411 10.1825 11.575 10.5312L5.95002 15.8884C5.58391 16.237 4.99031 16.237 4.6242 15.8884C4.25808 15.5397 4.25808 14.9744 4.6242 14.6257Z"
        fill="#4C4F4F"
      />
    </svg>
  );
}
