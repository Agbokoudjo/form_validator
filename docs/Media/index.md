<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChunkedFileUploader - Documentation Complète</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #1e40af;
            --primary-dark: #1e3a8a;
            --accent: #0ea5e9;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --bg-light: #f9fafb;
            --bg-dark: #111827;
            --text-dark: #1f2937;
            --border-color: #e5e7eb;
            --code-bg: #1f2937;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background: #ffffff;
        }

        .container {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Navigation */
        .sidebar {
            width: 280px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 2rem 0;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-header {
            padding: 0 1.5rem 2rem;
            border-bottom: 2px solid rgba(255,255,255,0.1);
        }

        .sidebar-logo {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .sidebar-tagline {
            font-size: 0.875rem;
            opacity: 0.8;
        }

        .nav-section {
            margin-top: 1.5rem;
        }

        .nav-title {
            padding: 0 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.7;
            margin-bottom: 0.75rem;
        }

        .nav-link {
            display: block;
            padding: 0.75rem 1.5rem;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }

        .nav-link:hover {
            background: rgba(255,255,255,0.1);
            border-left-color: var(--accent);
            padding-left: 1.75rem;
        }

        .nav-link.active {
            background: rgba(255,255,255,0.15);
            border-left-color: var(--accent);
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            padding: 3rem 2rem;
        }

        .section {
            display: none;
            animation: fadeIn 0.3s ease;
        }

        .section.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--primary-dark);
        }

        .intro-text {
            font-size: 1.1rem;
            color: #6b7280;
            margin-bottom: 2rem;
        }

        h2 {
            font-size: 2rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--primary-dark);
            border-bottom: 3px solid var(--accent);
            padding-bottom: 0.5rem;
        }

        h3 {
            font-size: 1.5rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: var(--primary);
        }

        h4 {
            font-size: 1.125rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: var(--primary);
        }

        p {
            margin-bottom: 1rem;
            color: #4b5563;
        }

        /* Code Blocks */
        .code-block {
            background: var(--code-bg);
            color: #e5e7eb;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
            border-left: 4px solid var(--accent);
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .code-label {
            display: inline-block;
            background: var(--accent);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 1rem;
        }

        /* Feature Cards */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .feature-card {
            background: var(--bg-light);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            border-color: var(--accent);
            box-shadow: 0 10px 25px rgba(14,165,233,0.1);
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .feature-card h3 {
            margin-top: 0;
            color: var(--primary-dark);
        }

        /* Tabs */
        .tab-buttons {
            display: flex;
            gap: 0.5rem;
            margin: 1.5rem 0;
            border-bottom: 2px solid var(--border-color);
            flex-wrap: wrap;
        }

        .tab-btn {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
            position: relative;
            bottom: -2px;
        }

        .tab-btn:hover {
            color: var(--primary);
        }

        .tab-btn.active {
            color: white;
            background: var(--primary);
            border-bottom-color: var(--accent);
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease;
        }

        .tab-content.active {
            display: block;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.95rem;
        }

        th {
            background: var(--primary);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }

        tr:hover {
            background: var(--bg-light);
        }

        /* Alerts */
        .alert {
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            border-left: 4px solid;
            display: flex;
            gap: 1rem;
        }

        .alert-info {
            background: #dbeafe;
            border-color: var(--accent);
            color: #0c4a6e;
        }

        .alert-success {
            background: #dcfce7;
            border-color: var(--success);
            color: #14532d;
        }

        .alert-warning {
            background: #fef3c7;
            border-color: var(--warning);
            color: #78350f;
        }

        .alert-danger {
            background: #fee2e2;
            border-color: var(--danger);
            color: #7f1d1d;
        }

        .alert-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        /* Lists */
        ul, ol {
            margin: 1rem 0 1rem 2rem;
            color: #4b5563;
        }

        li {
            margin-bottom: 0.5rem;
        }

        /* Scrollbar */
        .sidebar::-webkit-scrollbar {
            width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.3);
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                z-index: 1000;
            }

            .sidebar.active {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }
        }

        .keyword { color: #f97316; }
        .string { color: #22c55e; }
        .function { color: #60a5fa; }
        .property { color: #fbbf24; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">📤 ChunkedUploader</div>
                <div class="sidebar-tagline">v2.4.0 - Framework Agnostic</div>
            </div>

            <nav class="nav-section">
                <div class="nav-title">Démarrage</div>
                <a href="#" class="nav-link active" data-section="intro">Introduction</a>
                <a href="#" class="nav-link" data-section="features">Fonctionnalités</a>
                <a href="#" class="nav-link" data-section="install">Installation</a>
            </nav>

            <nav class="nav-section">
                <div class="nav-title">Configuration</div>
                <a href="#" class="nav-link" data-section="options">Options</a>
                <a href="#" class="nav-link" data-section="config">Configuration Avancée</a>
                <a href="#" class="nav-link" data-section="interfaces">Interfaces</a>
            </nav>

            <nav class="nav-section">
                <div class="nav-title">Utilisation</div>
                <a href="#" class="nav-link" data-section="vanilla">Vanilla JavaScript</a>
                <a href="#" class="nav-link" data-section="react">React</a>
                <a href="#" class="nav-link" data-section="angular">Angular</a>
            </nav>

            <nav class="nav-section">
                <div class="nav-title">Backend</div>
                <a href="#" class="nav-link" data-section="nodejs">Node.js / Express</a>
                <a href="#" class="nav-link" data-section="php">PHP</a>
                <a href="#" class="nav-link" data-section="python">Python / Flask</a>
            </nav>

            <nav class="nav-section">
                <div class="nav-title">Avancé</div>
                <a href="#" class="nav-link" data-section="events">Événements</a>
                <a href="#" class="nav-link" data-section="resume">Reprise d'Upload</a>
                <a href="#" class="nav-link" data-section="errors">Gestion des Erreurs</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Introduction Section -->
            <section id="intro" class="section active">
                <h1>🚀 ChunkedFileUploader</h1>
                <p class="intro-text">Une bibliothèque TypeScript robuste, framework-agnostique pour télécharger des fichiers volumineux par chunks avec reprise, retry automatique et gestion d'événements complète.</p>

                <h2>Pourquoi ChunkedFileUploader ?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>Performance</h3>
                        <p>Téléchargez des fichiers de plusieurs gigaoctets sans bloquer le navigateur.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔄</div>
                        <h3>Reprise Intelligente</h3>
                        <p>Reprendre un upload depuis le dernier chunk uploadé après une déconnexion.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🛡️</div>
                        <h3>Fiabilité</h3>
                        <p>Retry automatique, vérification d'intégrité (SHA-256) et gestion robuste des erreurs.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Suivi en Temps Réel</h3>
                        <p>Vitesse, temps estimé restant, et pourcentage d'avancement en continu.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <h3>Framework-Agnostique</h3>
                        <p>Fonctionne avec React, Angular, Vue, ou JavaScript Vanilla.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔌</div>
                        <h3>Événements Riches</h3>
                        <p>Écoutez tous les événements : init, progress, pause, reprise, erreur, succès.</p>
                    </div>
                </div>

                <h2>Exemple Rapide</h2>
                <div class="code-label">JavaScript</div>
                <div class="code-block"><span class="keyword">const</span> uploader = <span class="keyword">new</span> <span class="function">ChunkedFileUploader</span>(
    {
        file: inputFile,
        endpoint: <span class="string">'https://api.example.com/upload'</span>,
        endpointInit: <span class="string">'https://api.example.com/init'</span>,
        endpointFinalize: <span class="string">'https://api.example.com/finalize'</span>,
        onProgress: (progress) => console.log(`${progress.percentage}%`),
        onComplete: (result) => console.log(<span class="string">'Succès!'</span>, result)
    },
    cacheAdapter,
    eventEmitter
);

<span class="keyword">await</span> uploader.<span class="function">upload</span>();</div>

                <div class="alert alert-info">
                    <span class="alert-icon">ℹ️</span>
                    <div>
                        <strong>Version Actuelle:</strong> 2.4.0 - Compatible avec TypeScript 4.5+ et JavaScript ES2020+
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section id="features" class="section">
                <h1>✨ Fonctionnalités Détaillées</h1>

                <h2>1. Upload par Chunks</h2>
                <p>Divisez automatiquement les fichiers en chunks optimisés selon la vitesse de connexion et la taille du fichier.</p>

                <h2>2. Vérification d'Intégrité</h2>
                <p>Chaque upload est protégé par un hash SHA-256 pour garantir l'intégrité des données transférées.</p>

                <h2>3. Retry Automatique</h2>
                <p>Les chunks échoués sont automatiquement retentés avec backoff exponentiel configurable.</p>

                <h2>4. Pause/Reprise</h2>
                <p>Mettez en pause à tout moment et reprenez depuis le dernier point de sauvegarde.</p>

                <h2>5. Gestion des Erreurs Avancée</h2>
                <p>Exceptions personnalisées pour chaque type d'erreur : upload, initialisation, réseau, etc.</p>

                <h2>6. Événements Personnalisés</h2>
                <p>Plus de 15 événements émis pour un contrôle total du flux d'upload.</p>

                <h2>7. Support du Cache</h2>
                <p>Adapter de cache flexible : localStorage, IndexedDB, sessionStorage ou custom.</p>

                <h2>8. Métadonnées</h2>
                <p>Attachez des données supplémentaires à chaque upload pour le suivi côté serveur.</p>
            </section>

            <!-- Installation Section -->
            <section id="install" class="section">
                <h1>📦 Installation</h1>

                <h2>NPM / Yarn</h2>
                <div class="code-label">bash</div>
                <div class="code-block">npm install chunked-file-uploader
# ou
yarn add chunked-file-uploader</div>

                <h2>Importation</h2>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">import</span> { 
    ChunkedFileUploader,
    DefaultUploadResumeCacheAdapter,
    EventEmitter 
} <span class="keyword">from</span> <span class="string">'chunked-file-uploader'</span>;</div>

                <h2>Structure de Base</h2>
                <p>Voici ce qu'il vous faut pour démarrer :</p>
                <ul>
                    <li><strong>ChunkedFileUploader:</strong> La classe principale</li>
                    <li><strong>DefaultUploadResumeCacheAdapter:</strong> Gestionnaire de cache par défaut</li>
                    <li><strong>EventEmitter:</strong> Système d'événements</li>
                    <li><strong>UploadOptions:</strong> Configuration de l'upload</li>
                </ul>
            </section>

            <!-- Options Section -->
            <section id="options" class="section">
                <h1>⚙️ Options de Configuration</h1>

                <h2>UploadOptions - Interface Complète</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Propriété</th>
                            <th>Type</th>
                            <th>Requis</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>file</code></td>
                            <td>File</td>
                            <td>✅</td>
                            <td>Le fichier à télécharger</td>
                        </tr>
                        <tr>
                            <td><code>endpoint</code></td>
                            <td>string | URL</td>
                            <td>✅</td>
                            <td>URL pour télécharger les chunks</td>
                        </tr>
                        <tr>
                            <td><code>endpointInit</code></td>
                            <td>string | URL</td>
                            <td>✅</td>
                            <td>URL pour initialiser la session</td>
                        </tr>
                        <tr>
                            <td><code>endpointFinalize</code></td>
                            <td>string | URL</td>
                            <td>✅</td>
                            <td>URL pour finaliser l'upload</td>
                        </tr>
                        <tr>
                            <td><code>chunkSize</code></td>
                            <td>number (bytes)</td>
                            <td>❌</td>
                            <td>Taille de chaque chunk (défaut: calculé auto)</td>
                        </tr>
                        <tr>
                            <td><code>speedMbps</code></td>
                            <td>number</td>
                            <td>❌</td>
                            <td>Vitesse de connexion pour optimiser les chunks</td>
                        </tr>
                        <tr>
                            <td><code>maxRetries</code></td>
                            <td>number</td>
                            <td>❌</td>
                            <td>Tentatives avant abandon (défaut: 3)</td>
                        </tr>
                        <tr>
                            <td><code>timeout</code></td>
                            <td>number (ms)</td>
                            <td>❌</td>
                            <td>Timeout des requêtes (défaut: 60000)</td>
                        </tr>
                        <tr>
                            <td><code>headers</code></td>
                            <td>HeadersInit</td>
                            <td>❌</td>
                            <td>Headers HTTP personnalisés</td>
                        </tr>
                        <tr>
                            <td><code>metadata</code></td>
                            <td>Record&lt;string, any&gt;</td>
                            <td>❌</td>
                            <td>Données supplémentaires</td>
                        </tr>
                        <tr>
                            <td><code>autoSave</code></td>
                            <td>boolean</td>
                            <td>❌</td>
                            <td>Sauvegarder la progression automatiquement</td>
                        </tr>
                        <tr>
                            <td><code>onProgress</code></td>
                            <td>function</td>
                            <td>❌</td>
                            <td>Callback de progression</td>
                        </tr>
                        <tr>
                            <td><code>onChunkSuccess</code></td>
                            <td>function</td>
                            <td>❌</td>
                            <td>Callback après succès d'un chunk</td>
                        </tr>
                        <tr>
                            <td><code>onChunkError</code></td>
                            <td>function</td>
                            <td>❌</td>
                            <td>Callback en cas d'erreur chunk</td>
                        </tr>
                        <tr>
                            <td><code>onComplete</code></td>
                            <td>function</td>
                            <td>❌</td>
                            <td>Callback après succès complet</td>
                        </tr>
                        <tr>
                            <td><code>onError</code></td>
                            <td>function</td>
                            <td>❌</td>
                            <td>Callback erreur générale</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Configuration Avancée -->
            <section id="config" class="section">
                <h1>🔧 Configuration Avancée</h1>

                <h2>ChunkSizeConfig</h2>
                <p>Optimiser la taille des chunks selon la vitesse et la taille du fichier :</p>

                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">interface</span> <span class="property">ChunkSizeConfig</span> {
    <span class="property">defaultChunkSizeMB</span>: <span class="keyword">number</span>;
    <span class="property">slowSpeedThresholdMbps</span>: <span class="keyword">number</span>;
    <span class="property">slowSpeedChunkSizeMB</span>: <span class="keyword">number</span>;
    <span class="property">fileSizeThresholds</span>: {
        <span class="property">maxSizeMB</span>: <span class="keyword">number</span>;
        <span class="property">chunkSizeMB</span>: <span class="keyword">number</span>;
    }[];
}</div>

                <h2>Exemple de Configuration Personnalisée</h2>
                <div class="code-label">JavaScript</div>
                <div class="code-block"><span class="keyword">const</span> config = {
    <span class="property">defaultChunkSizeMB</span>: <span class="string">50</span>,
    <span class="property">slowSpeedThresholdMbps</span>: <span class="string">5</span>,
    <span class="property">slowSpeedChunkSizeMB</span>: <span class="string">2</span>,
    <span class="property">fileSizeThresholds</span>: [
        { <span class="property">maxSizeMB</span>: <span class="string">200</span>, <span class="property">chunkSizeMB</span>: <span class="string">50</span> },
        { <span class="property">maxSizeMB</span>: <span class="string">1000</span>, <span class="property">chunkSizeMB</span>: <span class="string">500</span> },
        { <span class="property">maxSizeMB</span>: <span class="string">Infinity</span>, <span class="property">chunkSizeMB</span>: <span class="string">700</span> }
    ]
};</div>

                <div class="alert alert-info">
                    <span class="alert-icon">💡</span>
                    <div>
                        <strong>Conseil:</strong> Pour les connexions lentes, augmentez <code>slowSpeedThresholdMbps</code> et réduisez <code>slowSpeedChunkSizeMB</code>.
                    </div>
                </div>
            </section>

            <!-- Interfaces -->
            <section id="interfaces" class="section">
                <h1>📋 Interfaces Principales</h1>

                <h2>UploadProgress</h2>
                <p>Données de progression en temps réel :</p>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">interface</span> <span class="property">UploadProgress</span> {
    <span class="property">uploadedChunks</span>: <span class="keyword">number</span>;      <span class="string">// Chunks uploadés</span>
    <span class="property">totalChunks</span>: <span class="keyword">number</span>;         <span class="string">// Total chunks</span>
    <span class="property">uploadedBytes</span>: <span class="keyword">number</span>;      <span class="string">// Bytes uploadés</span>
    <span class="property">totalBytes</span>: <span class="keyword">number</span>;         <span class="string">// Total bytes</span>
    <span class="property">percentage</span>: <span class="keyword">number</span>;        <span class="string">// 0-100</span>
    <span class="property">speed</span>: <span class="keyword">number</span>;            <span class="string">// Bytes/sec</span>
    <span class="property">estimatedTimeRemaining</span>: <span class="keyword">number</span> | <span class="keyword">null</span>;
    <span class="property">elapsed</span>: <span class="keyword">number</span>;          <span class="string">// Secondes</span>
}</div>

                <h2>ChunkInfo</h2>
                <p>Détails d'un chunk spécifique :</p>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">interface</span> <span class="property">ChunkInfo</span> {
    <span class="property">index</span>: <span class="keyword">number</span>;           <span class="string">// Position du chunk (0-based)</span>
    <span class="property">start</span>: <span class="keyword">number</span>;           <span class="string">// Byte initial</span>
    <span class="property">end</span>: <span class="keyword">number</span>;             <span class="string">// Byte final</span>
    <span class="property">size</span>: <span class="keyword">number</span>;            <span class="string">// Taille en bytes</span>
    <span class="property">attempt</span>: <span class="keyword">number</span>;         <span class="string">// Tentative actuelle</span>
    <span class="property">status</span>: <span class="keyword">'pending' | 'uploading' | 'success' | 'error'</span>;
}</div>

                <h2>UploadState (Enum)</h2>
                <p>États possibles d'un upload :</p>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">enum</span> <span class="property">UploadState</span> {
    <span class="property">IDLE</span> = <span class="string">'idle'</span>,
    <span class="property">INITIALIZING</span> = <span class="string">'initializing'</span>,
    <span class="property">UPLOADING</span> = <span class="string">'uploading'</span>,
    <span class="property">PAUSED</span> = <span class="string">'paused'</span>,
    <span class="property">CANCELLED</span> = <span class="string">'cancelled'</span>,
    <span class="property">FINALIZING</span> = <span class="string">'finalizing'</span>,
    <span class="property">COMPLETED</span> = <span class="string">'completed'</span>,
    <span class="property">FAILED</span> = <span class="string">'failed'</span>
}</div>

                <h2>UploadResult</h2>
                <p>Résultat d'un upload complété :</p>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">interface</span> <span class="property">UploadResult</span> {
    <span class="property">success</span>: <span class="keyword">boolean</span>;
    <span class="property">fileId</span>: <span class="keyword">string</span>;
    <span class="property">totalChunks</span>: <span class="keyword">number</span>;
    <span class="property">totalBytes</span>: <span class="keyword">number</span>;
    <span class="property">duration</span>: <span class="keyword">number</span>;           <span class="string">// Secondes</span>
    <span class="property">averageSpeed</span>: <span class="keyword">number</span>;      <span class="string">// Bytes/sec</span>
    <span class="property">finalizeUploadResponse</span>: <span class="keyword">any</span>;
}</div>
            </section>

            <!-- Vanilla JavaScript -->
            <section id="vanilla" class="section">
                <h1>🍦 Vanilla JavaScript</h1>

                <h2>Exemple Complet - Formulaire d'Upload</h2>
                <div class="code-label">HTML</div>
                <div class="code-block">&lt;<span class="keyword">input</span> <span class="property">type</span>=<span class="string">"file"</span> <span class="property">id</span>=<span class="string">"fileInput"</span>&gt;
