import { Logger } from "./logger";
import { isIP } from "./ip";
import { isRegExp } from "./regex";
/**
 * Checks if the given host string matches any entry in the provided list.
 * Each entry can be either a string (exact match) or a RegExp (pattern match).
 *
 * @param host - The host string to test (e.g. 'example.com').
 * @param matches - An array of strings and/or RegExps to test against.
 * @returns True if a match is found, false otherwise.
 * const matches: (string | RegExp)[] = [
  'localhost',
  'admin.noldfinance.com',
  /\.example\.org$/,
];

console.log(checkHost('admin.noldfinance.com', matches)); // ✅ true
console.log(checkHost('shop.example.org', matches));      // ✅ true (regex match)
console.log(checkHost('google.com', matches));            // ❌ false

 */
export function checkHost(
    host: string,
    matches: Array<string | RegExp>
): boolean {
    for (let match of matches) {
        // 1. Vérifie si 'match' est une chaîne de caractères et correspond exactement à 'host'
        if (typeof match === 'string' && host === match) {
            return true; // Correspondance trouvée : on sort immédiatement
        }

        // 2. Vérifie si 'match' est une expression régulière et correspond à 'host'
        if (isRegExp(match) && match.test(host)) {
            return true; // Correspondance trouvée : on sort immédiatement
        }
    }

    // Si aucune correspondance n'a été trouvée après avoir parcouru tout le tableau 'matches'
    return false;
}

/**
 * 
 * @param urlparam 
 * @param addparamUrlDependencie 
 * @param returnUrl un boolean qui permet de dire que si il faut renvoyer url sous forme de chaine de caractere ou sous 
 * sous forme instance de URL par default c'est true 
 * si @default returnUrl =true on envoie sous forme de chaine de caractere sinon on envoie le nouveau URL construire sous forme
 * d'instance de URL
 * @param baseUrl 
 * @returns string |URL
 */
export function addParamToUrl(urlparam: string | URL,
    addparamUrlDependencie: Record<string, any> | null = null,
    returnUrl: boolean = true,
    baseUrl?: string | URL): string | URL {

    const url = new URL(urlparam, baseUrl || window.location.origin);

    if (addparamUrlDependencie) {

        for (const [keyparam, valueparam] of Object.entries(addparamUrlDependencie)) {
            url.searchParams.set(keyparam, valueparam);
        }
    }

    return returnUrl ? url.toString() : url;
};

/**
 * Crée une URL avec des paramètres à partir des données de formulaire.
 * 
 * @param formData - L'élément de formulaire dont les données sont extraites.
 * @param form_action -Url relative pour laquelle les paramètres doivent être ajoutés
 * @param baseUrl - L'URL de base pour laquelle les paramètres doivent être ajoutés.
 * @param returnUrl - Si vrai, retourne une chaîne de caractères représentant l'URL, sinon retourne une instance de URL.
 * @returns string Une chaîne de caractères ou une instance de URL avec les paramètres ajoutés.
 */
export function buildUrlFromForm(
    formData: FormData,
    form_action: string,
    addparamUrlDependencie?: Record<string, any>,
    returnUrl: boolean = true,
    baseUrl?: string | URL
): string | URL {

    const searchParamsInstance = new URLSearchParams();

    formData.forEach((value, key) => {
        searchParamsInstance.append(key, value.toString());
    });

    const url = new URL(form_action, baseUrl);
    // Ajouter les paramètres au URL
    searchParamsInstance.forEach((value, key) => {
        url.searchParams.set(key, value);
    });

    const urlWithAddedParams = addParamToUrl(url, addparamUrlDependencie, returnUrl, baseUrl);

    return returnUrl ? urlWithAddedParams.toString() : urlWithAddedParams;
}

export class CustomURLSearchParams {
    private readonly __params: Map<string, string[]>;
    private readonly __query: string;

    constructor(query: string = '') {

        this.__params = new Map<string, string[]>();

        this.__query = query.startsWith('?') ? query.slice(1) : query;

        this.normalizedURLSearchParams();
    }

    private normalizedURLSearchParams(): void {
        if (this.__query.length === 0) return;

        const pairs = this.__query.split('&').filter(Boolean);

        for (const pair of pairs) {
            const [rawKey, rawValue] = pair.split('=');
            const key = decodeURIComponent(rawKey || '');
            const value = decodeURIComponent(rawValue || '');
            this.append(key, value); // append pour gérer les doublons
        }
    }

    /**
     * Appends a new value to the list of values for a key
     */
    public append(key: string, value: string): void {
        if (!this.__params.has(key)) {
            this.__params.set(key, []);
        }
        this.__params.get(key)!.push(value);
    }

