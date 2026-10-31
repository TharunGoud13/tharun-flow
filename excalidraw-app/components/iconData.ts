export interface IconDef {
  id: string;
  title: string;
  category: "cloud" | "tech" | "database" | "architecture";
  tags: string[];
  color: string;
  kind: "svg" | "lucide";
  rawPath?: string;
  lucideName?: string;
  getSvg: (size?: number, color?: string) => string;
}

const AWS_PATH =
  "M18.784 14.73c-.27-.2-.59-.3-.95-.3-.49 0-.93.18-1.32.55-.39.37-.59.81-.59 1.32 0 .47.19.89.57 1.25.38.36.83.54 1.34.54.34 0 .65-.09.95-.27.3-.18.53-.41.71-.7v-2.39zm2.46 3.96c-.35.41-.78.73-1.29.96-.51.23-1.07.35-1.68.35-.91 0-1.7-.27-2.37-.81-.67-.54-1-1.25-1-2.13 0-.92.34-1.68 1.02-2.28.68-.6 1.54-.9 2.58-.9.6 0 1.13.1 1.59.3v-1.12c0-.7-.19-1.23-.57-1.59-.38-.36-.93-.54-1.65-.54-.53 0-1.02.1-1.47.3-.45.2-.84.47-1.17.81l-1.05-1.35c.5-.5 1.1-.88 1.8-1.14.7-.26 1.47-.39 2.31-.39 1.34 0 2.36.33 3.06.99.7.66 1.05 1.63 1.05 2.91v5.85h-1.73l-.06-.95zm-9.39-.24c-.38.41-.83.73-1.35.96-.52.23-1.09.35-1.71.35-1.01 0-1.84-.29-2.49-.87-.65-.58-.98-1.36-.98-2.34 0-.96.34-1.73 1.02-2.31.68-.58 1.56-.87 2.64-.87.57 0 1.08.09 1.53.27v-1.05c0-.66-.18-1.15-.54-1.47-.36-.32-.88-.48-1.56-.48-.48 0-.93.09-1.35.27-.42.18-.78.43-1.08.75l-1.08-1.32c.48-.48 1.06-.85 1.74-1.11.68-.26 1.44-.39 2.28-.39 1.28 0 2.25.32 2.91.96.66.64.99 1.57.99 2.79v5.97h-1.77l-.06-.9zm-1.89-2.91c-.48 0-.91.17-1.29.51-.38.34-.57.77-.57 1.29 0 .46.18.86.54 1.2.36.34.79.51 1.29.51.36 0 .69-.09.99-.27.3-.18.54-.42.72-.72v-2.25c-.5-.18-1.06-.27-1.68-.27zm19.38 5.7c-5.85 4.32-14.34 6.6-21.6 3.63-1.02-.42-1.98-.93-2.88-1.53-.27-.18-.33-.51-.12-.75.21-.24.54-.27.81-.12.84.51 1.74.96 2.7 1.35 6.75 2.7 14.67.66 20.19-3.36.42-.3.81.18.9.78zm1.05-1.29c-.75-.96-2.49-1.14-3.48-1.02-.3.03-.36-.33-.09-.51 1.77-1.17 4.56-.42 5.07 1.08.21.63-.51 1.26-1.5 2.04-.24.18-.54.06-.48-.21.21-.63.78-1.08.48-1.38z";

const AZURE_PATH =
  "M13.005 0 2.28 17.59h6.812l4.46-7.391 2.95 7.391H24L13.005 0zm-.92 11.233-2.8 4.636h5.602l-2.802-4.636z";

