import dynamic from 'next/dynamic';

const LingoSpacePro = dynamic(() => import('../components/LingoSpacePro'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-white">Memuat LingoSpace Pro...</p>
      </div>
    </div>
  )
});

export default function Page() {
  return <LingoSpacePro />;
}
