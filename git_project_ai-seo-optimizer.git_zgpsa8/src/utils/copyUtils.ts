import type { SEOResult } from '../types';

export function formatResultForCopy(result: SEOResult): string {
  return `Title: ${result.title}
Description: ${result.description}
Tags: ${result.tags.join(', ')}
`;
}

export function formatAllResultsForCopy(results: SEOResult[]): string {
  return results
    .map((result, index) => {
      return `=== Image ${index + 1} ===\n${formatResultForCopy(result)}\n`;
    })
    .join('\n');
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    // Try using the Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or when Clipboard API is not available
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      textArea.remove();
      return false;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}