const BRAND_PATHS: Record<string, { title: string; hex: string; path: string }> = {
  gcp: {
    title: "Google Cloud",
    hex: "#4285F4",
    path: "M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z",
  },
  docker: {
    title: "Docker",
    hex: "#2496ED",
    path: "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z",
  },
  k8s: {
    title: "Kubernetes",
    hex: "#326CE5",
    path: "M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.779zm1.5-3.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594l-9.261.003a1.6 1.6 0 0 1-1.247-.596l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L2.1 5.573c.108-.47.425-.864.863-1.073L11.305.513a1.606 1.606 0 0 1 1.385 0l8.345 3.985c.438.209.755.604.863 1.073l2.062 8.955c.108.47-.005.963-.308 1.34z",
  },
  cloudflare: {
    title: "Cloudflare",
    hex: "#F38020",
    path: "M18.423 14.54a2.912 2.912 0 0 0-.256-.011c-.551 0-1.047.218-1.428.56-.232-.733-.872-1.282-1.66-1.345-.194-.016-.388.008-.57.062a2.316 2.316 0 0 0-.847-1.408c-.482-.381-1.104-.572-1.748-.528a2.535 2.535 0 0 0-2.316 1.76c-.237-.091-.5-.138-.773-.13-.733.023-1.393.434-1.748 1.06-.217-.071-.453-.105-.697-.093-.728.034-1.353.486-1.637 1.134a1.733 1.733 0 0 0-.613-.112c-.93 0-1.688.75-1.688 1.674 0 .093.008.183.024.271H19.78c.038-.13.06-.267.06-.41 0-1.368-1.085-2.484-2.417-2.484zm-4.148-3.08c-.02-.128-.035-.258-.035-.39 0-1.854 1.503-3.357 3.357-3.357 1.364 0 2.54.814 3.062 1.986.326-.145.688-.226 1.069-.226 1.488 0 2.694 1.206 2.694 2.694 0 .14-.011.277-.031.411A3.75 3.75 0 0 1 24 16.275c0 2.057-1.668 3.725-3.725 3.725H8.384A4.384 4.384 0 0 1 4 15.616c0-2.115 1.5-3.882 3.504-4.288A5.02 5.02 0 0 1 12.38 6.5a4.988 4.988 0 0 1 1.895.36z",
  },
  terraform: {
    title: "Terraform",
    hex: "#844FBA",
    path: "M1.44 0v7.575l6.561 3.79V3.787zm7.2 4.155v7.574l6.563 3.792V7.946zm7.2 4.15v7.574l6.563 3.792V12.1zm-7.2 4.15v7.574l6.563 3.79v-7.574z",
  },
  vercel: {
    title: "Vercel",
    hex: "#000000",
    path: "M24 22.525H0l12-21.05 12 21.05z",
  },
  netlify: {
    title: "Netlify",
    hex: "#00C7B7",
    path: "M6.49 13.92h-.03l-3.39-3.39 3.42-3.42 2.87 2.87-2.87 2.87v1.07zm11.02-3.89l-3.42-3.42 3.39-3.39h.03v6.81zm-4.54-4.54l-2.47-2.47 2.47-2.47 2.47 2.47-2.47 2.47zm0 17.02l-2.47-2.47 2.47-2.47 2.47 2.47-2.47 2.47z",
  },
  digitalocean: {
    title: "DigitalOcean",
    hex: "#0080FF",
    path: "M12.04 0C5.408 0 .04 5.369.04 12.002h4.004c0-4.417 3.582-7.998 8-7.998 4.418 0 8 3.581 8 7.998 0 4.417-3.582 8-8 8v4c6.633 0 12-5.37 12-12.002C24.044 5.37 18.673 0 12.04 0zm0 16.002c-2.21 0-4-1.79-4-4h-4c0 4.418 3.582 8 8 8v-4z",
  },
  linux: {
    title: "Linux",
    hex: "#FCC624",
    path: "M12.77 0c-.37 0-.74.03-1.1.09-3.39.58-4.22 3.54-4.08 6.13.04.7.15 1.45.32 2.19-1.2.62-2.3 1.54-3.15 2.76-1.57 2.25-1.92 5.12-.99 7.69.75 2.06 2.37 3.65 4.35 4.31 1.25.42 2.58.6 3.88.54 1.3.06 2.63-.12 3.88-.54 1.98-.66 3.6-2.25 4.35-4.31.93-2.57.58-5.44-.99-7.69-.85-1.22-1.95-2.14-3.15-2.76.17-.74.28-1.49.32-2.19.14-2.59-.69-5.55-4.08-6.13-.36-.06-.73-.09-1.1-.09z",
  },
  nginx: {
    title: "NGINX",
    hex: "#009639",
    path: "M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm0 2.268l8.429 4.867v9.73L12 21.732l-8.429-4.867v-9.73L12 2.268zM7.5 7.5v9h2.25V12l4.5 4.5h2.25v-9h-2.25V12L9.75 7.5H7.5z",
  },
  github: {
    title: "GitHub",
    hex: "#181717",
    path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z",
  },
  react: {
    title: "React",
    hex: "#61DAFB",
    path: "M14.232 10.957c-.244-.244-.542-.447-.882-.601.597-.68 1.107-1.493 1.503-2.408 1.157 1.01 1.865 2.146 1.968 3.21-.689.043-1.554.004-2.589-.201zm-4.464 2.086c.244.244.542.447.882.601-.597.68-1.107 1.493-1.503 2.408-1.157-1.01-1.865-2.146-1.968-3.21.689-.043 1.554-.004 2.589.201zm4.184.601c.34-.154.638-.357.882-.601 1.035.205 1.9.244 2.589.201-.103 1.064-.811 2.2-1.968 3.21-.396-.915-.906-1.728-1.503-2.408zm-3.904-3.288c-.34.154-.638.357-.882.601-1.035-.205-1.9-.244-2.589-.201.103-1.064.811-2.2 1.968-3.21.396.915.906 1.728 1.503 2.408zM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0-13.5C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z",
  },
  nextjs: {
    title: "Next.js",
    hex: "#000000",
    path: "M18.665 21.978a12 12 0 1 1 3.326-3.326l-8.216-10.63H11.5v8.136h1.375V9.923l7.29 9.429a11.96 11.96 0 0 1-1.5 2.626zm-7.165-15.8h1.375v4.577h-1.375V6.178z",
  },
  nodejs: {
    title: "Node.js",
    hex: "#5FA04E",
    path: "M12 0L1.75 5.92v12.16L12 24l10.25-5.92V5.92L12 0zm0 2.37l8.2 4.73v9.8L12 21.63 3.8 16.9V7.1L12 2.37zm-2.46 6.32a.9.9 0 0 0-.45.13L6.8 10.15a.9.9 0 0 0-.45.78v4.14a.9.9 0 0 0 .45.78l2.29 1.33a.9.9 0 0 0 .9 0l2.29-1.33a.9.9 0 0 0 .45-.78v-4.14a.9.9 0 0 0-.45-.78L10 8.82a.9.9 0 0 0-.46-.13z",
  },
  typescript: {
    title: "TypeScript",
    hex: "#3178C6",
    path: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm9.957 7.785h3.31v1.657h-1.848v6.773h-1.462v-6.773zm4.568 0h3.297c1.375 0 2.227.766 2.227 1.957 0 1.05-.724 1.705-1.785 1.87v.034c1.192.176 1.986.877 1.986 2.052 0 1.348-.99 2.197-2.49 2.197h-3.235V7.785zm1.462 1.326v1.92h1.69c.642 0 1.033-.37 1.033-.96 0-.585-.39-.96-1.033-.96h-1.69zm0 3.208v2.177h1.794c.732 0 1.17-.39 1.17-1.088 0-.698-.438-1.089-1.17-1.089h-1.794z",
  },
  javascript: {
    title: "JavaScript",
    hex: "#F7DF1E",
    path: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.017-.835-1.879-2.604-2.555l-.579-.232c-.967-.416-1.397-.732-1.397-1.343 0-.68.513-1.147 1.343-1.147.813 0 1.258.375 1.488.941l1.7-.984c-.459-1.137-1.465-1.776-2.997-1.776-1.832 0-3.155 1.11-3.155 2.876 0 1.545.927 2.378 2.457 2.993l.582.233c1.077.447 1.546.852 1.546 1.545 0 .822-.68 1.332-1.688 1.332-1.173 0-1.815-.597-2.148-1.365l-1.745.987c.563 1.29 1.71 2.222 3.69 2.222 2.31 0 3.633-1.305 3.633-3.255zm-7.668-7.076h-2.115v6.945c0 1.378-.669 1.796-1.688 1.796-.582 0-.98-.075-1.282-.18v-1.71c.218.06.495.09.735.09.435 0 .69-.21.69-.765V11.2h-1.92V9.3h5.58v1.9z",
  },
  python: {
    title: "Python",
    hex: "#3776AB",
    path: "M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.75h5.808v.825H3.88s-3.88.44-3.88 6.208c0 5.767 3.39 5.56 3.39 5.56h2.022v-2.834s-.11-3.39 3.333-3.39h5.753v-.853h.003V5.197S14.975 0 11.914 0zm-2.02 1.48a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zm2.192 9.072v.852h.003v5.727s-.468 5.198 2.593 5.198c6.095 0 5.714-2.656 5.714-2.656l-.006-2.75h-5.808v-.825h8.134s3.88-.44 3.88-6.208c0-5.767-3.39-5.56-3.39-5.56h-2.022v2.834s.11 3.39-3.333 3.39H12.086zm4.212 10.428a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z",
  },
  go: {
    title: "Go (Golang)",
    hex: "#00ADD8",
    path: "M1.984 8.794h2.247c-.206.84-.44 1.637-.732 2.378H1.252a1.25 1.25 0 0 1-.954-.446 1.25 1.25 0 0 1-.298-1.025 1.25 1.25 0 0 1 .536-.853c.4-.298.92-.454 1.448-.454zm12.544-6.398c2.973 0 5.16 1.01 6.56 3.03l-2.66 2.07c-.98-1.42-2.31-2.13-3.99-2.13-1.63 0-2.98.63-4.05 1.89-1.07 1.26-1.6 2.89-1.6 4.89s.53 3.63 1.6 4.89c1.07 1.26 2.42 1.89 4.05 1.89 1.76 0 3.16-.76 4.2-2.28v-2.34h-4.3v-2.7h7.2v6.69c-1.87 2.38-4.24 3.57-7.1 3.57-2.69 0-4.9-.96-6.63-2.88-1.73-1.92-2.6-4.32-2.6-7.2s.87-5.28 2.6-7.2c1.73-1.92 3.94-2.88 6.63-2.88z",
  },
  rust: {
    title: "Rust",
    hex: "#000000",
    path: "M23.833 13.573a6.85 6.85 0 0 0-.27-1.78l1.3-1.255a.8.8 0 0 0 .17-.89l-.91-1.82a.8.8 0 0 0-.75-.46l-1.8.12a6.85 6.85 0 0 0-1.19-1.35l.65-1.68a.8.8 0 0 0-.25-.87l-1.63-1.22a.8.8 0 0 0-.88-.07l-1.54.94a6.85 6.85 0 0 0-1.72-.63l-.12-1.8a.8.8 0 0 0-.67-.74l-2.01-.27a.8.8 0 0 0-.85.45l-.83 1.61a6.85 6.85 0 0 0-1.8.27l-.83-1.61a.8.8 0 0 0-.85-.45l-2.01.27a.8.8 0 0 0-.67.74l-.12 1.8a6.85 6.85 0 0 0-1.72.63l-1.54-.94a.8.8 0 0 0-.88.07l-1.63 1.22a.8.8 0 0 0-.25.87l.65 1.68a6.85 6.85 0 0 0-1.19 1.35l-1.8-.12a.8.8 0 0 0-.75.46l-.91 1.82a.8.8 0 0 0 .17.89l1.3 1.255a6.85 6.85 0 0 0-.27 1.78l-1.76.4a.8.8 0 0 0-.6.79v2.04c0 .38.25.71.6.79l1.76.4c.04.61.13 1.21.27 1.78l-1.3 1.255a.8.8 0 0 0-.17.89l.91 1.82c.18.35.54.54.75.46l1.8-.12c.36.49.76.94 1.19 1.35l-.65 1.68a.8.8 0 0 0 .25.87l1.63 1.22c.28.21.65.23.88.07l1.54-.94c.54.27 1.12.48 1.72.63l.12 1.8c.03.4.31.72.67.74l2.01.27c.4.05.78-.17.85-.45l.83-1.61c.59.12 1.19.21 1.8.27l.83 1.61c.07.28.45.5.85.45l2.01-.27c.36-.02.64-.34.67-.74l.12-1.8c.6-.15 1.18-.36 1.72-.63l1.54.94c.23.16.6.14.88-.07l1.63-1.22a.8.8 0 0 0 .25-.87l-.65-1.68c.43-.41.83-.86 1.19-1.35l1.8.12c.21.08.57-.11.75-.46l.91-1.82a.8.8 0 0 0-.17-.89l-1.3-1.255c.14-.57.23-1.17.27-1.78l1.76-.4c.35-.08.6-.41.6-.79v-2.04a.8.8 0 0 0-.6-.79l-1.76-.4z",
  },
  graphql: {
    title: "GraphQL",
    hex: "#E10098",
    path: "M12 0l10.392 6v12L12 24 1.608 18V6L12 0zm0 2.215L3.526 7.108v9.784L12 21.785l8.474-4.893V7.108L12 2.215zm0 2.769l6.074 3.507v7.016L12 19.015l-6.074-3.508V8.491L12 4.984zm0 2.493L7.737 9.87v4.26L12 16.523l4.263-2.393V9.87L12 7.477z",
  },
  tailwindcss: {
    title: "Tailwind CSS",
    hex: "#06B6D4",
    path: "M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z",
  },
  firebase: {
    title: "Firebase",
    hex: "#DD2C00",
    path: "M3.89 15.672L6.255.461A.542.542 0 0 1 7.27.287l3.543 6.643-6.923 8.742zm15.797 4.195l-1.92-11.895a.542.542 0 0 0-.91-.293L3.54 20.315l7.652 4.305a1.55 1.55 0 0 0 1.517 0l7.978-4.753zM14.07 7.784l-2.186-4.184a.542.542 0 0 0-.962 0l-8.5 16.038 11.648-11.854z",
  },
  supabase: {
    title: "Supabase",
    hex: "#3FCF8E",
    path: "M21.362 9.354H12V.316a.316.316 0 0 0-.555-.205L.806 13.064a.632.632 0 0 0 .473 1.054H12v9.566c0 .265.305.412.515.25L23.155 10.45a.632.632 0 0 0-.431-1.096h-1.362z",
  },
  postgresql: {
    title: "PostgreSQL",
    hex: "#4169E1",
    path: "M11.969 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.969 0zm.031 2.4a9.6 9.6 0 0 1 9.6 9.6 9.6 9.6 0 0 1-9.6 9.6 9.6 9.6 0 0 1-9.6-9.6 9.6 9.6 0 0 1 9.6-9.6zM8.4 6v12h2.4v-4.8h2.4a3.6 3.6 0 1 0 0-7.2H8.4zm2.4 2.4h2.4a1.2 1.2 0 1 1 0 2.4h-2.4V8.4z",
  },
  mysql: {
    title: "MySQL",
    hex: "#4479A1",
    path: "M18.847 8.795c-.381-.03-2.02.138-3.082 1.272-1.062 1.134-1.258 2.502-1.258 3.551 0 1.049.255 2.148 1.133 3.037.878.889 2.052 1.01 3.207 1.01 1.155 0 2.487-.272 3.149-.894v-7.976h-3.149zm-8.84 0c-.381-.03-2.02.138-3.082 1.272-1.062 1.134-1.258 2.502-1.258 3.551 0 1.049.255 2.148 1.133 3.037.878.889 2.052 1.01 3.207 1.01 1.155 0 2.487-.272 3.149-.894v-7.976H10.007z",
  },
  redis: {
    title: "Redis",
    hex: "#FF4438",
    path: "M11.999 0L.987 5.766v12.468L11.999 24l11.014-5.766V5.766L11.999 0zm0 2.766l8.32 4.358-3.235 1.694-8.32-4.358 3.235-1.694zm-1.898 3.492l8.32 4.358-3.235 1.694-8.32-4.358 3.235-1.694z",
  },
  mongodb: {
    title: "MongoDB",
    hex: "#47A248",
    path: "M11.91 0C11.91 0 5.498 7.357 5.498 12.8c0 4.14 2.872 7.74 6.412 8.115.405-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c0-5.443-4.489-11.758-4.489-11.758zm-.358 20.915s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z",
  },
  sqlite: {
    title: "SQLite",
    hex: "#003B57",
    path: "M21.678.521c-1.032-.92-2.28-.55-3.513.544a8.71 8.71 0 0 0-.547.535c-2.109 2.237-4.066 6.38-4.674 9.544.237.48.422 1.093.544 1.561a13.044 13.044 0 0 1 .164.703s-.019-.071-.096-.296l-.05-.146a1.689 1.689 0 0 0-.033-.08c-.138-.32-.518-.995-.686-1.289-.143.423-.27.818-.376 1.176.484.884.778 2.4.778 2.4s-.025-.099-.147-.442c-.107-.303-.644-1.244-.772-1.464-.217.804-.304 1.346-.226 1.478.152.256.296.698.422 1.186.286 1.1.485 2.44.485 2.44l.017.224a22.41 22.41 0 0 0 .056 2.748c.095 1.146.273 2.13.5 2.657l.155-.084c-.334-1.038-.47-2.399-.41-3.967.09-2.398.642-5.29 1.661-8.304 1.723-4.55 4.113-8.201 6.3-9.945-1.993 1.8-4.692 7.63-5.5 9.788-.904 2.416-1.545 4.684-1.931 6.857.666-2.037 2.821-2.912 2.821-2.912s1.057-1.304 2.292-3.166c-.74.169-1.955.458-2.362.629-.6.251-.762.337-.762.337s1.945-1.184 3.613-1.72C21.695 7.9 24.195 2.767 21.678.521z",
  },
  elasticsearch: {
    title: "Elasticsearch",
    hex: "#005571",
    path: "M13.394 0C8.683 0 4.609 2.716 2.644 6.667h15.641a4.77 4.77 0 0 0 3.073-1.11c.446-.375.864-.785 1.247-1.243l.001-.002A11.974 11.974 0 0 0 13.394 0zM1.804 8.889a12.009 12.009 0 0 0 0 6.222h14.7a3.111 3.111 0 1 0 0-6.222zm.84 8.444C4.61 21.283 8.684 24 13.395 24c3.701 0 7.011-1.677 9.212-4.312l-.001-.002a9.958 9.958 0 0 0-1.247-1.243 4.77 4.77 0 0 0-3.073-1.11z",
  },
  kafka: {
    title: "Apache Kafka",
    hex: "#231F20",
    path: "M9.71 2.136a1.43 1.43 0 0 0-2.047 0h-.007a1.48 1.48 0 0 0-.421 1.042c0 .41.161.777.422 1.039l.007.007c.257.264.616.426 1.019.426.404 0 .766-.162 1.027-.426l.003-.007c.261-.262.421-.629.421-1.039 0-.408-.159-.777-.421-1.042H9.71zM8.683 22.295c.404 0 .766-.167 1.027-.429l.003-.008c.261-.261.421-.631.421-1.036 0-.41-.159-.778-.421-1.044H9.71a1.42 1.42 0 0 0-1.027-.432 1.4 1.4 0 0 0-1.02.432h-.007c-.26.266-.422.634-.422 1.044 0 .406.161.775.422 1.036l.007.008c.258.262.617.429 1.02.429z",
  },
};

