#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const versionFile = path.join("build", "version.json");
const indexFile = path.join("build", "index.html");

const versionDate = (date) => date.toISOString().replace(".000", "");

const commitHash = () => {
  try {
    return require("child_process")
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
  } catch {
    return "none";
  }
};

const commitDate = (hash) => {
  try {
    const unix = require("child_process")
      .execSync(`git show -s --format=%ct ${hash}`)
      .toString()
      .trim();
    const date = new Date(parseInt(unix) * 1000);
    return versionDate(date);
  } catch {
    return versionDate(new Date());
  }
};

const getFullVersion = () => {
  const hash = commitHash();
  return `${commitDate(hash)}-${hash}`;
};

const data = JSON.stringify(
  {
    version: getFullVersion(),
  },
  undefined,
  2,
);

fs.writeFileSync(versionFile, data);

// Vercel Next.js framework fallback manifests
// Prevents NEXT_NO_ROUTES_MANIFEST error if Vercel project preset is configured as Next.js
const routesManifestContent = JSON.stringify(
  {
    version: 3,
    pages404: true,
    caseSensitive: false,
    basePath: "",
    redirects: [],
    headers: [],
    dynamicRoutes: [],
    staticRoutes: [
      {
        page: "/",
        regex: "^/(?:/)?$",
        routeKeys: {},
        namedRegex: "^/(?:/)?$",
      },
    ],
    dataRoutes: [],
    rsc: {
      header: "RSC",
      varyHeader: "RSC, Next-Router-State-Tree, Next-Router-Prefetch",
    },
    rewrites: [],
  },
  undefined,
  2,
);

const prerenderManifestContent = JSON.stringify(
  {
    version: 4,
    routes: {},
    dynamicRoutes: {},
    preview: {
      previewModeId: "",
      previewModeSigningKey: "",
      previewModeEncryptionKey: "",
    },
    notFoundRoutes: [],
  },
  undefined,
  2,
);

const buildManifestContent = JSON.stringify(
  {
    polyfillFiles: [],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [],
    rootMainFiles: [],
    pages: {
      "/": [],
    },
    ampFirstPages: [],
  },
  undefined,
  2,
);

const targetDirs = [
  path.join(process.cwd(), "build"),
  path.join(__dirname, "..", "excalidraw-app", "build"),
];

for (const dir of targetDirs) {
  try {
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, "routes-manifest.json"), routesManifestContent);
      fs.writeFileSync(path.join(dir, "prerender-manifest.json"), prerenderManifestContent);
      fs.writeFileSync(path.join(dir, "build-manifest.json"), buildManifestContent);
    }
  } catch (err) {
    console.warn("Failed writing Vercel fallback manifests to", dir, err);
  }
}

// https://stackoverflow.com/a/14181136/8418
fs.readFile(indexFile, "utf8", (error, data) => {
  if (error) {
    return console.error(error);
  }
  const result = data.replace(/{version}/g, getFullVersion());

  fs.writeFile(indexFile, result, "utf8", (error) => {
    if (error) {
      return console.error(error);
    }
  });
});
