/**
 * Converts a template variable value into a string array of selected values.
 *
 * Multi-selection variables are supported. A multi-selection value is a string that encloses by curly braces a
 * comma separated list of values.
 *
 * The dropAll parameter determines if an empty array is returned if "all" is contained in the selected values.
 */
export function processSelectionVariable(input: string, dropAll: boolean): string[] {
    if (input) {
        if (input.startsWith('{') && input.endsWith('}')) {
            const args = input.substring(1, input.length - 1).split(',').map(s => s.trim())
            if (dropAll && args.some(s => s === 'all')) {
                return []
            } else {
                return args
            }
        } else {
            if (dropAll && input === 'all') {
                return []
            } else {
                return [input]
            }
        }
    } else {
        return []
    }
}

/** Checks if the given index is the first index of the given t. */
export function isFirst<T>(t: T, index: number, array: T[]) {
    return array.indexOf(t) === index;
}

/**
 * Converts multiple (possibly multi-selection) variables into a string array of all contained selection.
 *
 * An empty array is returned if "all" is included in any of the variables.
 * Duplicates are removed.
 */
export function processMultiSelectionVariables(input?: string[]): string[] {
    if (input) {
        const mapped = input.map(i => processSelectionVariable(i, false))
        if (mapped.some(m => m.some(s => s === 'all'))) {
            return []
        } else {
            return [].concat(...mapped).filter(isFirst)
        }
    } else {
        return []
    }
}
