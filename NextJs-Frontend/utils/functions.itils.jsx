function serperateCamelCase(name) {
  return typeof name === "string"
    ? name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    : name;
}

export { serperateCamelCase };