    /**
     * Sets a single value for a key (replaces existing)
     */
    public set(key: string, value: string): void {
        this.__params.set(key, [value]);
    }

    /**
     * Gets all values for a given key
     */
    public get(key: string): string[] {
        return this.__params.get(key) ?? [];
    }

    /**
     * Gets only the first value (like native URLSearchParams.get)
     */
    public getFirst(key: string): string | null {
        const values = this.__params.get(key);

        return values && values.length ? values[0] : null;
    }

    /**
     * Checks if a key exists
     */
    public has(key: string): boolean { return this.__params.has(key); }

    /**
     * Deletes a key and its values
     */
    public delete(key: string): void { this.__params.delete(key); }

    /**
     * Returns all key-values as an object: { key: string[] }
     */
    public getAll(): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        for (const [key, values] of this.__params.entries()) {
            result[key] = [...values];
        }
        return result;
    }

    /**
     * Converts the full params to a query string
     */
    public toString(): string {
        const entries: string[] = [];

        for (const [key, values] of this.__params.entries()) {

            for (const value of values) {
                entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
        return entries.join('&');
    }

    /**
     * Static helper to build from object
     */
    public static fromObject(obj: Record<string, string | string[]>): CustomURLSearchParams {
        const params = new CustomURLSearchParams();
        for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value)) {
                for (const v of value) {
                    params.append(key, v);
                }
            } else {
                params.set(key, value);
            }
        }
        return params;
    }
    /**
     * Fusionne un autre objet CustomURLSearchParams dans celui-ci.
     * Ne remplace pas les valeurs existantes, les ajoute (append).
     */
    public merge(other: CustomURLSearchParams): void {
        for (const [key, values] of other.__params.entries()) {
            for (const value of values) {
                this.append(key, value);
            }
        }
    }
    /**
 * Crée une copie indépendante des paramètres
 */
    public clone(): CustomURLSearchParams {
        const clone = new CustomURLSearchParams();
        for (const [key, values] of this.__params.entries()) {
            for (const value of values) {
                clone.append(key, value);
            }
        }
        return clone;
    }
    /**
 * Trie les paramètres par ordre alphabétique des clés (comme l'API native).
 */
    public sort(): void {
        const sorted = new Map<string, string[]>(
            Array.from(this.__params.entries()).sort(([keyA], [keyB]) => {
                return keyA.localeCompare(keyB);
            })
        );
        this.__params.clear();
        for (const [key, values] of sorted.entries()) {
            this.__params.set(key, values);
        }
    }
}

export class CustomURL {
    private readonly __url: URL | undefined = undefined;
    private __protocol: string;
    private __username: string;
    private __password: string;
    private __hostname: string;
    private __port: string;
    private __pathname: string;
    private __search: string;
    private __hash: string;
    private __isValid: boolean;

    constructor(private readonly url: string) {

        if (this.isNativeURLSupported()) {
            try {
                this.__url = new URL(this.url);
            } catch (error) {
                Logger.error('cutomURL Error', error);
            }
        }
        this.__protocol = "";
        this.__hash = "";
        this.__hostname = "";
        this.__isValid = false;
        this.__password = '';
        this.__port = "";
        this.__pathname = "";
        this.__search = "";
        this.__username = "";
        this.normalizedURL();
    }

