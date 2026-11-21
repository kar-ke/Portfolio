import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Linkedin,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import { PORTFOLIO_COPY } from '../../config/portfolio';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface ContactSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Minimal monoline Behance icon matching Lucide's 24×24 1.75px stroke geometry. */
function MinimalBehanceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 7h4.2a2.3 2.3 0 0 1 0 4.6H3V7Z" />
      <path d="M3 11.6h4.7a2.7 2.7 0 0 1 0 5.4H3v-5.4Z" />
      <path d="M15 8h4.5" />
      <path d="M21 14a3.5 3.5 0 1 0-1.1 2.55" />
      <path d="M14 14h7" />
    </svg>
  );
}

/** Minimal monoline WhatsApp icon matching Lucide's 24×24 1.75px stroke geometry. */
function MinimalWhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 21l1.65-3.8A8.5 8.5 0 1 1 8.1 19.7L3 21Z" />
      <path d="M9.4 9.2c.25-.45.55-.45.85-.45.22 0 .45.05.62.42l.68 1.55c.14.32.06.56-.12.78l-.48.55c.56.98 1.38 1.78 2.38 2.32l.55-.48c.22-.18.46-.26.78-.12l1.55.68c.37.17.42.4.42.62 0 .3 0 .6-.45.85-.55.3-1.45.45-2.45.12-1.95-.65-3.85-2.55-4.5-4.5-.33-1-.18-1.9.17-2.34Z" />
    </svg>
  );
}

export function ContactSheet({ open, onClose }: ContactSheetProps) {
  const [copied, setCopied] = useState(false);

  useEscapeKey(open, onClose);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_COPY.contactEmail);
      setCopied(true);
    } catch {
      setCopied(true);
    }
    window.setTimeout(() => setCopied(false), 2200);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-sheet-title"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1D1D1F]/22 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[420px] rounded-[24px] bg-white/95 backdrop-blur-2xl border border-black/[0.08] p-6 sm:p-7 shadow-[0_24px_60px_-16px_rgba(29,29,31,0.2)] animate-sheet-reveal">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="contact-sheet-title"
              className="text-[20px] font-semibold tracking-[-0.025em] text-[#1D1D1F]"
            >
              Start a conversation
            </h2>
            <p className="mt-1.5 text-[14px] leading-[1.55] text-[#6E6E73]">
              Open to thoughtful product design, visual identity, and select collaborations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-[#F5F5F3] px-4 py-3.5 border border-black/[0.05]">
          <span className="text-[14px] font-medium text-[#1D1D1F] truncate">
            {PORTFOLIO_COPY.contactEmail}
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#1D1D1F] border border-black/[0.08] hover:bg-[#FBFBF9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={1.75} aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6E6E73]" strokeWidth={1.75} aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <a
            href={`mailto:${PORTFOLIO_COPY.contactEmail}`}
            className="flex-1 inline-flex items-center justify-center gap-2 h-[42px] px-5 rounded-full bg-[#1D1D1F] text-white text-[14px] font-medium hover:bg-black transition-colors whitespace-nowrap"
          >
            <Mail className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
            <span>Open mail app</span>
          </a>
        </div>

        <div className="mt-5 pt-5 border-t border-black/[0.06]">
          <p className="text-[12px] font-medium tracking-[0.01em] text-[#6E6E73] mb-3">
            Or connect directly
          </p>
          <div
            className="grid grid-cols-3 gap-2.5"
            data-testid="contact-social-links"
          >
            <a
              href={PORTFOLIO_COPY.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/[0.05] px-3 py-3 text-[#1D1D1F] transition-all duration-200 hover:-translate-y-[1px]"
            >
              <Linkedin
                className="w-[18px] h-[18px] text-[#1D1D1F]/80 group-hover:text-[#0A66C2] transition-colors"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-[12.5px] font-medium tracking-[-0.01em]">
                LinkedIn
              </span>
            </a>

            <a
              href={PORTFOLIO_COPY.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Behance portfolio"
              className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/[0.05] px-3 py-3 text-[#1D1D1F] transition-all duration-200 hover:-translate-y-[1px]"
            >
              <MinimalBehanceIcon className="w-[18px] h-[18px] text-[#1D1D1F]/80 group-hover:text-[#1769FF] transition-colors" />
              <span className="text-[12.5px] font-medium tracking-[-0.01em]">
                Behance
              </span>
            </a>

            {/* Desktop / Web view: WhatsApp message redirect */}
            <a
              href={PORTFOLIO_COPY.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-link"
              aria-label={`Message on WhatsApp ${PORTFOLIO_COPY.contactPhone}`}
              title={`WhatsApp ${PORTFOLIO_COPY.contactPhone}`}
              className="group hidden md:flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/[0.05] px-3 py-3 text-[#1D1D1F] transition-all duration-200 hover:-translate-y-[1px]"
            >
              <MinimalWhatsAppIcon className="w-[18px] h-[18px] text-[#1D1D1F]/80 group-hover:text-[#16A34A] transition-colors" />
              <span className="text-[12.5px] font-medium tracking-[-0.01em]">
                WhatsApp
              </span>
            </a>

            {/* Mobile view: Direct phone call via dialer */}
            <a
              href={PORTFOLIO_COPY.contactPhoneHref}
              data-testid="contact-phone-link"
              aria-label={`Call ${PORTFOLIO_COPY.contactPhone}`}
              title={PORTFOLIO_COPY.contactPhone}
              className="group flex md:hidden flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/[0.05] px-3 py-3 text-[#1D1D1F] transition-all duration-200 hover:-translate-y-[1px]"
            >
              <Phone
                className="w-[18px] h-[18px] text-[#1D1D1F]/80 group-hover:text-[#1D1D1F] transition-colors"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-[12.5px] font-medium tracking-[-0.01em]">
                Phone
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSheet;
