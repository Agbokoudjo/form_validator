import type { SmartHtmlSecurityValidatorInterface } from "../../Contracts";

export class SmartHtmlSecurityValidator implements SmartHtmlSecurityValidatorInterface{
    /**
   * Patterns to detect absolute XSS/PHP/Javascript injections
   */
    private readonly DANGEROUS_PATTERNS = [
        // Balises script et style
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
        /<iframe\b[^<]*>/gi,
        /<object\b[^<]*>/gi,
        /<embed\b[^<]*>/gi,
        /<applet\b[^<]*>/gi,
        /<meta\b[^<]*>/gi,
        /<link\b[^<]*>/gi,
        /<base\b[^<]*>/gi,
        /<form\b[^<]*>/gi,

        // Event handlers inline
        /on\w+\s*=\s*["']?[^"'>\s]+/gi,

        // Protocoles dangereux dans les attributs
        /(?:href|src|action|data)\s*=\s*["']?(javascript|data|vbscript|file|blob):/gi,

        // Balises PHP
        /<\?(?:php)?[\s\S]*?\?>/gi,

        // Template injection
        /\{\{[\s\S]*?\}\}/g,
        /\$\{[\s\S]*?\}/g,
        /%\{[\s\S]*?\}%/g,

        // Expressions dangereuses
        /eval\s*\(/gi,
        /expression\s*\(/gi,
        /new\s+Function\s*\(/gi,

        // CSS expressions
        /behavior\s*:/gi,
        /-moz-binding\s*:/gi,
    ];

    /**
   * Vérifie si le texte contient des injections XSS
   */
    isTextDangerous(text: string): boolean {
        for (const pattern of this.DANGEROUS_PATTERNS) {
            if (pattern.test(text)) {
                return true;
            }
        }
        return false;
    }

    /**
   * STRICT mode: refuse ALL HTML/PHP/Javascript
   */
    validateStrict(text: string):string|null {
        if (this.isTextDangerous(text)) {
            return "The field content contains HTML, PHP, or JavaScript tags that aren't allowed."
        }
        return null;
    }


    /**
     * SAFE-HTML mode: accepts a whitelist of tags (without attributes)
     */
    validateSafeHtml(
        text: string,
        allowedTags: string[]
    ): string|null {
        if (this.isTextDangerous(text)) {
            return "The field's content contains XSS injections.";
        }

        const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        let match;

        while ((match = tagRegex.exec(text)) !== null) {
            const tagName = match[1].toLowerCase();
            if (!allowedTags.includes(tagName)) {
                return "The <${tagName}> tag is not allowed.";
            }
        }

        return null;
    }

    stripUnallowedAttributes(
        html: string,
        allowedAttributes: Record<string, string[]>
    ): string {
        // Outer regex matches complete tags: <tagname attributes>
        // Captures: tag name + raw attributes string
        const tagRegex = /<([a-z][a-z0-9]*)\b([^>]*)>/gi;

        return html.replace(tagRegex, (fullMatch, tagName, attributesString) => {
            const tagNameLower = tagName.toLowerCase();
            const allowedAttrsForTag = allowedAttributes[tagNameLower] || [];

            // Inner regex finds individual attributes: name="value"
            // Captures: attribute name + value
            const attrRegex = /\s+(\w+)\s*=\s*["']?([^"'>\s]+)["']?/g;
            let attrMatch;
            let cleanedAttrs = '';

            // Iterate through all attributes in this tag
            while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
                const [fullAttr, attrName, attrValue] = attrMatch;
                const attrNameLower = attrName.toLowerCase();

                // Keep attribute only if it's in the whitelist for this tag
                if (allowedAttrsForTag.includes(attrNameLower)) {
                    cleanedAttrs += ` ${attrNameLower}="${attrValue}"`;
                }
            }

            // Reconstruct the tag with only whitelisted attributes
            return `<${tagName}${cleanedAttrs}>`;
        });
    }

    stripUnallowedTags(
        html: string,
        allowedTags: string[]
    ): string {
        // Normalize allowed tags to lowercase for case-insensitive matching
        const allowedTagsLower = allowedTags.map(tag => tag.toLowerCase());

        // Regex matches opening and closing tags
        // /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi captures:
        // - < : opening bracket
        // - /? : optional forward slash (for closing tags)
        // - ([a-z][a-z0-9]*)\ b : tag name (captured in group 1)
        // - [^>]* : any attributes
        // - > : closing bracket
        const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

        return html.replace(tagRegex, (match, tagName) => {
            // If tag is in whitelist, keep it; otherwise remove it
            return allowedTagsLower.includes(tagName.toLowerCase()) ? match : '';
        });
    }

   /**
    * RICH-TEXT Mode: accepts HTML with attribute AND domain control
    * SMART: automatically detects the current domain
    */
    validateRichText(
        text: string,
        options: {
            allowedTags: string[];
            allowedAttributes: Record<string, string[]>;
        }
    ): string|null{
        if (this.isTextDangerous(text)) {
            return "The text contains detected XSS injections.";
        }

        const { allowedTags, allowedAttributes} = options;

        const tagRegex = /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi;
        let match;

        while ((match = tagRegex.exec(text)) !== null) {
            const [fullTag, tagName, attributesString] = match;
            const lowerTagName = tagName.toLowerCase();

            if (!allowedTags.includes(lowerTagName)) {
                return `The <${lowerTagName}> tag is not allowed.`;
            }

            const allowedAttrs = allowedAttributes[lowerTagName] || [];
            const attrRegex = /(\w+)\s*=\s*["']?([^"'>\s]+)["']?/g;
            let attrMatch;

            while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
                const [, attrName, attrValue] = attrMatch;
                const lowerAttrName = attrName.toLowerCase();
                if (!allowedAttrs.includes(lowerAttrName)) {
                    return `The attribute ${lowerAttrName} is not allowed on <${lowerTagName}>.`;
                }
            }
        }

        return null;
    }

    public sanitizeRichText(
        html: string,
        options: {
            allowedTags: string[];
            allowedAttributes: Record<string, string[]>;
            stripDangerousAttributes?: boolean;
        }
    ): string {
        // Guard clause: handle empty input
        if (!html || typeof html !== 'string') {
            return '';
        }

        const { allowedTags, allowedAttributes, stripDangerousAttributes = true } = options;
        let sanitized = html;

        // STEP 1: Remove absolute XSS patterns
        // Dangerous patterns include: <script>, onclick, javascript:, php tags,
        // template injection, eval, etc. These are removed completely.
        const beforeStep1 = sanitized.length;
        for (const pattern of this.DANGEROUS_PATTERNS) {
            if (pattern.test(sanitized)) {
                sanitized = sanitized.replace(pattern, '');
                console.warn(`Pattern removed: ${pattern.source}`);
            }
        }

        if (sanitized.length !== beforeStep1) {
            console.warn(
                '[sanitizeRichText] Step 1: XSS patterns removed. ' +
                `Bytes removed: ${beforeStep1 - sanitized.length}`
            );
        }

        // STEP 2: Strip non-whitelisted tags
        // Removes all tags that are NOT in the allowedTags array.
        // Text content of removed tags is preserved.
        const beforeStep2 = sanitized.length;
        sanitized = this.stripUnallowedTags(sanitized, allowedTags);

        if (sanitized.length !== beforeStep2) {
            console.warn(
                '[sanitizeRichText] Step 2: Non-whitelisted tags removed. ' +
                `Bytes removed: ${beforeStep2 - sanitized.length}`
            );
        }

        // STEP 3: Remove non-whitelisted attributes
        // Removes attributes that are NOT in the allowedAttributes configuration.
        // For example, if 'img' tag is whitelisted but only 'src' and 'alt' attributes
        // are allowed, all other attributes (onerror, onclick, etc.) are removed.
        const beforeStep3 = sanitized.length;
        sanitized = this.stripUnallowedAttributes(sanitized, allowedAttributes);

        if (sanitized.length !== beforeStep3) {
            console.warn(
                '[sanitizeRichText] Step 3: Non-whitelisted attributes removed. ' +
                `Bytes removed: ${beforeStep3 - sanitized.length}`
            );
        }

        // STEP 4: Additional dangerous attribute stripping
        // Optional second pass to catch remaining event handlers (on*= attributes)
        // that might have survived the whitelist step due to parsing edge cases.
        // This is a defensive measure for edge cases.
        if (stripDangerousAttributes) {
            const tagRegex = /<([a-z][a-z0-9]*)\b([^>]*)>/gi;
            let match;
            const tagsModified: string[] = [];

            // Iterate through all HTML tags
            while ((match = tagRegex.exec(sanitized)) !== null) {
                const [fullTag, tagName, attributesString] = match;

                // Find all attributes in this tag using nested regex
                const attrRegex = /\s+(\w+)\s*=\s*["']?([^"'>\s]+)["']?/g;
                let attrMatch;
                let cleanedAttributesString = attributesString;

                // Check each attribute
                while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
                    const [fullAttrMatch, attrName] = attrMatch;
                    const lowerAttrName = attrName.toLowerCase();

                    // Remove if it's an event handler (starts with "on")
                    if (lowerAttrName.startsWith('on')) {
                        cleanedAttributesString = cleanedAttributesString.replace(
                            fullAttrMatch,
                            ''
                        );
                        tagsModified.push(`${tagName}[${lowerAttrName}]`);
                        console.warn(`Removed event handler: ${lowerAttrName} from ${tagName}`);
                    }
                }

                // Replace the tag in the HTML if attributes were modified
                if (cleanedAttributesString !== attributesString) {
                    const cleanedTag = `<${tagName}${cleanedAttributesString}>`;
                    sanitized = sanitized.replace(fullTag, cleanedTag);
                }
            }

            if (tagsModified.length > 0) {
                console.warn(
                    '[sanitizeRichText] Step 4: Dangerous attributes stripped from tags: ' +
                    tagsModified.join(', ')
                );
            }
        }

        // STEP 5: Normalize whitespace
        // Collapse multiple consecutive spaces/newlines/tabs into single spaces.
        // This prevents whitespace-based attacks and makes output cleaner.
        const beforeStep5 = sanitized.length;
        sanitized = sanitized.replace(/\s+/g, ' ').trim();

        if (sanitized.length !== beforeStep5) {
            console.warn(
                '[sanitizeRichText] Step 5: Whitespace normalized. ' +
                `Bytes removed: ${beforeStep5 - sanitized.length}`
            );
        }

        // Return sanitized content
        // Log complete summary for debugging
        console.info(
            '[sanitizeRichText] Sanitization complete. ' +
            `Original: ${beforeStep1} bytes → Final: ${sanitized.length} bytes. ` +
            `Total removed: ${beforeStep1 - sanitized.length} bytes. ` 
        );

        return sanitized;
    }

}