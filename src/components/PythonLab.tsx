import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import { PYTHON_SNIPPETS, PythonSnippet } from '../data/chapterData';

type PyValue = string | number | boolean | PyValue[];

function runPythonSubset(source: string): { lines: string[]; error: string | null } {
  const env: Record<string, PyValue> = {};
  const output: string[] = [];

  const splitArgs = (raw: string): string[] => {
    const parts: string[] = [];
    let current = '';
    let depth = 0;
    let quote: string | null = null;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (quote) {
        current += ch;
        if (ch === quote && raw[i - 1] !== '\\') quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
        current += ch;
      } else if (ch === '(' || ch === '[' || ch === '{') {
        depth++;
        current += ch;
      } else if (ch === ')' || ch === ']' || ch === '}') {
        depth--;
        current += ch;
      } else if (ch === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
  };

  const formatValue = (v: PyValue): string => {
    if (Array.isArray(v)) {
      return `[${v.map((item) => (typeof item === 'string' ? `'${item}'` : formatValue(item))).join(', ')}]`;
    }
    return String(v);
  };

  const evalExpr = (rawExpr: string): PyValue => {
    const expr = rawExpr.trim();

    if ((expr.startsWith('f"') && expr.endsWith('"')) || (expr.startsWith("f'") && expr.endsWith("'"))) {
      const inner = expr.slice(2, -1);
      return inner.replace(/\{([^}]+)\}/g, (_, token) => {
        const [subExpr, fmt] = token.split(':');
        const val = evalExpr(subExpr);
        if (fmt) {
          if (fmt.endsWith('f') && typeof val === 'number') {
            const decimals = parseInt(fmt.replace('.', '').replace('f', ''), 10);
            return val.toFixed(Number.isNaN(decimals) ? 2 : decimals);
          }
          if (fmt.endsWith('d') && typeof val === 'number') {
            const pad = parseInt(fmt.replace('d', ''), 10);
            return String(Math.trunc(val)).padStart(Number.isNaN(pad) ? 0 : pad, ' ');
          }
        }
        return formatValue(val);
      });
    }

    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }

    if (expr.startsWith('[') && expr.endsWith(']')) {
      const inner = expr.slice(1, -1).trim();
      if (!inner) return [];
      return splitArgs(inner).map(evalExpr);
    }

    const indexMatch = expr.match(/^([a-zA-Z_]\w*)\[(-?\d+)\]$/);
    if (indexMatch) {
      const target = env[indexMatch[1]];
      const idx = parseInt(indexMatch[2], 10);
      if (Array.isArray(target)) {
        const resolved = idx < 0 ? target.length + idx : idx;
        return target[resolved] ?? 0;
      }
    }

    const callMatch = expr.match(/^([a-zA-Z_]\w*)\((.*)\)$/);
    if (callMatch) {
      const fn = callMatch[1];
      const args = callMatch[2].trim() ? splitArgs(callMatch[2]).map(evalExpr) : [];
      if (fn === 'len' && (Array.isArray(args[0]) || typeof args[0] === 'string')) return args[0].length;
      if (fn === 'sum' && Array.isArray(args[0])) return args[0].reduce((a: number, b) => a + Number(b), 0);
      if (fn === 'max' && Array.isArray(args[0])) return Math.max(...args[0].map(Number));
      if (fn === 'min' && Array.isArray(args[0])) return Math.min(...args[0].map(Number));
      if (fn === 'round') {
        const n = Number(args[0]);
        const d = args[1] !== undefined ? Number(args[1]) : 0;
        const factor = 10 ** d;
        return Math.round(n * factor) / factor;
      }
      if (fn === 'range') {
        const count = Number(args[0] ?? 0);
        return Array.from({ length: Math.min(50, Math.max(0, count)) }, (_, i) => i);
      }
      if (fn === 'enumerate' && Array.isArray(args[0])) {
        const start = args[1] !== undefined ? Number(args[1]) : 0;
        return args[0].map((v, idx) => [start + idx, v]);
      }
    }

    const repeatMatch = expr.match(/^(['"][^'"]*['"])\s*\*\s*(.+)$/);
    if (repeatMatch) {
      const str = String(evalExpr(repeatMatch[1]));
      const count = Math.max(0, Math.min(80, Math.floor(Number(evalExpr(repeatMatch[2])))));
      return str.repeat(count);
    }

    if (/^-?\d+(\.\d+)?$/.test(expr)) {
      return Number(expr);
    }

    if (/^[a-zA-Z_]\w*$/.test(expr) && expr in env) {
      return env[expr];
    }

    const strippedParens = expr.startsWith('(') && expr.endsWith(')') ? expr.slice(1, -1) : expr;
    const arithmeticSafe = strippedParens.replace(/\b[a-zA-Z_]\w*\b/g, (name) => {
      if (name in env && typeof env[name] === 'number') return String(env[name]);
      return name;
    });

    if (/^[\d\s+\-*/().%]+$/.test(arithmeticSafe)) {
      const normalized = arithmeticSafe.replace(/\/\//g, '/');
      const tokens = normalized.match(/\d+(?:\.\d+)?|[+\-*/()%]/g);
      if (tokens) {
        let pos = 0;
        const parseExpr = (): number => {
          let left = parseTerm();
          while (tokens[pos] === '+' || tokens[pos] === '-') {
            const op = tokens[pos++];
            const right = parseTerm();
            left = op === '+' ? left + right : left - right;
          }
          return left;
        };
        const parseTerm = (): number => {
          let left = parseFactor();
          while (tokens[pos] === '*' || tokens[pos] === '/' || tokens[pos] === '%') {
            const op = tokens[pos++];
            const right = parseFactor();
            if (op === '*') left *= right;
            else if (op === '/') left = strippedParens.includes('//') ? Math.floor(left / right) : left / right;
            else left %= right;
          }
          return left;
        };
        const parseFactor = (): number => {
          if (tokens[pos] === '(') {
            pos++;
            const val = parseExpr();
            pos++;
            return val;
          }
          if (tokens[pos] === '-') {
            pos++;
            return -parseFactor();
          }
          return Number(tokens[pos++] ?? 0);
        };
        return parseExpr();
      }
    }

    throw new Error(`Unsupported expression: ${expr}`);
  };

  const execBlock = (lines: string[]) => {
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        i++;
        continue;
      }

      const forMatch = trimmed.match(/^for\s+(.+)\s+in\s+(.+):$/);
      if (forMatch) {
        const vars = forMatch[1].split(',').map((s) => s.trim());
        const iterable = evalExpr(forMatch[2]);
        const baseIndent = line.search(/\S/);
        const body: string[] = [];
        i++;
        while (i < lines.length) {
          const next = lines[i];
          if (!next.trim()) {
            i++;
            continue;
          }
          const indent = next.search(/\S/);
          if (indent <= baseIndent) break;
          body.push(next);
          i++;
        }
        if (Array.isArray(iterable)) {
          for (const item of iterable) {
            if (vars.length === 1) {
              env[vars[0]] = item;
            } else if (Array.isArray(item)) {
              vars.forEach((v, idx) => {
                env[v] = item[idx];
              });
            }
            execBlock(body);
          }
        }
        continue;
      }

      const printMatch = trimmed.match(/^print\((.*)\)$/);
      if (printMatch) {
        const args = printMatch[1].trim() ? splitArgs(printMatch[1]).map(evalExpr) : [];
        output.push(args.map(formatValue).join(' '));
        i++;
        continue;
      }

      const appendMatch = trimmed.match(/^([a-zA-Z_]\w*)\.append\((.+)\)$/);
      if (appendMatch) {
        const list = env[appendMatch[1]];
        if (Array.isArray(list)) {
          list.push(evalExpr(appendMatch[2]));
        }
        i++;
        continue;
      }

      const assignMatch = trimmed.match(/^([^=]+)=(.+)$/);
      if (assignMatch) {
        const lhs = assignMatch[1].split(',').map((s) => s.trim());
        const rhs = splitArgs(assignMatch[2]).map(evalExpr);
        lhs.forEach((varName, idx) => {
          env[varName] = rhs[idx];
        });
        i++;
        continue;
      }

      i++;
    }
  };

  try {
    execBlock(source.split('\n'));
    return { lines: output.length > 0 ? output : ['(Program finished with no output)'], error: null };
  } catch (err) {
    return { lines: output, error: err instanceof Error ? err.message : 'Execution error' };
  }
}