&lt;<span class="keyword">button</span> <span class="property">id</span>=<span class="string">"uploadBtn"</span>&gt;Démarrer&lt;/<span class="keyword">button</span>&gt;
&lt;<span class="keyword">button</span> <span class="property">id</span>=<span class="string">"pauseBtn"</span>&gt;Pause&lt;/<span class="keyword">button</span>&gt;
&lt;<span class="keyword">button</span> <span class="property">id</span>=<span class="string">"resumeBtn"</span>&gt;Reprendre&lt;/<span class="keyword">button</span>&gt;

&lt;<span class="keyword">div</span> <span class="property">id</span>=<span class="string">"progressBar"</span>&gt;&lt;/<span class="keyword">div</span>&gt;
&lt;<span class="keyword">p</span> <span class="property">id</span>=<span class="string">"progressText"</span>&gt;&lt;/<span class="keyword">p</span>&gt;</div>

                <h2>Implémentation JavaScript</h2>
                <div class="code-label">JavaScript</div>
                <div class="code-block"><span class="keyword">import</span> { 
    ChunkedFileUploader,
    DefaultUploadResumeCacheAdapter,
    EventEmitter 
} <span class="keyword">from</span> <span class="string">'chunked-file-uploader'</span>;

<span class="keyword">let</span> uploader = <span class="keyword">null</span>;
<span class="keyword">const</span> cache = <span class="keyword">new</span> <span class="function">DefaultUploadResumeCacheAdapter</span>();
<span class="keyword">const</span> eventEmitter = <span class="keyword">new</span> <span class="function">EventEmitter</span>();

