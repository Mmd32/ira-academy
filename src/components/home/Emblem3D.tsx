'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renders the academy emblem as a rotating 3D model.
 * `@google/model-viewer` is heavy and browser-only, so it is loaded lazily and
 * only after a HEAD request confirms the .glb is actually being served;
 * anything short of that falls back to the flat PNG.
 */
export function Emblem3D() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewer = hostRef.current?.querySelector('model-viewer');
    if (!viewer) return;
    const onError = () => setFailed(true);
    viewer.addEventListener('error', onError);
    return () => viewer.removeEventListener('error', onError);
  }, [ready]);

  useEffect(() => {
    let alive = true;
    fetch('/media/emblem.glb', { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) throw new Error('no glb');
        return import('@google/model-viewer');
      })
      .then(() => alive && setReady(true))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/media/emblem.png"
        alt="نشان آکادمی ریتیل ایران"
        className="h-full w-full object-contain"
      />
    );
  }

  if (!ready) return <div className="h-full w-full" />;

  return (
    <div ref={hostRef} className="h-full w-full">
      <model-viewer
        src="/media/emblem.glb"
        alt="نشان سه‌بعدی آکادمی ریتیل ایران"
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="24deg"
        camera-controls
        disable-zoom
        disable-pan
        interaction-prompt="none"
        shadow-intensity="0.9"
        shadow-softness="0.8"
        exposure="1.1"
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />
    </div>
  );
}
