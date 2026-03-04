import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
  className?: string;
}

function renderMath(text: string): string {
  // Display math \[...\] (possibly multiline)
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
    try {
      return `%%MATHBLOCK%%${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}%%/MATHBLOCK%%`;
    } catch { return math; }
  });
  // Display math $$...$$ (possibly multiline)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return `%%MATHBLOCK%%${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}%%/MATHBLOCK%%`;
    } catch { return math; }
  });
  // Inline math \(...\)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch { return math; }
  });
  // Inline math $...$
  text = text.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch { return math; }
  });
  return text;
}

function formatInline(text: string): string {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return text;
}

const TextRenderer = ({ content, className = '' }: Props) => {
  const rendered = useMemo(() => {
    if (!content) return '';

    // Step 1: render ALL math on the full content before splitting lines
    let processed = renderMath(content);

    // Step 2: extract math blocks so line splitting doesn't break them
    const mathBlocks: string[] = [];
    processed = processed.replace(/%%MATHBLOCK%%([\s\S]*?)%%\/MATHBLOCK%%/g, (_, block) => {
      mathBlocks.push(block);
      return `%%MB${mathBlocks.length - 1}%%`;
    });

    // Step 3: line-by-line structural formatting
    const lines = processed.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<br/>';
        continue;
      }
      // Restore math blocks in this line
      const restore = (s: string) => s.replace(/%%MB(\d+)%%/g, (_, i) => `<div class="my-3 overflow-x-auto">${mathBlocks[parseInt(i)]}</div>`);

      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 class="font-semibold text-base text-foreground mt-4 mb-2">${restore(formatInline(trimmed.slice(3)))}</h3>`;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 class="font-gaming text-lg text-foreground mt-4 mb-2" style="font-family:'Orbitron',sans-serif;font-weight:700">${restore(formatInline(trimmed.slice(2)))}</h2>`;
        continue;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) { html += '<ul class="space-y-1 my-2">'; inList = true; }
        html += `<li class="flex items-start gap-2 text-[15px] leading-relaxed" style="color:hsl(215 25% 27%)"><i class="fa-solid fa-chevron-right text-xs mt-1.5 shrink-0" style="color:hsl(204 60% 49%)"></i><span>${restore(formatInline(trimmed.slice(2)))}</span></li>`;
        continue;
      }
      if (inList) { html += '</ul>'; inList = false; }
      // If this line is ONLY a math block placeholder, render it without wrapping in <p>
      if (/^%%MB\d+%%$/.test(trimmed)) {
        html += restore(trimmed);
        continue;
      }
      html += `<p class="text-[15px] leading-relaxed my-1" style="color:hsl(215 25% 27%)">${restore(formatInline(trimmed))}</p>`;
    }
    if (inList) html += '</ul>';
    return html;
  }, [content]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: rendered }} />;
};

export default TextRenderer;
