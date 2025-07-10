/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 *
 * For more information, please feel free to contact the author.
 */

/**
11.3.  Examples

   The following addresses

             fe80::1234 (on the 1st link of the node)
             ff02::5678 (on the 5th link of the node)
             ff08::9abc (on the 10th organization of the node)

   would be represented as follows:

             fe80::1234%1
             ff02::5678%5
             ff08::9abc%10

   (Here we assume a natural translation from a zone index to the
   <zone_id> part, where the Nth zone of any scope is translated into
   "N".)

   If we use interface names as <zone_id>, those addresses could also be
   represented as follows:

            fe80::1234%ne0
            ff02::5678%pvc1.3
            ff08::9abc%interface10

   where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
   to the 5th link, and "interface10" belongs to the 10th organization.
 * * */
const IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
const IPv4AddressFormat = `(${IPv4SegmentFormat}[.]){3}${IPv4SegmentFormat}`;
const IPv4AddressRegExp = new RegExp(`^${IPv4AddressFormat}$`);

const IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})';
const IPv6AddressRegExp = new RegExp('^(' +
    `(?:${IPv6SegmentFormat}:){7}(?:${IPv6SegmentFormat}|:)|` +
    `(?:${IPv6SegmentFormat}:){6}(?:${IPv4AddressFormat}|:${IPv6SegmentFormat}|:)|` +
    `(?:${IPv6SegmentFormat}:){5}(?::${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,2}|:)|` +
    `(?:${IPv6SegmentFormat}:){4}(?:(:${IPv6SegmentFormat}){0,1}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,3}|:)|` +
    `(?:${IPv6SegmentFormat}:){3}(?:(:${IPv6SegmentFormat}){0,2}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,4}|:)|` +
    `(?:${IPv6SegmentFormat}:){2}(?:(:${IPv6SegmentFormat}){0,3}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,5}|:)|` +
    `(?:${IPv6SegmentFormat}:){1}(?:(:${IPv6SegmentFormat}){0,4}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,6}|:)|` +
    `(?::((?::${IPv6SegmentFormat}){0,5}:${IPv4AddressFormat}|(?::${IPv6SegmentFormat}){1,7}|:))` +
    ')(%[0-9a-zA-Z.]{1,})?$');

type IPVersion = 4 | 6;

export interface IPOptions {
    version?: IPVersion | string;
}

/**
 * Validates whether the given string is a valid IPv4 or IPv6 address.
 *
 * @param ipAddress - The IP address to validate.
 * @param options - Optional options object with version 4 or 6.
 * @returns True if the address is valid, false otherwise.
 * isIP('192.168.0.1');                        // true
  *  isIP('::1', { version: 6 });                // true
  *  isIP('192.168.0.1', 4);                     // true
  *  isIP('fe80::1%eth0', { version: 6 });       // true
   * isIP('123.456.789.0');                      // false
   * isIP('::1', { version: 4 });                // false

 */
export function isIP(ipAddress: string, options?: IPOptions): boolean {
    let version: string = '';

    if (typeof options === 'object' && options !== null) {
        version = options.version?.toString() || '';
    }

    if (!version) {
        return isIP(ipAddress, { version: 4 }) || isIP(ipAddress, { version: 6 });
    }

    if (version === '4') {
        return IPv4AddressRegExp.test(ipAddress);
    }

    if (version === '6') {
        return IPv6AddressRegExp.test(ipAddress);
    }

    return false;
}

const subnetMaybe = /^\d{1,3}$/;
const v4Subnet = 32;
const v6Subnet = 128;

/**
 * Validates an IP range string like "192.168.1.0/24" or "2001:db8::/64"
 * and returns structured result.
 *
 * @param str - The full IP range string (with CIDR).
 * @param version - Optional IP version (4 or 6).
 * @returns Object with validity and optional error message.
 */
/*export function isIPRange(
    str: string,
    options:IPOptions
): string |null{
    
    const parts = str.split('/');

    if (parts.length !== 2) {
        return { valid: false, error: 'Missing or extra CIDR separator (/).' };
    }

    const [ip, subnetRaw] = parts;

    if (!subnetMaybe.test(subnetRaw)) {
        return { valid: false, error: 'Subnet must be an integer between 0 and 128.' };
    }

    if (subnetRaw.length > 1 && subnetRaw.startsWith('0')) {
        return { valid: false, error: 'Subnet should not start with 0 (e.g., use "1", not "01").' };
    }

    const parsedVersion: string = version?.toString() || '';
    const isValid = isIP(ip, parsedVersion);

    if (!isValid) {
        return { valid: false, error: `Invalid IP address for version ${version || 'auto'}.` };
    }

    const subnetValue = parseInt(subnetRaw, 10);

    const expectedMax = version === 6
        ? v6Subnet
        : version === 4
            ? v4Subnet
            : isIP(ip, '6') ? v6Subnet : v4Subnet;

    if (subnetValue < 0 || subnetValue > expectedMax) {
        return {
            valid: false,
            error: `Subnet out of range for IPv${expectedMax === 32 ? '4' : '6'} (max is ${expectedMax}).`
        };
    }

    return { valid: true };
}
*/