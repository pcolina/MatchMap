export function trackInputModality(doc: Document): () => void {
  const root = doc.documentElement;

  const onPointerDown = () => root.setAttribute('data-input', 'pointer');
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      root.setAttribute('data-input', 'keyboard');
    }
  };

  doc.addEventListener('pointerdown', onPointerDown);
  doc.addEventListener('keydown', onKeyDown);

  return () => {
    doc.removeEventListener('pointerdown', onPointerDown);
    doc.removeEventListener('keydown', onKeyDown);
  };
}
