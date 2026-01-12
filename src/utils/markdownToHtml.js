/**
 * Simple Markdown to HTML converter for TipTap editor
 * Converts basic markdown syntax to HTML for rich text editing
 */

export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  let html = markdown;

  // Convert headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert numbered lists
  html = html.replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

  // Convert bullet points
  html = html.replace(/^[-*]\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)(?!.*<\/ol>)/s, '<ul>$1</ul>');

  // Convert line breaks to paragraphs
  const paragraphs = html.split(/\n\s*\n/).filter(p => p.trim());
  html = paragraphs.map(p => {
    p = p.trim();
    // Don't wrap if already wrapped in block elements
    if (p.match(/^<(h[1-6]|ul|ol|li|div)/)) {
      return p;
    }
    // Handle multiple lines within a paragraph
    const lines = p.split(/\n/).map(line => line.trim()).filter(line => line);
    if (lines.length === 0) return '';
    if (lines.length === 1) return `<p>${lines[0]}</p>`;
    return `<p>${lines.join('<br>')}</p>`;
  }).join('');

  // Clean up multiple consecutive tags
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  return html;
}

export function htmlToMarkdown(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let markdown = html;

  // Convert headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');

  // Convert bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');

  // Convert italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');

  // Convert lists
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
    const items = content.match(/<li>(.*?)<\/li>/g) || [];
    return items.map((item, index) => 
      `${index + 1}. ${item.replace(/<\/?li>/g, '')}`
    ).join('\n') + '\n\n';
  });

  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
    const items = content.match(/<li>(.*?)<\/li>/g) || [];
    return items.map(item => 
      `- ${item.replace(/<\/?li>/g, '')}`
    ).join('\n') + '\n\n';
  });

  // Convert paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/gs, '$1\n\n');

  // Convert breaks
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');

  // Clean up extra whitespace
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}