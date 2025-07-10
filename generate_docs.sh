#!/bin/bash

# Configuration des répertoires
SOURCE_DIR="./html"
TARGET_DIR="./docs"

echo "Démarrage de la conversion HTML -> Markdown avec maintien de la structure..."

# ----------------------------------------------------
# 1. Parcourir tous les fichiers .html de manière récursive
# ----------------------------------------------------
find "$SOURCE_DIR" -type f -name "*.html" | while read -r html_file; do
    
    # ----------------------------------------------------
    # 2. Déterminer le chemin relatif et le chemin de sortie
    # ----------------------------------------------------
    
    # Chemin relatif (ex: Collection/index.html)
    relative_path="${html_file#$SOURCE_DIR/}"
    
    # Chemin du fichier Markdown (ex: ./docs/Collection/index.md)
    markdown_file="$TARGET_DIR/${relative_path%.html}.md"
    
    # ----------------------------------------------------
    # 3. Créer le dossier de destination si nécessaire
    # ----------------------------------------------------
    # Extrait le chemin du dossier (ex: ./docs/Collection)
    target_subdir=$(dirname "$markdown_file")
    
    if [ ! -d "$target_subdir" ]; then
        # -p crée les dossiers parents si nécessaire (ex: crée /docs puis /docs/Collection)
        mkdir -p "$target_subdir"
        echo "   -> Dossier créé: $target_subdir"
    fi

    # ----------------------------------------------------
    # 4. Exécuter la commande PANDOC
    # ----------------------------------------------------
    echo "Conversion: $relative_path -> ${relative_path%.html}.md"
    
    pandoc -f html -t markdown "$html_file" -o "$markdown_file"
    
    if [ $? -ne 0 ]; then
        echo "🚨 ERREUR: La conversion de $html_file a échoué."
    fi
done

echo ""
echo "✅ Conversion récursive terminée. La structure de /html a été reproduite dans /docs."