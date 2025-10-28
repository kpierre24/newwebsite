/**
 * ============================================
 * MAIN JAVASCRIPT ENTRY POINT
 * Uses legacy file until migration complete
 * ============================================
 */

// Load legacy JavaScript file
// This contains all the original functionality
const script = document.createElement('script');
script.src = 'js/legacy-main.js';
document.head.appendChild(script);

console.log('✅ Portfolio initialized (using legacy main.js)');

/**
 * NOTE: ES6 modules are disabled for now because they require:
 * 1. <script type="module"> in HTML
 * 2. A build process (Webpack/Vite/Rollup)
 * 
 * Future enhancement: Set up a proper build system to use:
 * - import './features/navigation.js';
 * - import './features/forms.js';
 * - etc.
 * 
 * For now, all code runs from legacy-main.js
 */