<span class="keyword">document</span>.<span class="function">getElementById</span>(<span class="string">'uploadBtn'</span>).<span class="function">addEventListener</span>(<span class="string">'click'</span>, <span class="keyword">async</span> () => {
    <span class="keyword">const</span> file = <span class="keyword">document</span>.<span class="function">getElementById</span>(<span class="string">'fileInput'</span>).files[<span class="string">0</span>];
    
    <span class="keyword">if</span> (!file) {
        <span class="function">alert</span>(<span class="string">'Sélectionnez un fichier'</span>);
        <span class="keyword">return</span>;
    }

    uploader = <span class="keyword">new</span> <span class="function">ChunkedFileUploader</span>(
        {
            file,
            endpoint: <span class="string">'https://api.example.com/upload'</span>,
            endpointInit: <span class="string">'https://api.example.com/init'</span>,
            endpointFinalize: <span class="string">'https://api.example.com/finalize'</span>,
            maxRetries: <span class="string">3</span>,
            autoSave: <span class="keyword">true</span>,
            headers: {
                <span class="string">'Authorization'</span>: <span class="string">'Bearer YOUR_TOKEN'</span>
            },
            metadata: {
                <span class="string">'userId'</span>: <span class="string">'123'</span>,
                <span class="string">'projectId'</span>: <span class="string">'abc'</span>
            },
            onProgress: (progress) => {
                <span class="keyword">const</span> bar = <span class="keyword">document</span>.<span class="function">getElementById</span>(<span class="string">'progressBar'</span>);
                bar.style.width = progress.percentage + <span class="string">'%'</span>;
                
                <span class="keyword">const</span> speed = (progress.speed / <span class="string">1000000</span>).<span class="function">toFixed</span>(<span class="string">2</span>);
                <span class="keyword">const</span> eta = progress.estimatedTimeRemaining 
                    ? <span class="function">formatTime</span>(progress.estimatedTimeRemaining)
                    : <span class="string">'Calcul...'</span>;
                
                <span class="keyword">document</span>.<span class="function">getElementById</span>(<span class="string">'progressText'</span>).textContent = 
                    <span class="string">`${progress.percentage}% | ${speed} MB/s | ETA: ${eta}`</span>;
            },
            onComplete: (result) => {
                <span class="function">console</span>.<span class="function">log</span>(<span class="string">'Upload réussi!'</span>, result);
                <span class="function">alert</span>(<span class="string">'Fichier uploadé avec succès!'</span>);
            },
            onError: (error) => {
                <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Erreur:'</span>, error);
                <span class="function">alert</span>(<span class="string">'Erreur lors de l\'upload'</span>);
            }
        },
        cache,
        eventEmitter
    );

    <span class="keyword">try</span> {
        <span class="keyword">await</span> uploader.<span class="function">upload</span>();
    } <span class="keyword">catch</span> (error) {
        <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Upload échoué:'</span>, error);
    }
});

