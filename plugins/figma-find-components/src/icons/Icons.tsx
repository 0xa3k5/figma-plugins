import { h } from 'preact';

interface Props {
  size?: number;
}

export function IconTrash({ size = 24 }: Props): h.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1211 6.00005L11.1755 6.00011H12.8189L12.8733 6.00005C13.1297 5.99967 13.3546 5.99933 13.555 6.07817C13.7303 6.1471 13.8855 6.25893 14.0063 6.40341C14.1445 6.56864 14.2153 6.78215 14.296 7.02542L14.3131 7.07705L14.5164 7.68677H16.495H17.6194C17.8265 7.68677 17.9944 7.85466 17.9944 8.06177C17.9944 8.26887 17.8265 8.43677 17.6194 8.43677H16.8486L16.4843 14.6294L16.4833 14.6453L16.4833 14.6454L16.4833 14.6454C16.453 15.162 16.4288 15.5719 16.3829 15.9021C16.3359 16.2402 16.2625 16.5251 16.1169 16.7838C15.8804 17.2044 15.5214 17.5429 15.0877 17.7543C14.8209 17.8844 14.5321 17.9409 14.1919 17.968C13.8596 17.9945 13.4489 17.9945 12.9314 17.9945H12.9154H11.079H11.063C10.5455 17.9945 10.1348 17.9945 9.80254 17.968C9.46229 17.9409 9.1735 17.8844 8.90671 17.7543C8.47301 17.5429 8.11399 17.2044 7.87745 16.7838C7.73195 16.5251 7.65854 16.2402 7.6115 15.9021C7.56556 15.5719 7.54145 15.162 7.51106 14.6454L7.51013 14.6294L7.14585 8.43677H6.375C6.16789 8.43677 6 8.26887 6 8.06177C6 7.85466 6.16789 7.68677 6.375 7.68677H7.49944H9.47804L9.68128 7.07705L9.69843 7.02542L9.69843 7.02542C9.77911 6.78215 9.84993 6.56864 9.98811 6.40341C10.1089 6.25893 10.2641 6.1471 10.4394 6.07817C10.6398 5.99933 10.8648 5.99967 11.1211 6.00005ZM13.7258 7.68677H10.2686L10.3928 7.31422C10.5013 6.98881 10.5289 6.92587 10.5634 6.88454C10.6037 6.83638 10.6554 6.7991 10.7139 6.77613C10.764 6.75641 10.8324 6.75011 11.1755 6.75011H12.8189C13.162 6.75011 13.2304 6.75641 13.2805 6.77613C13.339 6.7991 13.3907 6.83638 13.431 6.88454C13.4655 6.92587 13.4931 6.98881 13.6016 7.31422L13.7258 7.68677ZM11.2477 10.8727C11.2477 10.6656 11.0799 10.4977 10.8727 10.4977C10.6656 10.4977 10.4977 10.6656 10.4977 10.8727V14.8082C10.4977 15.0153 10.6656 15.1832 10.8727 15.1832C11.0799 15.1832 11.2477 15.0153 11.2477 14.8082V10.8727ZM13.4966 10.8727C13.4966 10.6656 13.3287 10.4977 13.1216 10.4977C12.9145 10.4977 12.7466 10.6656 12.7466 10.8727V13.1216C12.7466 13.3287 12.9145 13.4966 13.1216 13.4966C13.3287 13.4966 13.4966 13.3287 13.4966 13.1216V10.8727Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconLinkBreak({ size = 24 }: Props): h.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9.42857 6V8.57143H10.2857V6H9.42857ZM17.2311 6.768C16.2351 5.77286 14.6211 5.77286 13.6251 6.768L11.268 9.12514L11.874 9.732L14.2311 7.37486C14.892 6.71314 15.9643 6.71314 16.6251 7.37486C17.286 8.03486 17.286 9.10714 16.6251 9.768L14.268 12.1251L14.874 12.732L17.2311 10.3749C18.2271 9.37886 18.2271 7.764 17.2311 6.768ZM6.768 17.2311C5.772 16.236 5.772 14.6211 6.768 13.6251L9.12514 11.268L9.73114 11.8749L7.374 14.232C6.71314 14.892 6.71314 15.9643 7.374 16.6251C8.03486 17.2869 9.10714 17.2869 9.768 16.6251L12.1251 14.268L12.7311 14.874L10.374 17.2311C9.378 18.2271 7.764 18.2271 6.768 17.2311ZM18 14.5714H15.4286V13.7143H18V14.5714ZM14.5714 15.4286V18H13.7143V15.4286H14.5714ZM8.57143 9.42857H6V10.2857H8.57143V9.42857Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconTarget({ size = 24 }: Props): h.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5625 10.25V7.64687C9.49575 7.85162 7.8525 9.49575 7.64687 11.5625H10.25V12.4375H7.64687C7.85162 14.5042 9.49575 16.1475 11.5625 16.3531V13.75H12.4375V16.3531C14.5042 16.1484 16.1475 14.5042 16.3531 12.4375H13.75V11.5625H16.3531C16.1484 9.49575 14.5042 7.8525 12.4375 7.64687V10.25H11.5625ZM17.2325 11.5625C17.0216 9.01188 14.9881 6.97838 12.4375 6.7675V5H11.5625V6.7675C9.01188 6.97838 6.97838 9.01188 6.7675 11.5625H5V12.4375H6.7675C6.97838 14.9881 9.01188 17.0216 11.5625 17.2325V19H12.4375V17.2325C14.9881 17.0216 17.0216 14.9881 17.2325 12.4375H19V11.5625H17.2325Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconComponent({ size = 24 }: Props): h.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9.53782 8.45236L12 6L14.4622 8.45236L12 10.9047L9.53782 8.45236ZM8.45236 14.4633L6 12L8.45236 9.53782L10.9047 12L8.45236 14.4622V14.4633ZM14.4633 15.5476L12 18L9.53782 15.5476L12 13.0953L14.4622 15.5476H14.4633ZM18 12L15.5476 9.53782L13.0953 12L15.5476 14.4622L18 12Z"
        fill="#9747FF"
      />
    </svg>
  );
}

export function IconInstance({ size = 24 }: Props): h.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 12L12 6L18 12L12 18L6 12ZM12 16.6935L16.6935 12L12 7.30655L7.30655 12L12 16.6935Z"
        fill="#9747FF"
      />
    </svg>
  );
}
export function IconRefresh({ size = 24 }: Props): h.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 16.5 14.25 16.5 14.25M17 12C17 9.23858 14.7778 7 12 7C8.66667 7 7 9.75 7 9.75M7 9.75V8M7 9.75H8.75M16.5 14.25H14.75M16.5 14.25V16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}