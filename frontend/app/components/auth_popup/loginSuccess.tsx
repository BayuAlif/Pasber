'use client';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginSuccess({
  open,
  onClose,
}: Props) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-md bg-[#161b22] border border-white/10 rounded-3xl p-8 text-center">

        <div className="mx-auto w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-6">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Login Berhasil
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          Selamat datang kembali.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
        >
          Lanjutkan
        </button>

      </div>
    </div>
  );
}