export type DocType =
  | "readme"
  | "api"
  | "architecture"
  | "folder-structure"
  | "installation"
  | "setup"
  | "env-vars"
  | "database"
  | "features"
  | "components"
  | "onboarding"
  | "deployment"
  | "faq"
  | "contributing"
  | "changelog";

export interface DocTypeMeta {
  id: DocType;
  title: string;
  filename: string;
  description: string;
}

export const DOC_TYPES: DocTypeMeta[] = [
  { id: "readme", title: "README", filename: "README.md", description: "Project overview, badges, quick start" },
  { id: "api", title: "API Documentation", filename: "docs/API.md", description: "Endpoints, request/response shapes" },
  { id: "architecture", title: "Architecture Overview", filename: "docs/ARCHITECTURE.md", description: "System design and data flow" },
  { id: "folder-structure", title: "Folder Structure", filename: "docs/FOLDER_STRUCTURE.md", description: "Directory-by-directory explanation" },
  { id: "installation", title: "Installation Guide", filename: "docs/INSTALLATION.md", description: "Prerequisites and install steps" },
  { id: "setup", title: "Setup Guide", filename: "docs/SETUP.md", description: "Local dev environment setup" },
  { id: "env-vars", title: "Environment Variables", filename: "docs/ENVIRONMENT.md", description: "Every env var, what it does" },
  { id: "database", title: "Database Documentation", filename: "docs/DATABASE.md", description: "Schema, models, migrations" },
  { id: "features", title: "Feature Documentation", filename: "docs/FEATURES.md", description: "What the product does" },
  { id: "components", title: "Component Documentation", filename: "docs/COMPONENTS.md", description: "UI component inventory" },
  { id: "onboarding", title: "Developer Onboarding", filename: "docs/ONBOARDING.md", description: "First week for a new engineer" },
  { id: "deployment", title: "Deployment Guide", filename: "docs/DEPLOYMENT.md", description: "Ship it to production" },
  { id: "faq", title: "FAQ", filename: "docs/FAQ.md", description: "Common questions" },
  { id: "contributing", title: "Contributing Guide", filename: "CONTRIBUTING.md", description: "How to contribute" },
  { id: "changelog", title: "Changelog Template", filename: "CHANGELOG.md", description: "Keep a Changelog scaffold" },
];

export function docTypeMeta(id: DocType): DocTypeMeta {
  const meta = DOC_TYPES.find((d) => d.id === id);
  if (!meta) throw new Error(`Unknown doc type: ${id}`);
  return meta;
}
