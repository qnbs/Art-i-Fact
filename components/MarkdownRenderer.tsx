import React from 'react';
import { sanitizeInput } from '../services/geminiService';

interface MarkdownRendererProps {
    markdown: string;
}

// A simple and safe Markdown to HTML renderer.
// It only supports a limited subset of Markdown to prevent XSS.
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
    
    const toHtml = (text: string) => {
        let html = sanitizeInput(text) // Start by sanitizing the whole block
            // Bold (**text** or __text__)
            .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>')
            // Italic (*text* or _text_)
            .replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>')
            // Unordered list items (* or -)
            .replace(/^\s*[\*-]\s+(.*)/gm, '<li>$1</li>')
            // Ordered list items (1.)
            .replace(/^\s*\d+\.\s+(.*)/gm, '<li>$1</li>');

        // Wrap list items in <ul> or <ol>
        // This is a simplified approach and might not handle complex nested lists perfectly
        html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
            if (match.includes('<ol>') || match.includes('<ul>')) return match; // Already wrapped
            return `<ul>${match}</ul>`; // Default to <ul>
        });

        return html.replace(/\n/g, '<br />');
    };

    return (
        <div 
            className="prose prose-sm dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: toHtml(markdown) }} 
        />
    );
};