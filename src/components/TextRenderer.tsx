import { useMemo } from 'react';
import katex from 'katex';

interface Props {
  content: string;
  className?: string;
}

function processInline(text: string): string {
  // Display math $$...$$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch { return math; }
  });
  // Inline math $...$
  text = text.replace(/\$([^$]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch { return math; }
  });
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return text;
}

const TextRenderer = ({ content, className = '' }: Props) => {
  const rendered = useMemo(() => {
    if (!content) return '';
    const lines = content.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<br/>';
        continue;
      }
      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 class="font-semibold text-base text-foreground mt-4 mb-2">${processInline(trimmed.slice(3))}</h3>`;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 class="font-gaming text-lg text-foreground mt-4 mb-2" style="font-family:'Orbitron',sans-serif;font-weight:700">${processInline(trimmed.slice(2))}</h2>`;
        continue;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) { html += '<ul class="space-y-1 my-2">'; inList = true; }
        html += `<li class="flex items-start gap-2 text-[15px] leading-relaxed" style="color:hsl(215 25% 27%)"><i class="fa-solid fa-chevron-right text-xs mt-1.5 shrink-0" style="color:hsl(204 60% 49%)"></i><span>${processInline(trimmed.slice(2))}</span></li>`;
        continue;
      }
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p class="text-[15px] leading-relaxed my-1" style="color:hsl(215 25% 27%)">${processInline(trimmed)}</p>`;
    }
    if (inList) html += '</ul>';
    return html;
  }, [content]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: rendered }} />;
};

export default TextRenderer;
