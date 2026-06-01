import React from 'react'

const PATHS: Record<string, React.ReactNode> = {
  'ai-intake': (<><rect x="5" y="3" width="14" height="18" rx="2.6" fill="#C2A04A" fillOpacity="0.16"/><rect x="5" y="3" width="14" height="18" rx="2.6"/><line x1="8.2" y1="9" x2="13" y2="9"/><line x1="8.2" y1="12.4" x2="15.8" y2="12.4"/><line x1="8.2" y1="15.8" x2="15.8" y2="15.8"/><circle cx="15.5" cy="9" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'action-centre': (<><circle cx="12" cy="12" r="3.4" fill="#C2A04A" fillOpacity="0.16"/><circle cx="12" cy="12" r="3.4"/><path d="M14.45 9.7 L17.3 6.85"/><circle cx="18.5" cy="5.7" r="1.7"/><path d="M14.5 13.9 L17.45 16.85"/><circle cx="18.6" cy="17.95" r="1.7"/><path d="M9.1 13.4 L6.2 16.3"/><circle cx="5.1" cy="17.4" r="1.7"/><circle cx="12" cy="12" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'govuk-checklist': (<><rect x="5" y="4.6" width="14" height="16.4" rx="2.4" fill="#C2A04A" fillOpacity="0.16"/><rect x="5" y="4.6" width="14" height="16.4" rx="2.4"/><rect x="9" y="2.8" width="6" height="3.4" rx="1.3"/><path d="M8.4 11.1 l1.4 1.4 l2.6 -2.8"/><line x1="14" y1="11.2" x2="16.4" y2="11.2"/><path d="M8.4 16 l1.4 1.4 l2.6 -2.8"/><line x1="14" y1="16.1" x2="16.4" y2="16.1"/><circle cx="16.5" cy="8.6" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'instant-quote': (<><rect x="5" y="3" width="14" height="18" rx="2.6" fill="#C2A04A" fillOpacity="0.16"/><rect x="5" y="3" width="14" height="18" rx="2.6"/><line x1="8.3" y1="7.2" x2="13.7" y2="7.2"/><line x1="8.3" y1="9.4" x2="11.6" y2="9.4"/><path d="M13.7 13 a1.95 1.95 0 0 0 -3.3 1.4 V17.9"/><line x1="9.3" y1="15.3" x2="12.8" y2="15.3"/><line x1="9.3" y1="17.9" x2="14.4" y2="17.9"/><circle cx="15.5" cy="7.2" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'ai-chatbot': (<><rect x="3.5" y="4" width="17" height="12.6" rx="3.2" fill="#C2A04A" fillOpacity="0.16"/><rect x="3.5" y="4" width="17" height="12.6" rx="3.2"/><path d="M8 16.6 V20.2 L11.8 16.6"/><line x1="7.5" y1="8.7" x2="14.5" y2="8.7"/><line x1="7.5" y1="11.8" x2="12.5" y2="11.8"/><circle cx="16.9" cy="7" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'daily-digest': (<><line x1="3.6" y1="16.7" x2="20.4" y2="16.7"/><path d="M7.4 16.7 a4.6 4.6 0 0 1 9.2 0 Z" fill="#C2A04A" fillOpacity="0.16"/><path d="M7.4 16.7 a4.6 4.6 0 0 1 9.2 0"/><line x1="12" y1="6.1" x2="12" y2="7.6"/><line x1="5.6" y1="8.6" x2="6.8" y2="9.8"/><line x1="18.4" y1="8.6" x2="17.2" y2="9.8"/><line x1="6.2" y1="20.2" x2="17.8" y2="20.2"/><circle cx="12" cy="4.4" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'how-it-works': (<><circle cx="6" cy="6" r="2.3" fill="#C2A04A" fillOpacity="0.16"/><circle cx="6" cy="6" r="2.3"/><circle cx="18" cy="12" r="2.3"/><circle cx="6" cy="18" r="2.3"/><path d="M8.25 6.5 C13 7.3 15.55 9.4 16.1 11"/><path d="M16.1 13 C15.55 14.6 13 16.7 8.25 17.5"/><circle cx="6" cy="6" r="1.15" fill="#C2A04A" stroke="none"/></>),
  'features': (<><rect x="3.5" y="3.5" width="7" height="7" rx="1.9"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.9" fill="#C2A04A" fillOpacity="0.16"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.9"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.9"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.9"/><circle cx="17" cy="7" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'pricing': (<><circle cx="12" cy="12" r="8.3" fill="#C2A04A" fillOpacity="0.16"/><circle cx="12" cy="12" r="8.3"/><path d="M13.9 9 a2.35 2.35 0 0 0 -3.95 1.65 V15.2"/><line x1="9" y1="12.2" x2="13.1" y2="12.2"/><line x1="9.2" y1="15.2" x2="14.7" y2="15.2"/><circle cx="14.4" cy="8.1" r="1.45" fill="#C2A04A" stroke="none"/></>),
  'faq': (<><rect x="3.6" y="3.8" width="16.8" height="12.6" rx="3.2" fill="#C2A04A" fillOpacity="0.16"/><rect x="3.6" y="3.8" width="16.8" height="12.6" rx="3.2"/><path d="M8.2 16.4 V20 L12 16.4"/><path d="M9.9 8.7 a2.15 2.15 0 0 1 3.95 1.18 c0 1.45 -1.7 1.55 -1.85 2.95"/><circle cx="12" cy="14.5" r="1.25" fill="#C2A04A" stroke="none"/></>),
  'blog': (<><rect x="4" y="4" width="16" height="16" rx="2.6" fill="#C2A04A" fillOpacity="0.16"/><rect x="4" y="4" width="16" height="16" rx="2.6"/><line x1="7.4" y1="8.6" x2="13" y2="8.6"/><line x1="7.4" y1="12" x2="16.6" y2="12"/><line x1="7.4" y1="14.7" x2="16.6" y2="14.7"/><line x1="7.4" y1="17.4" x2="13.5" y2="17.4"/><circle cx="15.6" cy="8.6" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'compare': (<><line x1="12" y1="5.4" x2="12" y2="18.8"/><line x1="6" y1="7.2" x2="18" y2="7.2"/><line x1="8.5" y1="18.8" x2="15.5" y2="18.8"/><line x1="6" y1="7.2" x2="6" y2="9.6"/><line x1="18" y1="7.2" x2="18" y2="9.6"/><path d="M3.6 9.6 a2.4 2.4 0 0 0 4.8 0 Z" fill="#C2A04A" fillOpacity="0.16"/><path d="M3.6 9.6 a2.4 2.4 0 0 0 4.8 0"/><path d="M15.6 9.6 a2.4 2.4 0 0 0 4.8 0"/><circle cx="12" cy="5.2" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'step-audit': (<><rect x="4.4" y="3" width="10.6" height="13.4" rx="2.2" fill="#C2A04A" fillOpacity="0.16"/><rect x="4.4" y="3" width="10.6" height="13.4" rx="2.2"/><line x1="7.2" y1="6.9" x2="12.2" y2="6.9"/><line x1="7.2" y1="9.5" x2="12.2" y2="9.5"/><circle cx="14.6" cy="14" r="3.5"/><line x1="17.1" y1="16.5" x2="20" y2="19.4"/><circle cx="14.6" cy="14" r="1.35" fill="#C2A04A" stroke="none"/></>),
  'step-build': (<><circle cx="12" cy="12" r="4.4" fill="#C2A04A" fillOpacity="0.16"/><circle cx="12" cy="12" r="4.4"/><line x1="12" y1="3.6" x2="12" y2="5.6"/><line x1="12" y1="18.4" x2="12" y2="20.4"/><line x1="3.6" y1="12" x2="5.6" y2="12"/><line x1="18.4" y1="12" x2="20.4" y2="12"/><line x1="6.05" y1="6.05" x2="7.45" y2="7.45"/><line x1="16.55" y1="16.55" x2="17.95" y2="17.95"/><line x1="6.05" y1="17.95" x2="7.45" y2="16.55"/><line x1="16.55" y1="7.45" x2="17.95" y2="6.05"/><circle cx="12" cy="12" r="1.5" fill="#C2A04A" stroke="none"/></>),
  'step-golive': (<><rect x="3.4" y="8" width="17.2" height="8" rx="4" fill="#C2A04A" fillOpacity="0.16"/><rect x="3.4" y="8" width="17.2" height="8" rx="4"/><circle cx="16.4" cy="12" r="2.7" fill="#C2A04A" stroke="none"/></>),
  'arrow-right': (<><line x1="3.6" y1="12" x2="18.4" y2="12"/><path d="M13 6.6 L18.6 12 L13 17.4"/></>),
  'check': (<><circle cx="12" cy="12" r="8.4" fill="#C2A04A" fillOpacity="0.16"/><circle cx="12" cy="12" r="8.4"/><path d="M8.1 12.2 l2.6 2.6 l5.1 -5.7" stroke="#C2A04A"/></>),
  'ai-spark': (<><path d="M12 3.4 C12.65 8.1 13.9 9.55 18.6 10.2 C13.9 10.85 12.65 12.3 12 17 C11.35 12.3 10.1 10.85 5.4 10.2 C10.1 9.55 11.35 8.1 12 3.4 Z" fill="#C2A04A" fillOpacity="0.16" stroke="#C2A04A"/><path d="M18 14.2 C18.2 16.1 18.75 16.7 20.6 16.95 C18.75 17.2 18.2 17.8 18 19.7 C17.8 17.8 17.25 17.2 15.4 16.95 C17.25 16.7 17.8 16.1 18 14.2 Z" fill="#C2A04A" stroke="none"/></>),
  'shield-check': (<><path d="M12 3.1 L19 5.9 V11.6 C19 16 16.1 19.1 12 20.9 C7.9 19.1 5 16 5 11.6 V5.9 Z" fill="#C2A04A" fillOpacity="0.16"/><path d="M12 3.1 L19 5.9 V11.6 C19 16 16.1 19.1 12 20.9 C7.9 19.1 5 16 5 11.6 V5.9 Z"/><path d="M9 11.7 l2.1 2.1 l4 -4.4" stroke="#C2A04A"/></>),
  'clock': (<><circle cx="12" cy="12" r="8.3" fill="#C2A04A" fillOpacity="0.16"/><circle cx="12" cy="12" r="8.3"/><path d="M12 7.4 V12 L15.1 13.9"/><circle cx="12" cy="12" r="1.15" fill="#C2A04A" stroke="none"/></>),
  'mail': (<><rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.4" fill="#C2A04A" fillOpacity="0.16"/><rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.4"/><path d="M4.4 7 L12 12.6 L19.6 7"/><circle cx="18.2" cy="6.2" r="1.4" fill="#C2A04A" stroke="none"/></>),
  'location': (<><path d="M12 20.8 C12 20.8 18 15.4 18 10.2 A6 6 0 0 0 6 10.2 C6 15.4 12 20.8 12 20.8 Z" fill="#C2A04A" fillOpacity="0.16"/><path d="M12 20.8 C12 20.8 18 15.4 18 10.2 A6 6 0 0 0 6 10.2 C6 15.4 12 20.8 12 20.8 Z"/><circle cx="12" cy="10.1" r="2.3"/><circle cx="12" cy="10.1" r="1" fill="#C2A04A" stroke="none"/></>),
  'linkedin': (<><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3.4" fill="#C2A04A" fillOpacity="0.16"/><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3.4"/><line x1="7.6" y1="10.4" x2="7.6" y2="16.4"/><circle cx="7.6" cy="7.5" r="1.05" fill="currentColor" stroke="none"/><path d="M11.2 16.4 V11.8 M11.2 13 a2.4 2.4 0 0 1 4.8 1 V16.4"/><circle cx="16" cy="13.4" r="1.25" fill="#C2A04A" stroke="none"/></>),
  'handshake': (<><path d="M3 4 H11"/><path d="M3 3 L2 14 l6.5 6.5 a1 1 0 1 0 3 -3"/><path d="M21 3 l1 11 h-2"/><path d="M14 14 l2.5 2.5 a1 1 0 1 0 3 -3 l-3.88 -3.88 a3 3 0 0 0 -4.24 0 l-0.88 0.88 a1 1 0 1 1 -3 -3 l2.81 -2.81 a5.79 5.79 0 0 1 7.06 -0.87 l0.47 0.28 a2 2 0 0 0 1.42 0.25 L21 4"/><path d="M11 17 l2 2 a1 1 0 1 0 3 -3"/><circle cx="13" cy="13.4" r="1.4" fill="#C2A04A" stroke="none"/></>),
  'flag': (<><line x1="5.6" y1="4" x2="5.6" y2="20.4"/><path d="M5.6 5.2 H17 a0.7 0.7 0 0 1 0.52 1.17 L15.1 9.1 l2.42 2.73 a0.7 0.7 0 0 1 -0.52 1.17 H5.6 Z" fill="#C2A04A" fillOpacity="0.16"/><path d="M5.6 5.2 H17 a0.7 0.7 0 0 1 0.52 1.17 L15.1 9.1 l2.42 2.73 a0.7 0.7 0 0 1 -0.52 1.17 H5.6 Z"/><circle cx="5.6" cy="3.7" r="1.4" fill="#C2A04A" stroke="none"/></>),
}

interface LfIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  size?: number
}

export function LfIcon({ name, size = 24, className, ...rest }: LfIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
