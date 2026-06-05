import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';

interface ConsoleLogsProps {
  logs: LogMessage[];
  onClear: () => void;
}

export const ConsoleLogs: React.FC<ConsoleLogsProps> = ({ logs, onClear }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll logs to bottom automatically on changes
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col h-48 w-full select-none text-left">
      <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full animate-ping"></span>
          <span className="font-geist text-[10px] tracking-wider text-on-surface-variant uppercase font-semibold">
            Operational Log Stream
          </span>
        </div>
        <button
          onClick={onClear}
          className="font-geist text-[9px] text-primary-fixed-dim hover:text-white uppercase tracking-widest cursor-pointer hover:underline transition-all"
        >
          Clear Grid
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px] leading-relaxed select-text select-all"
      >
        {logs.length === 0 ? (
          <div className="text-on-surface-variant/40 italic py-4 text-center">
            Log buffer empty. Core synchronized.
          </div>
        ) : (
          logs.map((log) => {
            let textColor = 'text-on-surface/80';
            if (log.type === 'warning') textColor = 'text-amber-400';
            if (log.type === 'success') textColor = 'text-primary-fixed-dim';
            if (log.type === 'critical') textColor = 'text-rose-500 font-bold';

            return (
              <div key={log.id} className="flex items-start gap-1.5 transition-all animate-fadeIn">
                <span className="text-on-surface-variant/50 font-medium whitespace-nowrap">
                  [{log.timestamp}]
                </span>
                <span className={textColor}>{log.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
