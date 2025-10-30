/**
 * Code Syntax Highlighting System
 * Beautiful code blocks with line numbers, copy button, and multiple themes
 * Uses Prism.js for syntax highlighting
 */

class CodeHighlighter {
    constructor() {
        this.themes = {
            'vscode-dark': 'VSCode Dark',
            'github': 'GitHub',
            'monokai': 'Monokai',
            'dracula': 'Dracula',
            'nord': 'Nord'
        };
        this.currentTheme = localStorage.getItem('code-theme') || 'vscode-dark';
        this.init();
    }

    init() {
        this.loadPrismResources();
        this.enhanceCodeBlocks();
        this.addThemeSwitcher();
    }

    loadPrismResources() {
        // Load Prism.js CSS
        if (!document.querySelector('link[href*="prism"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css`;
            document.head.appendChild(link);
        }

        // Load Prism.js
        if (!window.Prism && !document.querySelector('script[src*="prism"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
            script.onload = () => {
                this.loadLanguages();
                this.highlightAll();
            };
            document.head.appendChild(script);
        } else if (window.Prism) {
            this.highlightAll();
        }
    }

    loadLanguages() {
        // Load common language plugins
        const languages = [
            'javascript', 'typescript', 'python', 'java', 'csharp',
            'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'css',
            'scss', 'sass', 'sql', 'bash', 'json', 'yaml', 'markdown'
        ];

        languages.forEach(lang => {
            if (!Prism.languages[lang]) {
                const script = document.createElement('script');
                script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
                document.head.appendChild(script);
            }
        });

        // Load line numbers plugin
        const lineNumbersScript = document.createElement('script');
        lineNumbersScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js';
        document.head.appendChild(lineNumbersScript);

        const lineNumbersCss = document.createElement('link');
        lineNumbersCss.rel = 'stylesheet';
        lineNumbersCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css';
        document.head.appendChild(lineNumbersCss);
    }

    enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code, pre, .code-block');
        
        codeBlocks.forEach((block, index) => {
            if (block.closest('.code-enhanced')) return;

            const pre = block.tagName === 'PRE' ? block : block.closest('pre');
            if (!pre) return;

            // Wrap in enhanced container
            const wrapper = document.createElement('div');
            wrapper.className = 'code-enhanced';
            wrapper.dataset.codeId = `code-${index}`;
            
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // Detect language
            const language = this.detectLanguage(block);
            
            // Add language class
            if (!block.className.includes('language-')) {
                block.className = `language-${language}`;
            }
            pre.className = 'line-numbers';

            // Create header
            const header = this.createHeader(language, index);
            wrapper.insertBefore(header, pre);

            // Add copy button
            this.addCopyButton(wrapper, block);

            // Add line numbers if not present
            if (!pre.classList.contains('line-numbers')) {
                pre.classList.add('line-numbers');
            }
        });
    }

    detectLanguage(codeElement) {
        // Check for existing language class
        const classMatch = codeElement.className.match(/language-(\w+)/);
        if (classMatch) return classMatch[1];

        // Check data attribute
        if (codeElement.dataset.language) {
            return codeElement.dataset.language;
        }

        // Try to detect from content
        const code = codeElement.textContent;
        
        if (code.includes('function') || code.includes('const') || code.includes('=>')) {
            return 'javascript';
        }
        if (code.includes('def ') || code.includes('import ')) {
            return 'python';
        }
        if (code.includes('<?php')) {
            return 'php';
        }
        if (code.includes('public class') || code.includes('void main')) {
            return 'java';
        }
        if (code.includes('{') && code.includes('}') && code.includes(':')) {
            return 'css';
        }
        if (code.includes('SELECT') || code.includes('FROM')) {
            return 'sql';
        }

        return 'plaintext';
    }

    createHeader(language, index) {
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <div class="code-info">
                <span class="code-language">${this.getLanguageIcon(language)} ${language.toUpperCase()}</span>
                <span class="code-lines" data-lines="0">0 lines</span>
            </div>
            <div class="code-actions">
                <button class="code-action-btn expand-btn" title="Expand code" data-expanded="false">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                </button>
                <button class="code-action-btn copy-code-btn" title="Copy code" data-code-id="${index}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            </div>
        `;

        // Update line count
        this.updateLineCount(header);

        // Add expand functionality
        const expandBtn = header.querySelector('.expand-btn');
        expandBtn.addEventListener('click', () => {
            const wrapper = header.closest('.code-enhanced');
            const isExpanded = expandBtn.dataset.expanded === 'true';
            
            wrapper.classList.toggle('expanded', !isExpanded);
            expandBtn.dataset.expanded = !isExpanded;
            expandBtn.title = isExpanded ? 'Expand code' : 'Collapse code';
        });

        return header;
    }

    getLanguageIcon(language) {
        const icons = {
            javascript: '🟨',
            typescript: '🔷',
            python: '🐍',
            java: '☕',
            php: '🐘',
            ruby: '💎',
            go: '🐹',
            rust: '🦀',
            swift: '🦅',
            css: '🎨',
            html: '🌐',
            sql: '🗄️',
            bash: '💻',
            json: '📋',
            markdown: '📝'
        };
        return icons[language.toLowerCase()] || '📄';
    }

    updateLineCount(header) {
        setTimeout(() => {
            const wrapper = header.closest('.code-enhanced');
            const pre = wrapper.querySelector('pre');
            const lines = pre.textContent.split('\n').length;
            const linesSpan = header.querySelector('.code-lines');
            if (linesSpan) {
                linesSpan.textContent = `${lines} lines`;
                linesSpan.dataset.lines = lines;
            }
        }, 100);
    }

    addCopyButton(wrapper, codeElement) {
        const copyBtn = wrapper.querySelector('.copy-code-btn');
        if (!copyBtn) return;

        copyBtn.addEventListener('click', async () => {
            const code = codeElement.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                this.showCopyFeedback(copyBtn, true);
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = code;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    this.showCopyFeedback(copyBtn, true);
                } catch (err) {
                    this.showCopyFeedback(copyBtn, false);
                }
                
                document.body.removeChild(textarea);
            }
        });
    }

    showCopyFeedback(button, success) {
        const originalHTML = button.innerHTML;
        
        if (success) {
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            button.classList.add('success');
        } else {
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
            button.classList.add('error');
        }

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('success', 'error');
        }, 2000);
    }

    addThemeSwitcher() {
        // Check if already exists
        if (document.querySelector('.code-theme-switcher')) return;

        const switcher = document.createElement('div');
        switcher.className = 'code-theme-switcher';
        switcher.innerHTML = `
            <button class="theme-toggle-btn" title="Change code theme">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                    <circle cx="12" cy="12" r="4"/>
                </svg>
                Code Theme
            </button>
            <div class="theme-dropdown" style="display: none;">
                ${Object.entries(this.themes).map(([key, name]) => `
                    <button class="theme-option ${key === this.currentTheme ? 'active' : ''}" data-theme="${key}">
                        ${name}
                    </button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(switcher);

        // Toggle dropdown
        const toggleBtn = switcher.querySelector('.theme-toggle-btn');
        const dropdown = switcher.querySelector('.theme-dropdown');
        
        toggleBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Theme selection
        const themeOptions = switcher.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                
                // Update active state
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                dropdown.style.display = 'none';
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('code-theme', theme);
        document.body.setAttribute('data-code-theme', theme);
    }

    highlightAll() {
        if (window.Prism) {
            Prism.highlightAll();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.codeHighlighter = new CodeHighlighter();
    });
} else {
    window.codeHighlighter = new CodeHighlighter();
}