    private normalizedURL(): this {
        try {
            let url = this.url.trim(); //https://developer.mozilla.org/en-US/docs/Web/API/URL/href#examples
            // 1. Extraire hash
            const hashIndex = url.indexOf('#');
            if (hashIndex !== -1) {
                this.__hash = url.slice(hashIndex);
                url = url.slice(0, hashIndex);//console.log(this.hash); // '#examples'
            }
            // 2. Extraire search
            const queryIndex = url.indexOf('?'); //https://developer.mozilla.org/en-US/docs/Web/API/URL/search?q=123
            if (queryIndex !== -1) {
                this.__search = url.slice(queryIndex); //console.log(this.search); // Logs "?q=123"
                url = url.slice(0, queryIndex);
            }
            // 3. Extraire le protocole ;https://developer.mozilla.org/en-US/docs/Web/API/URL/protocol
            const protoMatch = url.match(/^([a-zA-Z][a-zA-Z\d+\-.]*):\/\//);
            if (protoMatch) {
                this.__protocol = protoMatch[1].toLowerCase() + ":"; // console.log(this.protocol); // Logs "https:"
                url = url.slice(protoMatch[0].length);// remove protocol and "//" console.log(url) developer.mozilla.org/en-US/docs/Web/API/URL/protocol
            }
            // 4. Extraire auth (user:pass@)
            const authIndex = url.indexOf('@'); //https://anonymous:flabada@developer.mozilla.org/en-US/docs/Web/API/URL/password
            if (authIndex !== -1) {
                const authPart = url.slice(0, authIndex);
                const [user, pass] = authPart.split(':');
                this.__username = decodeURIComponent(user || '');
                this.__password = decodeURIComponent(pass || '');
                url = url.slice(authIndex + 1);
            }
            //5. Extraire pathname
            const pathnameIndex = url.indexOf('/');
            if (pathnameIndex !== -1) {
                this.__pathname = url.slice(pathnameIndex);
                url = url.slice(0, pathnameIndex);
            } else { this.__pathname = "/"; }
            // 6. Extraire hostname + port
            let is_ip = false;
            // IPv6 encadré (ex: [::1]:8080)
            const ipv6_match = url.match(/^\[([^\]]+)\](?::([0-9]+))?$/);
            if (ipv6_match && isIP(ipv6_match[1], { version: 6 })) {
                this.__hostname = ipv6_match[1];
                this.__port = ipv6_match[2] || '';
                is_ip = true;
            }

            // IPv4 classique avec port (ex: 192.168.0.1:8080)
            const ipv4_match = url.match(/^((?:\d{1,3}\.){3}\d{1,3})(?::([0-9]+))?$/);
            if (!is_ip && ipv4_match && isIP(ipv4_match[1], { version: 4 })) {
                this.__hostname = ipv4_match[1];
                this.__port = ipv4_match[2] || '';
                is_ip = true;
            }
            if (!is_ip) {
                const [hostname, port] = url.split(':');
                this.__hostname = hostname;
                this.__port = port || '';

            }
            this.__isValid = true
        } catch (error) {
            this.__isValid = false;
            Logger.error('error CustomURL', error);
        }
        return this;
    }

    public get hash(): string {
        if (this.urlHasFeature('hash') && this.__url) { return this.__url.hash; }
        return this.__hash;
    }

    public get search(): string {
        if (this.urlHasFeature('search') && this.__url) { return this.__url.search; }
        return this.__search;
    }
    public get protocol(): string {
        if (this.urlHasFeature('protocol') && this.__url) { return this.__url.protocol; }
        return this.__protocol;
    }
    public get username(): string {
        if (this.urlHasFeature('username') && this.__url) { return this.__url.username; }
        return this.__username;
    }
    public get password(): string {
        if (this.urlHasFeature('password') && this.__url) { return this.__url.password; }
        return this.__password;
    }

    public get pathname(): string {
        if (this.urlHasFeature('pathname') && this.__url) { return this.__url.pathname; }
        return this.__pathname;
    }

    public get hostname(): string {
        if (this.urlHasFeature('hostname') && this.__url) { return this.__url.hostname; }
        return this.__hostname;
    }

    public get port(): string {
        if (this.urlHasFeature('port') && this.__url) { return this.__url.port; }
        return this.__port;
    }

    public get auth(): string {
        if (!this.username && !this.password) return '';
        return `${this.username}:${this.password}@`;
    }

    public get host(): string { return this.hostname + (this.port ? `:${this.port}` : ''); }

    public get origin(): string { return `${this.protocol}//${this.host}`; }

    public get href(): string {
        return `${this.protocol}//${this.auth}${this.host}${this.pathname}${this.search}${this.hash}`;
    }

    public get isValid(): boolean { return this.__isValid; }

    public get urlObject(): URL | undefined { return this.__url }

    public toJSON(): Record<string, string> {
        return {
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            hash: this.hash,
            host: this.host,
            origin: this.origin,
            href: this.href,
        };
    }

    public get searchParams(): CustomURLSearchParams {
        return new CustomURLSearchParams(this.search);
    }

    /**
     * Vérifie si l'objet global URL est bien supporté et instanciable.
     */
    public isNativeURLSupported(): boolean {
        try {
            if (typeof URL === 'undefined') return false;
            const test = new URL("https://www.google.com/");
            return typeof test.hostname === 'string';
        } catch (e) {
            return false;
        }
    }

    /**
 * Vérifie si une propriété spécifique existe dans URL.prototype
 * @param feature Le nom de la propriété à tester (ex: "hostname", "href", etc.)
 */
    public urlHasFeature(feature: keyof URL): boolean {
        if (!this.__url) return false;

        return feature in URL.prototype;
    }
}