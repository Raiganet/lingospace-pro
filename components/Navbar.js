'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [o,setO]=useState(false);
  const M=[
    {id:'dashboard',l:'📊 Dashboard',href:'/'},
    {id:'flashcard',l:'🎴 Flashcard',href:'/#flashcard'},
    {id:'quiz',l:'🎯 Quiz',href:'/#quiz'},
    {id:'listen',l:'🎧 Listen',href:'/#listen'},
    {id:'bookmarks',l:'⭐ Favorit',href:'/#bookmarks'},
    {id:'roadmap',l:'🗺️ Roadmap',href:'/#roadmap'},
    {id:'nahwu',l:'📖 Nahwu',href:'/#nahwu'},
    {id:'english',l:'📚 English',href:'/#english'}
  ];
  return (
    <nav className="glass-modern sticky top-0 z-50 px-3 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2"><div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">L</div><div className="hidden sm:block"><h1 className="text-sm md:text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LingoSpace Pro</h1></div></Link>
        <div className="hidden md:flex gap-1.5 flex-wrap">{M.map(x=><Link key={x.id} href={x.href} className="px-3 py-1.5 text-xs rounded-full glass-modern hover:bg-white/10 whitespace-nowrap">{x.l}</Link>)}<Link href="/blog" className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500">📝 Blog</Link></div>
        <button onClick={()=>setO(v=>!v)} className="md:hidden p-2 rounded-lg glass-modern">{o?'✕':'☰'}</button>
      </div>
      {o&&<div className="md:hidden mt-3 grid grid-cols-2 gap-1.5">{M.map(x=><Link key={x.id} href={x.href} onClick={()=>setO(false)} className="px-3 py-2 text-xs rounded-lg glass-modern">{x.l}</Link>)}<Link href="/blog" onClick={()=>setO(false)} className="col-span-2 px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-center">📝 Blog</Link></div>}
      <style>{`.glass-modern{background:rgba(255,255,255,.05);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1)}`}</style>
    </nav>
  );
}
