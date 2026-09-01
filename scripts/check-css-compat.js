import doiuse from "doiuse";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";

const DIST = "dist";

/*
 * Declarations that trip a partial-support flag while falling outside what the
 * flag actually covers. Each predicate matches only the safe subset, so a value
 * the flag does cover is still reported.
 */
const SAFE = {
  /*
   * Notes 1 and 2 are the two-value `overflow` shorthand and the `clip` value.
   * Only single-value overflow declarations ship.
   */
  "css-overflow": ({ value }) =>
    !/\bclip\b/u.test(value) && value.trim().split(/\s+/u).length === 1,
};

/**
 * @param {string} dir
 * @returns {Promise<Array<string>>} every .css file below dir, recursively
 */
const cssFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return cssFiles(path);
      }
      return entry.name.endsWith(".css") ? [path] : [];
    }),
  );
  return nested.flat();
};

// Fail closed: an empty file list makes doiuse report nothing, which reads as a pass.
const files = await cssFiles(DIST).catch(() => []);
if (files.length === 0) {
  console.error(`No CSS found under ${DIST}/ - run \`npm run build\` first.`);
  process.exit(1);
}

const problems = (
  await Promise.all(
    files.map(async (file) => {
      const found = [];
      const css = await readFile(file, "utf8");
      await postcss([
        doiuse({
          onFeatureUsage: ({ feature, featureData, usage }) => {
            if (
              Object.hasOwn(SAFE, feature) &&
              usage.type === "decl" &&
              SAFE[feature](usage)
            ) {
              return;
            }
            const what =
              usage.type === "decl"
                ? `${usage.prop}: ${usage.value}`
                : `@${usage.name} ${usage.params}`;
            const { column, line } = usage.source.start;
            found.push(
              `${file}:${line}:${column}  ${what}  (${feature}: ${featureData.missing || featureData.partial})`,
            );
          },
        }),
      ]).process(css, { from: file });
      return found;
    }),
  )
).flat();

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(problem);
  }
  process.exit(1);
}
console.log(`No unsupported features in ${files.length} built CSS file(s).`);
