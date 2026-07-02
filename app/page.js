// Force static export
export const dynamic = 'force-dynamic';
export const revalidate = false;
export const ssr = false;

import dynamic from 'next/dynamic';

const LingoSpacePro = dynamic(() => import('../components/LingoSpacePro'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Page() {
  return <LingoSpacePro />;
}