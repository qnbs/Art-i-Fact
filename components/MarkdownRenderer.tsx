import React from 'react';
import { sanitizeInput } from '../services/geminiService.ts';

interface MarkdownRendererProps {
    markdown: string;
}

// A simple and safe Markdown to HTML renderer.
// It supports H1-H3, lists, bold, and italic.
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
    
    const toHtml = (text: string) => {
        if (!text) return '';

        const lines = text.split('\n');
        let html = '';
        let inList = false;

        for (const line of lines) {
            let processedLine = sanitizeInput(line);

            // Inline styles
            processedLine = processedLine
                .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>')
                .replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');

            // Block elements
            if (processedLine.startsWith('### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h3>${processedLine.substring(4)}</h3>`;
            } else if (processedLine.startsWith('## ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h2>${processedLine.substring(3)}</h2>`;
            } else if (processedLine.startsWith('# ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h1>${processedLine.substring(2)}</h1>`;
            } else if (processedLine.startsWith('* ') || processedLine.startsWith('- ')) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += `<li>${processedLine.substring(2)}</li>`;
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                if (processedLine.trim() !== '') {
                   html += `<p>${processedLine}</p>`;
                }
            }
        }

        if (inList) {
            html += '</ul>';
        }

        return html;
    };

    return (
        <div 
            className="prose prose-sm dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: toHtml(markdown) }} 
        />
    );
};