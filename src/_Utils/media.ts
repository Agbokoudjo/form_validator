export function convertOctetToGo(size_file: number): number {
    const go = size_file / (Math.pow(1024, 3));
    return parseFloat(go.toFixed(2));
}

export function convertOctetToMo(size_file: number): number {
    const mo = size_file / (Math.pow(1024, 2));
    return parseFloat(mo.toFixed(2));
}