<span class="keyword">document</span>.<span class="function">getElementById</span>(<span class="string">'pauseBtn'</span>).<span class="function">addEventListener</span>(<span class="string">'click'</span>, () => {
    uploader?.<span class="function">pause</span>();
});

<span class="keyword">document</span>.<span class="function">getElementById</span>(<span class="string">'resumeBtn'</span>).<span class="function">addEventListener</span>(<span class="string">'click'</span>, () => {
    uploader?.<span class="function">resume</span>();
});

<span class="keyword">function</span> <span class="function">formatTime</span>(seconds) {
    <span class="keyword">const</span> hrs = <span class="function">Math</span>.<span class="function">floor</span>(seconds / <span class="string">3600</span>);
    <span class="keyword">const</span> mins = <span class="function">Math</span>.<span class="function">floor</span>((seconds % <span class="string">3600</span>) / <span class="string">60</span>);
    <span class="keyword">const</span> secs = <span class="function">Math</span>.<span class="function">floor</span>(seconds % <span class="string">60</span>);
    <span class="keyword">return</span> <span class="string">`${hrs}h ${mins}m ${secs}s`</span>;
}</div>

                <div class="alert alert-success">
                    <span class="alert-icon">✅</span>
                    <div>
                        <strong>Prêt à l'emploi:</strong> Cet exemple fonctionne immédiatement avec HTML standard.
                    </div>
                </div>
            </section>

            <!-- React Section -->
            <section id="react" class="section">
                <h1>⚛️ React</h1>

                <h2>Hook Personnalisé - useChunkedUploader</h2>
                <div class="code-label">React Hook (TypeScript)</div>
                <div class="code-block"><span class="keyword">import</span> { useState, useRef, useCallback } <span class="keyword">from</span> <span class="string">'react'</span>;
