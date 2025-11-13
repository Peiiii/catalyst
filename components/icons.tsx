import React from 'react';

interface IconProps {
  className?: string;
}

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={className}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3a9 9 0 1 0 5.657 15.343" />
    </svg>
);

export const PendingCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


export const RegistryIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25l1.5 1.5L12 11.25m-4.5 0v2.25m6-2.25v2.25m0 0h3.75m-3.75 0A2.25 2.25 0 0 1 12 15h0a2.25 2.25 0 0 1 2.25-2.25m-3.75 0h-3.75" />
  </svg>
);

export const BusIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v13.5a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

export const TaskIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0H12m4.125 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h.375m-3.75 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h.375m2.625 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h1.125m-1.125 0V3m0 0v.375m0 0h.375M12 16.5h3.75m-3.75 0v-6m0 6h3.75m-3.75 0v-6m0 6h3.75m-3.75 0v-6m3.75-3H12m0 0v3.75m0 0v3.75m0 0H9m3.75 0v-3.75m0 0h3.75m-3.75 0v-3.75" />
    </svg>
);

export const NoteIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const CodeBracketSquareIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.06c-.247.007-.49.057-.718.152a3.75 3.75 0 0 1-3.486 3.486c-.095.228-.145.471-.152.718l-.06 3.722c-.093 1.133-1.057 1.98-2.193 1.98h-4.286c-.97 0-1.813-.616-2.097-1.5l-.284-.884a25.118 25.118 0 0 0-3.486-3.486c-.228-.095-.471-.145-.718-.152l-3.722-.06c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097l.884-.284a25.118 25.118 0 0 0 3.486-3.486c.095-.228.145-.471.152-.718l.06-3.722c.093-1.133 1.057-1.98 2.193-1.98h4.286c.97 0 1.813.616 2.097 1.5l.284.884a25.118 25.118 0 0 0 3.486 3.486c.228.095.471.145.718.152l3.722.06c1.133.093 1.98 1.057 1.98 2.193Z" />
    </svg>
);

export const BeakerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.5 1.581L5.032 15.04a2.25 2.25 0 0 0 1.58 4.028h8.776a2.25 2.25 0 0 0 1.58-4.028l-4.218-4.642a2.25 2.25 0 0 1-.5-1.581V3.104a2.25 2.25 0 0 0-3.262 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 18.75-2.25 12l2.25-6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75 26.25 12l-2.25-6.75" />
    </svg>
);

const ICONS: { [key: string]: React.FC<IconProps> } = {
    RegistryIcon,
    BusIcon,
    TaskIcon,
    ChartIcon,
    NoteIcon,
    CodeBracketSquareIcon,
    ChatBubbleLeftRightIcon,
    BeakerIcon,
};

export const getIcon = (name: string): React.FC<IconProps> => {
    return ICONS[name] || RegistryIcon;
};
