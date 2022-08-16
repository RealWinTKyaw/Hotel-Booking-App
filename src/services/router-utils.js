// convert search params to json
export function paramsToObj(query) {
    const result = {}
    for (const [key, value] of query) {
        result[key] = value;
    }
    return result
}