<span class="keyword">import</span> { ChunkedFileUploader } <span class="keyword">from</span> <span class="string">'chunked-file-uploader'</span>;

<span class="keyword">export</span> <span class="keyword">const</span> <span class="function">useChunkedUploader</span> = () => {
    <span class="keyword">const</span> [progress, setProgress] = <span class="function">useState</span>(<span class="string">0</span>);
    <span class="keyword">const</span> [state, setState] = <span class="function">useState</span>(<span class="string">'idle'</span>);
    <span class="keyword">const</span> [error, setError] = <span class="function">useState</span>(<span class="keyword">null</span>);
    <span class="keyword">const</span> uploaderRef = <span class="function">useRef</span>(<span class="keyword">null</span>);

    <span class="keyword">const</span> startUpload = <span class="function">useCallback</span>(<span class="keyword">async</span> (file, options) => {
        setState(<span class="string">'uploading'</span>);
        setError(<span class="keyword">null</span>);

        <span class="keyword">try</span> {
            <span class="keyword">const</span> uploader = <span class="keyword">new</span> <span class="function">ChunkedFileUploader</span>(
                {
                    file,
                    ...options,
                    onProgress: (p) => setProgress(p.percentage),
                    onError: (err) => {
                        setError(err.message);
                        setState(<span class="string">'error'</span>);
                    }
                },
                cache,
                eventEmitter
            );
            
            uploaderRef.current = uploader;
            <span class="keyword">await</span> uploader.<span class="function">upload</span>();
            setState(<span class="string">'completed'</span>);
        } <span class="keyword">catch</span> (err) {
            setError(err.message);
            setState(<span class="string">'error'</span>);
        }
    }, []);

    <span class="keyword">return</span> {
        progress,
        state,
        error,
        startUpload,
        pause: () => uploaderRef.current?.<span class="function">pause</span>(),
        resume: () => uploaderRef.current?.<span class="function">resume</span>(),
        cancel: () => uploaderRef.current?.<span class="function">cancel</span>()
    };
};</div>

                <h2>Composant React - Exemple d'Utilisation</h2>
                <div class="code-label">JSX</div>
                <div class="code-block"><span class="keyword">function</span> <span class="function">FileUploadComponent</span>() {
    <span class="keyword">const</span> { progress, state, error, startUpload, pause, resume, cancel } = <span class="function">useChunkedUploader</span>();

    <span class="keyword">const</span> handleFileSelect = <span class="keyword">async</span> (e) => {
        <span class="keyword">const</span> file = e.target.files[<span class="string">0</span>];
        
        <span class="keyword">await</span> <span class="function">startUpload</span>(file, {
            endpoint: <span class="string">'https://api.example.com/upload'</span>,
            endpointInit: <span class="string">'https://api.example.com/init'</span>,
            endpointFinalize: <span class="string">'https://api.example.com/finalize'</span>,
            maxRetries: <span class="string">3</span>
        });
    };

    <span class="keyword">return</span> (
        &lt;<span class="keyword">div</span>&gt;
            &lt;<span class="keyword">input</span> 
                <span class="property">type</span>=<span class="string">"file"</span> 
                <span class="property">onChange</span>={handleFileSelect}
                <span class="property">disabled</span>={state === <span class="string">'uploading'</span>}
            /&gt;
            
            {state === <span class="string">'uploading'</span> && (
                &lt;&gt;
                    &lt;<span class="keyword">div</span> <span class="property">style</span>={{
                        width: <span class="string">'100%'</span>,
                        height: <span class="string">'20px'</span>,
                        background: <span class="string">'#ccc'</span>
                    }}&gt;
                        &lt;<span class="keyword">div</span> <span class="property">style</span>={{
                            width: <span class="string">`${progress}%`</span>,
                            height: <span class="string">'100%'</span>,
                            background: <span class="string">'#4CAF50'</span>
                        }} /&gt;
                    &lt;/<span class="keyword">div</span>&gt;
                    &lt;<span class="keyword">p</span>&gt;{progress}%&lt;/<span class="keyword">p</span>&gt;
                    &lt;<span class="keyword">button</span> <span class="property">onClick</span>={pause}&gt;Pause&lt;/<span class="keyword">button</span>&gt;
                    &lt;<span class="keyword">button</span> <span class="property">onClick</span>={resume}&gt;Reprendre&lt;/<span class="keyword">button</span>&gt;
                    &lt;<span class="keyword">button</span> <span class="property">onClick</span>={cancel}&gt;Annuler&lt;/<span class="keyword">button</span>&gt;
                &lt;/&gt;
            )}
            
            {error && &lt;<span class="keyword">p</span> <span class="property">style</span>={{color: <span class="string">'red'</span>}}&gt;{error}&lt;/<span class="keyword">p</span>&gt;}
            {state === <span class="string">'completed'</span> && &lt;<span class="keyword">p</span> <span class="property">style</span>={{color: <span class="string">'green'</span>}}&gt;✓ Succès!&lt;/<span class="keyword">p</span>&gt;}
        &lt;/<span class="keyword">div</span>&gt;
    );
}</div>

                <div class="alert alert-info">
                    <span class="alert-icon">ℹ️</span>
                    <div>
                        <strong>Performance:</strong> Utilisez <code>useRef</code> pour l'uploader afin d'éviter les re-rendus inutiles.
                    </div>
                </div>
            </section>

            <!-- Angular Section -->
            <section id="angular" class="section">
                <h1>🅰️ Angular</h1>

                <h2>Service Angular</h2>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">import</span> { Injectable } <span class="keyword">from</span> <span class="string">'@angular/core'</span>;