export const PythonLab: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<PythonSnippet>(PYTHON_SNIPPETS[0]);
  const [code, setCode] = useState<string>(PYTHON_SNIPPETS[0].code);
  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<{ lines: string[]; error: string | null }>(() =>
    runPythonSubset(PYTHON_SNIPPETS[0].code)
  );

  const handleSelectSnippet = (snippet: PythonSnippet) => {
    setSelectedSnippet(snippet);
    setCode(snippet.code);
    setResult(runPythonSubset(snippet.code));
    setRunKey((k) => k + 1);
  };

  const handleRun = () => {
    setResult(runPythonSubset(code));
    setRunKey((k) => k + 1);
  };

  const handleReset = () => {
    setCode(selectedSnippet.code);
    setResult(runPythonSubset(selectedSnippet.code));
    setRunKey((k) => k + 1);
  };

  return (
    <section id="hello-python" className="relative z-10 border-t border-white/10 bg-[#0a0a0b] py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
              Interactive Studio
            </p>
            <h2 className="font-editorial mt-3 text-3xl font-normal italic tracking-[-0.01em] text-white sm:text-5xl [text-wrap:balance]">
              Hello Python, Live
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#f2f2f2]/75 font-sans">
            Select a chapter script or edit the source directly to test CSI patterns in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-6 lg:grid-cols-12"
        >
          <div className="flex flex-col gap-2 lg:col-span-4">
            {PYTHON_SNIPPETS.map((snippet, index) => {
              const active = selectedSnippet.id === snippet.id;
              return (
                <button
                  key={snippet.id}
                  type="button"
                  onClick={() => handleSelectSnippet(snippet)}
                  className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    active
                      ? 'border-white/30 bg-white/[0.06] text-white'
                      : 'border-white/10 bg-[#0e0e10]/60 text-zinc-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#f2f2f2]/55">
                      <span className="tabular-nums font-mono-code">0{index + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{snippet.subtitle}</span>
                    </div>
                    <p className="font-editorial mt-1.5 text-2xl font-normal italic text-white">
                      {snippet.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0e0e10]/95 lg:col-span-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <span className="font-mono-code text-xs text-zinc-400">
                {selectedSnippet.id}.py
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/40 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleRun}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition-colors hover:bg-zinc-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run Code</span>
                </button>
              </div>
            </div>

            <div className="grid flex-1 divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-5">
                <label htmlFor="python-editor" className="sr-only">
                  Python source code editor
                </label>
                <textarea
                  id="python-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  rows={10}
                  className="font-mono-code h-full min-h-[240px] w-full resize-none bg-transparent text-xs leading-relaxed text-zinc-100 focus:outline-none sm:text-sm"
                />
              </div>

              <div className="flex flex-col justify-between bg-[#040406] p-5">
                <div>
                  <p className="text-xs font-medium text-zinc-400">Output</p>
                  <div key={runKey} className="font-mono-code mt-3 space-y-1 text-xs leading-relaxed text-emerald-300 sm:text-sm">
                    {result.lines.map((line, i) => (
                      <motion.div
                        key={`${runKey}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, delay: i * 0.035 }}
                        className="whitespace-pre-wrap"
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                  {result.error && (
                    <p className="font-mono-code mt-3 text-xs text-rose-400">
                      {result.error}
                    </p>
                  )}
                </div>
                <p className="mt-6 border-t border-white/8 pt-3 text-xs text-zinc-500">
                  Evaluates variables, loops, f-strings, and print statements locally.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
