// components/chat/StreamingCursor.tsx
const StreamingCursor = () => (
  <span
    className="inline-block w-[2px] h-[1em] bg-gray-500 ml-0.5 align-middle"
    style={{ animation: 'blink 1s step-end infinite' }}
  >
    <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
  </span>
);

export default StreamingCursor;