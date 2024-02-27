export function addQueryField(
  query: string,
  key: string,
  value: string,
): string {
  const newField = key + "=" + value;
  let newQuery = "?" + newField;

  if (query) {
    const keyRegex = new RegExp("([?&])" + key + "=[^&]*");
    if (keyRegex.exec(query) !== null) {
      newQuery = query.replace(keyRegex, "$1" + newField);
    } else {
      newQuery = query + "&" + newField;
    }
  }
  return newQuery;
}

export function getQueryField(key: string): string | undefined {
  const keyValuePair = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)").exec(
    document.location.search,
  );
  if (keyValuePair?.[2] === undefined) {
    return undefined;
  }
  return decodeURIComponent(keyValuePair[2].replace(/\+/g, " "));
}

export function removeQueryField(query: string, key: string): string {
  let newQuery = query;
  if (newQuery) {
    const keyRegex1 = new RegExp("\\?" + key + "=[^&]*");
    const keyRegex2 = new RegExp("&" + key + "=[^&]*");
    newQuery = newQuery.replace(keyRegex1, "?");
    newQuery = newQuery.replace(keyRegex2, "");
  }
  return newQuery;
}
