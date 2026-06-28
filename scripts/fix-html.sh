#!/bin/bash
HTML_FILE="dist/index.html"
if [ -f "$HTML_FILE" ]; then
  # Remove type="module" and move script tag from head to end of body
  # Figma's sandbox doesn't support ES modules and inline scripts in head
  # won't find #root since body hasn't been parsed yet
  python3 -c "
import re
with open('$HTML_FILE', 'r') as f:
    html = f.read()

# Replace module script with regular script
html = html.replace('<script type=\"module\" crossorigin>', '<script>')

# Move script tag from head to end of body
script_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if script_match:
    script_content = script_match.group(0)
    html = html.replace(script_content, '')
    html = html.replace('</body>', script_content + '\n  </body>')

with open('$HTML_FILE', 'w') as f:
    f.write(html)
print('Fixed $HTML_FILE - removed type=\"module\" and moved script to body')
"
fi
