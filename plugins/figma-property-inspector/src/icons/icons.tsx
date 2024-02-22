import { h } from 'preact';

type SVGProps = React.SVGProps<SVGSVGElement>;

export const SelectIcon = (props: SVGProps): h.JSX.Element => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.625 10.5V8.26875C9.8535 8.44425 8.445 9.8535 8.26875 11.625H10.5V12.375H8.26875C8.44425 14.1465 9.8535 15.555 11.625 15.7312V13.5H12.375V15.7312C14.1465 15.5557 15.555 14.1465 15.7312 12.375H13.5V11.625H15.7312C15.5557 9.8535 14.1465 8.445 12.375 8.26875V10.5H11.625ZM16.485 11.625C16.3042 9.43875 14.5612 7.69575 12.375 7.515V6H11.625V7.515C9.43875 7.69575 7.69575 9.43875 7.515 11.625H6V12.375H7.515C7.69575 14.5612 9.43875 16.3042 11.625 16.485V18H12.375V16.485C14.5612 16.3042 16.3042 14.5612 16.485 12.375H18V11.625H16.485Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const VariableIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 9.464L12 7.154L16 9.464V14.083L12 16.393L8 14.083V9.464ZM12 6.001L17 8.888V14.661L12 17.548L7 14.661V8.887L12 6V6.001ZM13 11.771C13 12.324 12.552 12.771 12 12.771C11.448 12.771 11 12.324 11 11.771C11 11.219 11.448 10.771 12 10.771C12.552 10.771 13 11.219 13 11.771Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const ChevronUpIcon = (props: SVGProps) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 14.6072L7.26655 16L12 10.7855L16.7335 16L18 14.6072L12 8L6 14.6072Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.77783 24V8H11.1605V24H9.77783ZM13.926 12H22.2223V20H13.926V12ZM15.3087 13.3333V18.6667H20.8396V13.3333H15.3087Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingTopIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 10H24V11.3333H8V10ZM12 14H20V22H12V14ZM13.3333 15.3333V20.6667H18.6667V15.3333H13.3333Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 8V24H20.6667V8H22ZM10 12H18V20H10V12ZM11.3333 13.3333V18.6667H16.6667V13.3333H11.3333Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingBottomIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 10H20V18H12V10ZM13.3333 11.3333V16.6667H18.6667V11.3333H13.3333ZM24 22H8V20.6667H24V22Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const StrokeLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 22V10H11V22H10Z" fill="currentColor" />
      <path
        d="M20.5 22H14V21H20.5C20.776 21 21 20.776 21 20.5V11.5C21 11.224 20.776 11 20.5 11H14V10H20.5C21.328 10 22 10.672 22 11.5V20.5C22 21.328 21.328 22 20.5 22Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
    </svg>
  );
};
export const StrokeTopIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 10H22V11H10V10Z" fill="currentColor" />
      <path
        d="M10 20.5V14H11V20.5C11 20.776 11.224 21 11.5 21H20.5C20.776 21 21 20.776 21 20.5V14H22V20.5C22 21.328 21.328 22 20.5 22H11.5C10.672 22 10 21.328 10 20.5Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
    </svg>
  );
};
export const StrokeRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.5 10H18V11H11.5C11.224 11 11 11.224 11 11.5V20.5C11 20.776 11.224 21 11.5 21H18V22H11.5C10.672 22 10 21.328 10 20.5V11.5C10 10.672 10.672 10 11.5 10Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path d="M22 10V22H21V10H22Z" fill="currentColor" />
    </svg>
  );
};

export const StrokeBottomIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 11.5V18H21V11.5C21 11.224 20.776 11 20.5 11H11.5C11.224 11 11 11.224 11 11.5V18H10V11.5C10 10.672 10.672 10 11.5 10H20.5C21.328 10 22 10.672 22 11.5Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path d="M22 22H10V21H22V22Z" fill="currentColor" />
    </svg>
  );
};

export const RadiusAllIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 12.5C10 11.12 11.12 10 12.5 10H14V11H12.5C11.672 11 11 11.672 11 12.5V14H10V12.5ZM18 10H19.5C20.88 10 22 11.12 22 12.5V14H21V12.5C21 11.672 20.328 11 19.5 11H18V10ZM11 18V19.5C11 20.328 11.672 21 12.5 21H14V22H12.5C11.12 22 10 20.88 10 19.5V18H11ZM22 18V19.5C22 20.88 20.88 22 19.5 22H18V21H19.5C20.328 21 21 20.328 21 19.5V18H22Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusTopLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 16.75C10 13.0225 13.0225 10 16.75 10H22V11.5H16.75C13.8505 11.5 11.5 13.8505 11.5 16.75V22H10V16.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusTopRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22 16.75C22 13.0225 18.9775 10 15.25 10H10V11.5H15.25C18.1495 11.5 20.5 13.8505 20.5 16.75V22H22V16.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusBottomLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 15.25C10 18.9775 13.0225 22 16.75 22H22V20.5H16.75C13.8505 20.5 11.5 18.1495 11.5 15.25V10H10V15.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusBottomRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22 15.25C22 18.9775 18.9775 22 15.25 22H10V20.5H15.25C18.1495 20.5 20.5 18.1495 20.5 15.25V10H22V15.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RefreshIcon = (props: SVGProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.6096 13.6877L21.4349 15.156C21.4268 15.1039 21.418 15.0519 21.4084 15C21.2569 14.1806 20.9203 13.4019 20.419 12.7254C19.7169 11.778 18.7289 11.0813 17.6008 10.7381C16.4726 10.3949 15.264 10.4234 14.1533 10.8193C13.3601 11.1021 12.6469 11.5614 12.0648 12.1576C11.8317 12.3964 11.6196 12.6571 11.4318 12.9372L11.4319 12.9373L12.2624 13.4941L12.2625 13.4942C12.7998 12.6928 13.5803 12.0854 14.4891 11.7614C15.3979 11.4375 16.3867 11.4142 17.3097 11.695C18.2327 11.9757 19.041 12.5457 19.6154 13.3209C20.1002 13.975 20.3966 14.746 20.4774 15.5506L18.2774 14.084L17.7227 14.916L20.7227 16.916L21.1041 17.1703L21.3905 16.8123L23.3905 14.3123L22.6096 13.6877ZM10.6096 15.1877L8.60962 17.6877L9.39049 18.3123L10.5652 16.844C10.5733 16.8961 10.5821 16.9481 10.5917 17C10.7432 17.8194 11.0798 18.5981 11.5811 19.2746C12.2832 20.222 13.2712 20.9187 14.3994 21.2619C15.5275 21.6051 16.7361 21.5766 17.8468 21.1807C18.64 20.8979 19.3532 20.4386 19.9353 19.8424C20.168 19.6041 20.3797 19.344 20.5672 19.0646L20.5683 19.0628L20.5682 19.0627L19.7377 18.5059L19.7376 18.5058L19.7365 18.5074C19.1993 19.308 18.4192 19.9148 17.511 20.2386C16.6023 20.5625 15.6134 20.5858 14.6904 20.305C13.7674 20.0243 12.9591 19.4543 12.3847 18.6791C11.9 18.025 11.6035 17.254 11.5227 16.4494L13.7227 17.916L14.2774 17.084L11.2774 15.084L10.896 14.8297L10.6096 15.1877Z"
        fill="currentColor"
        fill-opacity="0.8"
      />
    </svg>
  );
};
