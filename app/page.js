import dynamic from 'next/dynamic';

const LingoSpacePro = dynamic(() => import('../components/LingoSpacePro'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTop: '4px solid #a855f7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Memuat LingoSpace Pro...</p>
      </div>
    </div>
  )
});

export default function Page() {
  return <LingoSpacePro />;
}