<span class="keyword">import</span> { BehaviorSubject, Observable } <span class="keyword">from</span> <span class="string">'rxjs'</span>;
<span class="keyword">import</span> { ChunkedFileUploader } <span class="keyword">from</span> <span class="string">'chunked-file-uploader'</span>;

<span class="keyword">@Injectable</span>({
    providedIn: <span class="string">'root'</span>
})
<span class="keyword">export</span> <span class="keyword">class</span> <span class="function">UploadService</span> {
    <span class="keyword">private</span> progressSubject = <span class="keyword">new</span> <span class="function">BehaviorSubject</span>(<span class="string">0</span>);
    <span class="keyword">public</span> progress$ = <span class="keyword">this</span>.progressSubject.<span class="function">asObservable</span>();

    <span class="keyword">private</span> uploader: ChunkedFileUploader;

    <span class="function">upload</span>(file: File, options: <span class="keyword">any</span>): <span class="keyword">Promise</span>&lt;<span class="keyword">void</span>&gt; {
        <span class="keyword">return</span> <span class="keyword">new</span> <span class="function">Promise</span>((resolve, reject) => {
            <span class="keyword">this</span>.uploader = <span class="keyword">new</span> <span class="function">ChunkedFileUploader</span>(
                {
                    file,
                    ...options,
                    onProgress: (p) => <span class="keyword">this</span>.progressSubject.<span class="function">next</span>(p.percentage),
                    onComplete: () => <span class="function">resolve</span>(),
                    onError: (err) => <span class="function">reject</span>(err)
                },
                cache,
                eventEmitter
            );
            
            <span class="keyword">this</span>.uploader.<span class="function">upload</span>();
        });
    }

    <span class="function">pause</span>(): <span class="keyword">void</span> {
        <span class="keyword">this</span>.uploader?.<span class="function">pause</span>();
    }

    <span class="function">resume</span>(): <span class="keyword">void</span> {
        <span class="keyword">this</span>.uploader?.<span class="function">resume</span>();
    }

    <span class="function">cancel</span>(): <span class="keyword">void</span> {
        <span class="keyword">this</span>.uploader?.<span class="function">cancel</span>();
    }
}</div>

                <h2>Composant Angular</h2>
                <div class="code-label">TypeScript</div>
                <div class="code-block"><span class="keyword">import</span> { Component } <span class="keyword">from</span> <span class="string">'@angular/core'</span>;