const createSvgIcon = (
  id: string,
  title: string,
  category: IconDef["category"],
  tags: string[],
  color: string,
  path: string,
): IconDef => ({
  id,
  title,
  category,
  tags,
  color,
  kind: "svg",
  rawPath: path,
  getSvg: (size = 64, c = color) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${c}"><path d="${path}"/></svg>`,
});

const LUCIDE_PATH_MAP: Record<string, string> = {
  Server:
    '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
  Database:
    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  Cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/><path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/><path d="M20 12h2"/><path d="M20 17h2"/><path d="M20 7h2"/><path d="M7 20v2"/><path d="M7 2v2"/>',
  Cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  Network:
    '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  HardDrive:
    '<line x1="12" y1="12" x2="12.01" y2="12"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 14v-4a6 6 0 0 1 12 0v4"/>',
  Shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  ShieldCheck:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  Smartphone:
    '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  Laptop:
    '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  Monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  Globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  Terminal:
    '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  Key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  Webhook:
    '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06l3.19 5.89c.56 1.05 1.77 1.58 2.87 1.25a4 4 0 0 1 2.37 5.75l-.02.04"/>',
  Boxes:
    '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
  Box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  Layers:
    '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  Activity:
    '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  Gauge:
    '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  Users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  MessageSquare:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  GitBranch:
    '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  GitCommit:
    '<circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/>',
  Repeat:
    '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
};

