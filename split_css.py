"""
CSS File Splitter
Automatically splits the massive styles.css into modular files
"""

import re
import os
from pathlib import Path

# Read the massive styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Define mapping of sections to output files
section_mapping = {
    # Base styles
    r'/\* Base Reset \*/': 'css/base/reset.css',
    r'/\* .*Color System.*\*/': 'css/base/variables.css',
    r'/\* Dark Mode.*\*/': 'css/utilities/dark-mode.css',
    
    # Layout
    r'/\* Container \*/': 'css/layout/container.css',
    r'/\* .*Header.*\*/': 'css/layout/header.css',
    r'/\* .*Navigation.*\*/': 'css/layout/navigation.css',
    r'/\* Footer \*/': 'css/layout/footer.css',
    
    # Components
    r'/\* .*Cards.*\*/': 'css/components/cards.css',
    r'/\* .*Badge.*\*/': 'css/components/badges.css',
    r'/\* .*Button.*\*/': 'css/components/buttons.css',
    r'/\* Skills.*\*/': 'css/components/skills.css',
    r'/\* Contact Form \*/': 'css/components/forms.css',
    r'/\* Modal \*/': 'css/components/modals.css',
    r'/\* Scroll.*\*/': 'css/components/scroll.css',
    
    # Features  
    r'/\* Timeline.*\*/': 'css/features/timeline.css',
    r'/\* Blog.*\*/': 'css/features/blog.css',
    r'/\* .*Animations.*\*/': 'css/features/animations.css',
    r'/\* Loading.*\*/': 'css/features/loading.css',
    r'/\* Project Grid \*/': 'css/features/projects.css',
    
    # Utilities
    r'/\* Accessibility.*\*/': 'css/base/accessibility.css',
    r'/\* Responsive.*\*/': 'css/utilities/responsive.css',
    r'/\* .*Utility.*\*/': 'css/utilities/helpers.css',
}

# Split by major comment sections
sections = re.split(r'(/\*[^*]*\*/)', content)

print(f"Found {len(sections)} sections")
print("\\nFirst 10 section headers:")
for i, section in enumerate(sections[:20]):
    if section.strip().startswith('/*'):
        print(f"{i}: {section.strip()[:60]}")