<span class="keyword">import</span> { UploadService } <span class="keyword">from</span> <span class="string">'./upload.service'</span>;

<span class="keyword">@Component</span>({
    selector: <span class="string">'app-upload'</span>,
    templateUrl: <span class="string">'./upload.component.html'</span>,
    styleUrls: [<span class="string">'./upload.component.css'</span>]
})
<span class="keyword">export</span> <span class="keyword">class</span> <span class="function">UploadComponent</span> {
    progress$ = <span class="keyword">this</span>.uploadService.progress$;
    selectedFile: File | <span class="keyword">null</span> = <span class="keyword">null</span>;

    <span class="keyword">constructor</span>(<span class="keyword">private</span> uploadService: UploadService) {}

    <span class="function">onFileSelected</span>(event: Event): <span class="keyword">void</span> {
        <span class="keyword">const</span> target = event.target <span class="keyword">as</span> HTMLInputElement;
        <span class="keyword">const</span> files = target.files;
        
        <span class="keyword">if</span> (files && files.length) {
            <span class="keyword">this</span>.selectedFile = files[<span class="string">0</span>];
        }
    }

    <span class="keyword">async</span> <span class="function">startUpload</span>(): <span class="function">Promise</span>&lt;<span class="keyword">void</span>&gt; {
        <span class="keyword">if</span> (!<span class="keyword">this</span>.selectedFile) <span class="keyword">return</span>;

        <span class="keyword">try</span> {
            <span class="keyword">await</span> <span class="keyword">this</span>.uploadService.<span class="function">upload</span>(<span class="keyword">this</span>.selectedFile, {
                endpoint: <span class="string">'https://api.example.com/upload'</span>,
                endpointInit: <span class="string">'https://api.example.com/init'</span>,
                endpointFinalize: <span class="string">'https://api.example.com/finalize'</span>
            });
            <span class="function">alert</span>(<span class="string">'Upload réussi!'</span>);
        } <span class="keyword">catch</span> (error) {
            <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Upload failed:'</span>, error);
        }
    }
}</div>

                <h2>Template Angular</h2>
                <div class="code-label">HTML</div>
                <div class="code-block">&lt;<span class="keyword">div</span>&gt;
    &lt;<span class="keyword">input</span> 
        <span class="property">type</span>=<span class="string">"file"</span> 
        <span class="property">(change)</span>=<span class="string">"onFileSelected($event)"</span>
    /&gt;
    &lt;<span class="keyword">button</span> <span class="property">(click)</span>=<span class="string">"startUpload()"</span>&gt;
        Démarrer
    &lt;/<span class="keyword">button</span>&gt;

    &lt;<span class="keyword">div</span> <span class="property">class</span>=<span class="string">"progress"</span> *<span class="property">ngIf</span>=<span class="string">"(progress$ | async) as progress"</span>&gt;
        &lt;<span class="keyword">div</span> 
            <span class="property">[style.width.%]</span>=<span class="string">"progress"</span>
            <span class="property">class</span>=<span class="string">"progress-bar"</span>
        &gt;&lt;/<span class="keyword">div</span>&gt;
    &lt;/<span class="keyword">div</span>&gt;
    &lt;<span class="keyword">p</span>&gt;{{ progress$ | async }}%&lt;/<span class="keyword">p</span>&gt;
