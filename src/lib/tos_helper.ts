import {isFirst} from "./utils2";

/**
 * Returns the given codes as strings and adds symbolic DSCP names that include the given codes.
 *
 * Duplicates are removed, the result is ordered lexicographically.
 */
export function dscpCodesToOptions(codes: number[]): string[] {
    return codesToOptions(codes, c => dscpOptions.get(c))
}

/**
 * Returns the given codes as strings and adds symbolic ECN names that include the given codes.
 *
 * Duplicates are removed, the result is ordered lexicographically.
 */
export function ecnCodesToOptions(codes: number[]): string[] {
    return codesToOptions(codes, c => ecnOptions.get(c))
}

const dscpOptions: Map<number, string[]> = new Map()
const ecnOptions: Map<number, string[]> = new Map()

for (let i = 0; i < 64; i++) {
    dscpOptions.set(i, [i.toString()])
}

for (let i = 0; i < 4; i++) {
    ecnOptions.set(i, [i.toString()])
}

/** Adds an option for the given code */
function addDscpOption(code: number, str: string) {
    dscpOptions.get(code).push(str)
}

/** Adds an option for the given code */
function addEcnOption(code: number, str: string) {
    ecnOptions.get(code).push(str)
}

for (let p = 0; p < 8; p++) {
    for (let i = 0; i < 4; i++) {
        addDscpOption(p * 8 + i * 2, `P${p}`)
    }
}

for (let c = 0; c < 8; c++) {
    addDscpOption(c * 8, `CS${c}`)
    if (c >= 1 && c <= 4) {
        for (let d = 1; d <= 3; d++) {
            addDscpOption(c * 8 + d * 2, `AF${c}${d}`)
        }
    }
}

addDscpOption(1, 'LE')
addDscpOption(46, 'EF')

addEcnOption(1, 'ECT')
addEcnOption(2, 'ECT')
addEcnOption(3, 'CE')

// tslint:disable-next-line:completed-docs
function codesToOptions(codes: number[], codeToOptions: (code: number) => string[]) {
    const mappedCodes = codes.map(codeToOptions)
    return [].concat(...mappedCodes).filter(isFirst).sort((a, b) => a.localeCompare(b))
}
