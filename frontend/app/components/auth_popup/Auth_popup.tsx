'use client';

type Props = {
  open: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
};

export default function AuthPopup({
  open,
  type,
  title,
  message,
  onClose,
}: Props) {

  if (!open) return null;

  const success = type === 'success';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#161b22]/95 backdrop-blur-2xl shadow-2xl animate-popup">

        {/* Top Glow */}
        <div
          className={`
            absolute top-0 left-0 w-full h-1

            ${success
              ? 'bg-green-500'
              : 'bg-red-500'
            }
          `}
        />

        {/* Content */}
        <div className="p-8 text-center">

          {/* Icon */}
          <div
            className={`
              mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border

              ${success
                ? 'border-green-500/20 bg-green-500/10'
                : 'border-red-500/20 bg-red-500/10'
              }
            `}
          >

            {success ? (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>

            ) : (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

            )}

          </div>

          {/* Title */}
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
            {title}
          </h2>

          {/* Message */}
          <p className="text-sm leading-relaxed text-gray-400 mb-8">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className={`
              w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98]

              ${success
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/30'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30'
              }
            `}
          >
            {success ? 'Lanjutkan' : 'Coba Lagi'}
          </button>

        </div>
      </div>
    </div>
  );
}