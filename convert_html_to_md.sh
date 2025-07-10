#!/bin/bash

# Dossier source et destination
SOURCE_DIR="./html"
DEST_DIR="./docs"

# Crée le dossier de destination s’il n’existe pas
mkdir -p "$DEST_DIR"

# Parcours récursif de tous les fichiers .html
find "$SOURCE_DIR" -type f -name "*.html" | while read -r html_file; do
    # Récupère le nom relatif sans l'extension .html
    relative_path="${html_file#$SOURCE_DIR/}"
    md_file="${relative_path%.html}.md"

    # Crée le dossier parent dans docs si nécessaire
    mkdir -p "$DEST_DIR/$(dirname "$md_file")"

    # Conversion avec pandoc
    pandoc "$html_file" -f html -t markdown -o "$DEST_DIR/$md_file"

    echo "✅ Converted: $html_file → $DEST_DIR/$md_file"
done
