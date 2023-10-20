import { SVGProps } from "react";

export const Icons = {
  plusIcon: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 80 80" {...props}>
      <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="8" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="8" />
    </svg>
  ),
  trashIcon: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  xIcon: (props: SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="10" />
      <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="10" />
      <circle cx="10" cy="10" r="5" fill="currentColor" />
      <circle cx="90" cy="90" r="5" fill="currentColor" />
      <circle cx="10" cy="90" r="5" fill="currentColor" />
      <circle cx="90" cy="10" r="5" fill="currentColor" />
    </svg>
  ),
};
