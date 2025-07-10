#!/bin/bash

DOCS_DIR="./docs"
README_FILE="README.md"

# Informations à inclure en haut du README
cat <<'HEADER' > "$README_FILE"
/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <internationaleswebservices@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-apps-services-120520193/
 * Company: INTERNATIONALES WEB APPS & SERVICES
 *
 * For more information, please feel free to contact the author.
 */
HEADER

echo "" >> "$README_FILE"
echo "# 📚 Form Validator Documentation" >> "$README_FILE"
echo "" >> "$README_FILE"
echo "_This README links to all the Markdown documentation files inside \`docs/\`._" >> "$README_FILE"
echo "" >> "$README_FILE"

generate_links() {
    local dir="$1"
    local prefix="$2"
    local depth="${3:-0}"
    local indent=$(printf '  %.0s' $(seq 1 "$depth"))

    # Liste des fichiers .md dans ce dossier
    find "$dir" -maxdepth 1 -type f -name "*.md" | sort | while read -r file; do
        local filename=$(basename "$file")
        local name="${filename%.md}"
        local path="${file#$DOCS_DIR/}"
        echo "${indent}- [${name}](${DOCS_DIR}/${path})" >> "$README_FILE"
    done

    # Traitement récursif des sous-dossiers
    find "$dir" -mindepth 1 -type d | sort | while read -r subdir; do
        local subname="${subdir#$DOCS_DIR/}"
        echo "" >> "$README_FILE"
        echo "${indent}## ${subname}" >> "$README_FILE"
        generate_links "$subdir" "$subname/" $((depth + 1))
    done
}

generate_links "$DOCS_DIR"

echo ""
echo "✅ README.md generated successfully."
