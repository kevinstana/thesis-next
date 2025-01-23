import { IconProps } from "@/types/app-types"

export default function NavigationFirst({ className }: IconProps): JSX.Element {
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
        d="M6.8 4.6C6.8 4.10295 6.39706 3.7 5.9 3.7C5.40294 3.7 5 4.10295 5 4.6V15.6C5 16.0971 5.40294 16.5 5.9 16.5C6.39706 16.5 6.8 16.0971 6.8 15.6V4.6Z"
        fill="#4C4F4F"
      />
      <path
        d="M15.3758 5.37432L10.4137 10.1001L15.3758 14.8259C15.7419 15.1746 15.7419 15.7399 15.3758 16.0886C15.0097 16.4373 14.4161 16.4373 14.05 16.0886L8.42498 10.7315C8.05886 10.3828 8.05886 9.81746 8.42498 9.46878L14.05 4.11163C14.4161 3.76295 15.0097 3.76295 15.3758 4.11163C15.7419 4.46031 15.7419 5.02564 15.3758 5.37432Z"
        fill="#4C4F4F"
      />
    </svg>
  )
}