const createLucideIcon = (
  id: string,
  title: string,
  tags: string[],
  lucideName: string,
  color = "#495057",
): IconDef => {
  const innerSvg = LUCIDE_PATH_MAP[lucideName] || "";

  return {
    id,
    title,
    category: "architecture",
    tags,
    color,
    kind: "lucide",
    lucideName,
    getSvg: (size = 64, strokeColor = color) =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>`,
  };
};

export const ALL_ICONS: IconDef[] = [
  // 1. Cloud & DevOps
  createSvgIcon("aws", "AWS (Amazon Web Services)", "cloud", ["amazon", "cloud", "ec2", "s3", "lambda"], "#FF9900", AWS_PATH),
  createSvgIcon("azure", "Microsoft Azure", "cloud", ["microsoft", "cloud", "vms", "functions"], "#0078D4", AZURE_PATH),
  createSvgIcon("gcp", BRAND_PATHS.gcp.title, "cloud", ["google", "gcp", "compute", "storage"], BRAND_PATHS.gcp.hex, BRAND_PATHS.gcp.path),
  createSvgIcon("docker", BRAND_PATHS.docker.title, "cloud", ["container", "devops", "deploy"], BRAND_PATHS.docker.hex, BRAND_PATHS.docker.path),
  createSvgIcon("k8s", BRAND_PATHS.k8s.title, "cloud", ["k8s", "cluster", "orchestration"], BRAND_PATHS.k8s.hex, BRAND_PATHS.k8s.path),
  createSvgIcon("cloudflare", BRAND_PATHS.cloudflare.title, "cloud", ["cdn", "dns", "security", "workers"], BRAND_PATHS.cloudflare.hex, BRAND_PATHS.cloudflare.path),
  createSvgIcon("terraform", BRAND_PATHS.terraform.title, "cloud", ["iac", "infrastructure", "hashicorp"], BRAND_PATHS.terraform.hex, BRAND_PATHS.terraform.path),
  createSvgIcon("vercel", BRAND_PATHS.vercel.title, "cloud", ["nextjs", "frontend", "hosting"], BRAND_PATHS.vercel.hex, BRAND_PATHS.vercel.path),
  createSvgIcon("netlify", BRAND_PATHS.netlify.title, "cloud", ["jamstack", "frontend", "serverless"], BRAND_PATHS.netlify.hex, BRAND_PATHS.netlify.path),
  createSvgIcon("digitalocean", BRAND_PATHS.digitalocean.title, "cloud", ["droplet", "cloud", "vps"], BRAND_PATHS.digitalocean.hex, BRAND_PATHS.digitalocean.path),
  createSvgIcon("linux", BRAND_PATHS.linux.title, "cloud", ["os", "kernel", "server", "ubuntu"], BRAND_PATHS.linux.hex, BRAND_PATHS.linux.path),
  createSvgIcon("nginx", BRAND_PATHS.nginx.title, "cloud", ["webserver", "proxy", "loadbalancer"], BRAND_PATHS.nginx.hex, BRAND_PATHS.nginx.path),
  createSvgIcon("github", BRAND_PATHS.github.title, "cloud", ["git", "repo", "actions", "vcs"], BRAND_PATHS.github.hex, BRAND_PATHS.github.path),

  // 2. Tech & Frameworks
  createSvgIcon("react", BRAND_PATHS.react.title, "tech", ["frontend", "javascript", "ui"], BRAND_PATHS.react.hex, BRAND_PATHS.react.path),
  createSvgIcon("nextjs", BRAND_PATHS.nextjs.title, "tech", ["react", "fullstack", "ssr"], BRAND_PATHS.nextjs.hex, BRAND_PATHS.nextjs.path),
  createSvgIcon("nodejs", BRAND_PATHS.nodejs.title, "tech", ["backend", "javascript", "runtime"], BRAND_PATHS.nodejs.hex, BRAND_PATHS.nodejs.path),
  createSvgIcon("typescript", BRAND_PATHS.typescript.title, "tech", ["ts", "javascript", "types"], BRAND_PATHS.typescript.hex, BRAND_PATHS.typescript.path),
  createSvgIcon("javascript", BRAND_PATHS.javascript.title, "tech", ["js", "web", "frontend"], BRAND_PATHS.javascript.hex, BRAND_PATHS.javascript.path),
  createSvgIcon("python", BRAND_PATHS.python.title, "tech", ["backend", "ai", "data", "django"], BRAND_PATHS.python.hex, BRAND_PATHS.python.path),
  createSvgIcon("go", BRAND_PATHS.go.title, "tech", ["google", "backend", "concurrency"], BRAND_PATHS.go.hex, BRAND_PATHS.go.path),
  createSvgIcon("rust", BRAND_PATHS.rust.title, "tech", ["systems", "memory", "wasm"], BRAND_PATHS.rust.hex, BRAND_PATHS.rust.path),
  createSvgIcon("graphql", BRAND_PATHS.graphql.title, "tech", ["api", "query", "schema"], BRAND_PATHS.graphql.hex, BRAND_PATHS.graphql.path),
  createSvgIcon("tailwindcss", BRAND_PATHS.tailwindcss.title, "tech", ["css", "styling", "ui"], BRAND_PATHS.tailwindcss.hex, BRAND_PATHS.tailwindcss.path),
  createSvgIcon("firebase", BRAND_PATHS.firebase.title, "tech", ["google", "firestore", "auth", "backend"], BRAND_PATHS.firebase.hex, BRAND_PATHS.firebase.path),
  createSvgIcon("supabase", BRAND_PATHS.supabase.title, "tech", ["postgres", "auth", "realtime", "backend"], BRAND_PATHS.supabase.hex, BRAND_PATHS.supabase.path),

  // 3. Databases & Messaging
  createSvgIcon("postgresql", BRAND_PATHS.postgresql.title, "database", ["sql", "rdbms", "database", "postgres"], BRAND_PATHS.postgresql.hex, BRAND_PATHS.postgresql.path),
  createSvgIcon("mysql", BRAND_PATHS.mysql.title, "database", ["sql", "rdbms", "database"], BRAND_PATHS.mysql.hex, BRAND_PATHS.mysql.path),
  createSvgIcon("redis", BRAND_PATHS.redis.title, "database", ["cache", "keyvalue", "inmemory"], BRAND_PATHS.redis.hex, BRAND_PATHS.redis.path),
  createSvgIcon("mongodb", BRAND_PATHS.mongodb.title, "database", ["nosql", "document", "database"], BRAND_PATHS.mongodb.hex, BRAND_PATHS.mongodb.path),
  createSvgIcon("sqlite", BRAND_PATHS.sqlite.title, "database", ["embedded", "sql", "local"], BRAND_PATHS.sqlite.hex, BRAND_PATHS.sqlite.path),
  createSvgIcon("elasticsearch", BRAND_PATHS.elasticsearch.title, "database", ["search", "logs", "lucene"], BRAND_PATHS.elasticsearch.hex, BRAND_PATHS.elasticsearch.path),
  createSvgIcon("kafka", BRAND_PATHS.kafka.title, "database", ["messaging", "stream", "queue"], BRAND_PATHS.kafka.hex, BRAND_PATHS.kafka.path),

  // 4. Architecture & System Components (Lucide SVGs)
  createLucideIcon("arch-server", "Server / Node", ["server", "backend", "instance", "host"], "Server", "#e03131"),
  createLucideIcon("arch-database", "Database Server", ["db", "storage", "sql", "data"], "Database", "#1971c2"),
  createLucideIcon("arch-cpu", "Processor / CPU", ["cpu", "chip", "compute", "hardware"], "Cpu", "#2b8a3e"),
  createLucideIcon("arch-cloud", "Cloud Service", ["cloud", "saas", "paas", "iaas"], "Cloud", "#15aabf"),
  createLucideIcon("arch-network", "Network / Router", ["router", "switch", "gateway", "subnet"], "Network", "#7048e8"),
  createLucideIcon("arch-harddrive", "Disk / Storage", ["storage", "disk", "ssd", "volume"], "HardDrive", "#e8590c"),
  createLucideIcon("arch-shield", "Firewall / Shield", ["security", "firewall", "waf", "protection"], "Shield", "#e03131"),
  createLucideIcon("arch-shield-check", "Verified Security", ["auth", "verified", "ssl", "tls"], "ShieldCheck", "#2b8a3e"),
  createLucideIcon("arch-smartphone", "Mobile Device", ["client", "phone", "ios", "android", "app"], "Smartphone", "#495057"),
  createLucideIcon("arch-laptop", "Laptop Client", ["client", "browser", "user", "frontend"], "Laptop", "#495057"),
  createLucideIcon("arch-monitor", "Desktop / Monitor", ["dashboard", "screen", "client", "ui"], "Monitor", "#495057"),
  createLucideIcon("arch-globe", "Internet / Web", ["internet", "wan", "cdn", "traffic"], "Globe", "#1c7ed6"),
  createLucideIcon("arch-terminal", "Terminal / CLI", ["cli", "bash", "console", "runner"], "Terminal", "#212529"),
  createLucideIcon("arch-key", "API Key / Secrets", ["credentials", "token", "kms", "secret"], "Key", "#f59f00"),
  createLucideIcon("arch-lock", "Secure Enclave / Lock", ["vault", "encryption", "https"], "Lock", "#d6336c"),
  createLucideIcon("arch-wifi", "Wireless / IoT", ["wifi", "iot", "sensor", "ble"], "Wifi", "#20c997"),
  createLucideIcon("arch-webhook", "Webhook / Integration", ["api", "webhook", "http", "event"], "Webhook", "#ae3ec9"),
  createLucideIcon("arch-boxes", "Microservices / Pods", ["containers", "pods", "services", "cluster"], "Boxes", "#339af0"),
  createLucideIcon("arch-box", "Container Unit", ["docker", "pod", "package", "service"], "Box", "#339af0"),
  createLucideIcon("arch-layers", "Architecture Layers", ["tier", "stack", "fullstack", "mvc"], "Layers", "#845ef7"),
  createLucideIcon("arch-activity", "Monitoring / Metrics", ["datadog", "grafana", "health", "uptime"], "Activity", "#fa5252"),
  createLucideIcon("arch-gauge", "Performance Gauge", ["metrics", "speed", "latency", "load"], "Gauge", "#40c057"),
  createLucideIcon("arch-user", "End User / Actor", ["user", "actor", "customer", "client"], "User", "#495057"),
  createLucideIcon("arch-users", "User Group / Team", ["users", "organization", "audience"], "Users", "#495057"),
  createLucideIcon("arch-message", "Message Queue", ["sqs", "rabbitmq", "pubsub", "event"], "MessageSquare", "#ff922b"),
  createLucideIcon("arch-mail", "Email / Notification", ["ses", "smtp", "alert", "notification"], "Mail", "#f06595"),
  createLucideIcon("arch-gitbranch", "Git Branch", ["vcs", "branch", "pr", "flow"], "GitBranch", "#fd7e14"),
  createLucideIcon("arch-gitcommit", "Git Commit", ["version", "build", "ci", "cd"], "GitCommit", "#82c91e"),
  createLucideIcon("arch-repeat", "Workflow / Pipeline", ["ci", "cd", "automation", "cron"], "Repeat", "#12b886"),
];