&lt;/<span class="keyword">div</span>&gt;</div>
            </section>

            <!-- Node.js / Express Backend -->
            <section id="nodejs" class="section">
                <h1>🟢 Node.js / Express</h1>

                <h2>Étapes d'Upload par Chunks</h2>
                <p>Votre backend doit implémenter 3 endpoints:</p>
                <ol>
                    <li><strong>/init</strong> - Initialiser la session d'upload</li>
                    <li><strong>/upload</strong> - Recevoir chaque chunk</li>
                    <li><strong>/finalize</strong> - Finaliser et assembler le fichier</li>
                </ol>

                <h2>1️⃣ Endpoint d'Initialisation</h2>
                <div class="code-label">JavaScript (Express)</div>
                <div class="code-block"><span class="keyword">const</span> express = <span class="function">require</span>(<span class="string">'express'</span>);
<span class="keyword">const</span> crypto = <span class="function">require</span>(<span class="string">'crypto'</span>);
<span class="keyword">const</span> path = <span class="function">require</span>(<span class="string">'path'</span>);
<span class="keyword">const</span> router = express.<span class="function">Router</span>();

<span class="keyword">const</span> uploads = {}; <span class="string">// Stocker les métadonnées des sessions</span>

router.<span class="function">post</span>(<span class="string">'/init'</span>, (req, res) => {
    <span class="keyword">const</span> { fileName, fileSize, fileHash, metadata } = req.body;

    <span class="string">// Validation</span>
    <span class="keyword">if</span> (!fileName || !fileSize || !fileHash) {
        <span class="keyword">return</span> res.<span class="function">status</span>(<span class="string">400</span>).<span class="function">json</span>({ 
            error: <span class="string">'Données manquantes'</span> 
        });
    }

    <span class="string">// Créer un ID unique pour cette session</span>
    <span class="keyword">const</span> mediaId = crypto.<span class="function">randomUUID</span>();
    <span class="keyword">const</span> uploadDir = path.<span class="function">join</span>(__dirname, <span class="string">'uploads'</span>, mediaId);

    <span class="string">// Sauvegarder les métadonnées</span>
    uploads[mediaId] = {
        fileName,
        fileSize,
        fileHash,
        mediaId,
        metadata,
        uploadDir,
        chunks: {},
        createdAt: <span class="keyword">new</span> <span class="function">Date</span>()
    };

    res.<span class="function">json</span>({
        success: <span class="keyword">true</span>,
        mediaId,
        message: <span class="string">'Session initialisée'</span>
    });
});</div>

                <h2>2️⃣ Endpoint de Réception des Chunks</h2>
                <div class="code-label">JavaScript (Express + Multer)</div>
                <div class="code-block"><span class="keyword">const</span> multer = <span class="function">require</span>(<span class="string">'multer'</span>);
<span class="keyword">const</span> fs = <span class="function">require</span>(<span class="string">'fs'</span>).<span class="function">promises</span>;

<span class="keyword">const</span> upload = <span class="function">multer</span>({ storage: multer.<span class="function">memoryStorage</span>() });

router.<span class="function">post</span>(<span class="string">'/upload'</span>, upload.<span class="function">single</span>(<span class="string">'chunk'</span>), <span class="keyword">async</span> (req, res) => {
    <span class="keyword">try</span> {
        <span class="keyword">const</span> { mediaId, chunkIndex, totalChunks } = req.body;
        <span class="keyword">const</span> chunkData = req.file;

        <span class="string">// Validation</span>
        <span class="keyword">if</span> (!mediaId || chunkIndex === <span class="keyword">undefined</span>) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="string">400</span>).<span class="function">json</span>({ 
                error: <span class="string">'Paramètres manquants'</span> 
            });
        }

        <span class="keyword">const</span> session = uploads[mediaId];
        <span class="keyword">if</span> (!session) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="string">404</span>).<span class="function">json</span>({ 
                error: <span class="string">'Session non trouvée'</span> 
            });
        }

        <span class="string">// Créer le répertoire d'upload si nécessaire</span>
        <span class="keyword">await</span> fs.<span class="function">mkdir</span>(session.uploadDir, { recursive: <span class="keyword">true</span> });

        <span class="string">// Sauvegarder le chunk</span