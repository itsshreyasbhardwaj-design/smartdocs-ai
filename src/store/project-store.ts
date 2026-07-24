"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RepoAnalysis } from "@/lib/analysis";
import type { DocType } from "@/lib/docs/types";

export interface SavedProject {
  id: string;
  repoUrl: string;
  analysis: RepoAnalysis;
  docs: Partial<Record<DocType, string>>;
  createdAt: string;
  updatedAt: string;
}

export type GenerationStatus = "idle" | "generating" | "done" | "error";

interface ProjectState {
  projects: SavedProject[];
  activeProjectId: string | null;

  currentRepoUrl: string;
  currentAnalysis: RepoAnalysis | null;
  currentDocs: Partial<Record<DocType, string>>;
  docStatus: Partial<Record<DocType, GenerationStatus>>;
  activeDocType: DocType;
  analyzeError: string | null;
  isAnalyzing: boolean;

  setRepoUrl: (url: string) => void;
  startAnalysis: () => void;
  setAnalysis: (analysis: RepoAnalysis) => void;
  setAnalyzeError: (error: string | null) => void;
  setDocStatus: (docType: DocType, status: GenerationStatus) => void;
  setDocContent: (docType: DocType, content: string) => void;
  appendDocContent: (docType: DocType, chunk: string) => void;
  setActiveDocType: (docType: DocType) => void;
  saveCurrentProject: () => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  resetCurrent: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      currentRepoUrl: "",
      currentAnalysis: null,
      currentDocs: {},
      docStatus: {},
      activeDocType: "readme",
      analyzeError: null,
      isAnalyzing: false,

      setRepoUrl: (url) => set({ currentRepoUrl: url }),

      startAnalysis: () =>
        set({ isAnalyzing: true, analyzeError: null, currentAnalysis: null, currentDocs: {}, docStatus: {} }),

      setAnalysis: (analysis) => set({ currentAnalysis: analysis, isAnalyzing: false }),

      setAnalyzeError: (error) => set({ analyzeError: error, isAnalyzing: false }),

      setDocStatus: (docType, status) =>
        set((state) => ({ docStatus: { ...state.docStatus, [docType]: status } })),

      setDocContent: (docType, content) =>
        set((state) => ({ currentDocs: { ...state.currentDocs, [docType]: content } })),

      appendDocContent: (docType, chunk) =>
        set((state) => ({
          currentDocs: {
            ...state.currentDocs,
            [docType]: (state.currentDocs[docType] ?? "") + chunk,
          },
        })),

      setActiveDocType: (docType) => set({ activeDocType: docType }),

      saveCurrentProject: () => {
        const { currentAnalysis, currentRepoUrl, currentDocs, activeProjectId, projects } = get();
        if (!currentAnalysis) return;
        const now = new Date().toISOString();

        if (activeProjectId && projects.some((p) => p.id === activeProjectId)) {
          set({
            projects: projects.map((p) =>
              p.id === activeProjectId
                ? { ...p, analysis: currentAnalysis, docs: currentDocs, updatedAt: now }
                : p
            ),
          });
          return;
        }

        const id = `${currentAnalysis.ref.owner}-${currentAnalysis.ref.repo}-${Date.now()}`;
        const project: SavedProject = {
          id,
          repoUrl: currentRepoUrl,
          analysis: currentAnalysis,
          docs: currentDocs,
          createdAt: now,
          updatedAt: now,
        };
        set({ projects: [project, ...projects], activeProjectId: id });
      },

      loadProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        set({
          activeProjectId: project.id,
          currentRepoUrl: project.repoUrl,
          currentAnalysis: project.analysis,
          currentDocs: project.docs,
          docStatus: Object.fromEntries(
            Object.keys(project.docs).map((k) => [k, "done"])
          ) as Partial<Record<DocType, GenerationStatus>>,
          analyzeError: null,
          isAnalyzing: false,
        });
      },

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        })),

      resetCurrent: () =>
        set({
          activeProjectId: null,
          currentRepoUrl: "",
          currentAnalysis: null,
          currentDocs: {},
          docStatus: {},
          analyzeError: null,
          isAnalyzing: false,
        }),
    }),
    {
      name: "smartdocs-storage",
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);
