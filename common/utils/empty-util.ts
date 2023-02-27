export function isNullOrUndefined(value?: any): boolean {
    return value === undefined || value === null
}

export function isNotNullAndNotUndefined(value?: any): boolean {
    return value !== undefined && value !== null && value.trim().length !== 0
}

export function isArrayEmpty(arr?: any): boolean {
    return isNullOrUndefined(arr) || !Array.isArray(arr) || arr.length === 0
}

export function isStringEmpty(str: any): boolean {
    return typeof str === 'string' && (isNullOrUndefined(str) || str.trim().length === 0)
}

export function isObjectEmpty(obj: any = {}): boolean {
    return typeof obj === 'object' && (isNullOrUndefined(obj) || Object.keys(obj).length === 0)
}
