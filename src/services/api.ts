import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  User,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Experience, Message, Project } from "../types";
import { auth, db, storage } from "./firebase";

type FirestoreTimestampLike = {
  toDate?: () => Date;
};

const PROJECT_CATEGORIES = new Set<Project["category"]>([
  "Web",
  "Mobile",
  "Dashboard",
]);

const toIsoString = (value: unknown) => {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as FirestoreTimestampLike).toDate === "function"
  ) {
    return (value as FirestoreTimestampLike).toDate!().toISOString();
  }

  return new Date().toISOString();
};

const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const toNumberOrNull = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const getAdminClaim = async (user: User) => {
  const tokenResult = await getIdTokenResult(user, true);
  return tokenResult.claims.admin === true;
};

const requireAdminUser = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to continue.");
  }

  if (!(await getAdminClaim(user))) {
    throw new Error("Your account does not have admin access.");
  }

  return user;
};

const normalizeProject = (
  id: string,
  data: Record<string, unknown>,
): Project => {
  const category = PROJECT_CATEGORIES.has(data.category as Project["category"])
    ? (data.category as Project["category"])
    : "Web";
  const caseStudy =
    data.caseStudy && typeof data.caseStudy === "object"
      ? (data.caseStudy as Record<string, unknown>)
      : {};

  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    category,
    tags: toStringArray(data.tags),
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    pinned: data.pinned === true,
    pinOrder: toNumberOrNull(data.pinOrder),
    caseStudy: {
      problem: typeof caseStudy.problem === "string" ? caseStudy.problem : "",
      research:
        typeof caseStudy.research === "string" ? caseStudy.research : "",
      wireframes:
        typeof caseStudy.wireframes === "string" ? caseStudy.wireframes : "",
      finalUI: typeof caseStudy.finalUI === "string" ? caseStudy.finalUI : "",
      outcome: typeof caseStudy.outcome === "string" ? caseStudy.outcome : "",
      gallery: toStringArray(caseStudy.gallery),
    },
    createdAt: toIsoString(data.createdAt),
    updatedAt:
      data.updatedAt === undefined ? undefined : toIsoString(data.updatedAt),
  };
};

const sortProjects = (projects: Project[]) =>
  projects.sort((left, right) => {
    if (Boolean(left.pinned) !== Boolean(right.pinned)) {
      return left.pinned ? -1 : 1;
    }

    const leftPinOrder = left.pinOrder ?? Number.MAX_SAFE_INTEGER;
    const rightPinOrder = right.pinOrder ?? Number.MAX_SAFE_INTEGER;

    if (leftPinOrder !== rightPinOrder) {
      return leftPinOrder - rightPinOrder;
    }

    const updatedAtComparison = (right.updatedAt ?? right.createdAt).localeCompare(
      left.updatedAt ?? left.createdAt,
    );

    if (updatedAtComparison !== 0) {
      return updatedAtComparison;
    }

    return right.createdAt.localeCompare(left.createdAt);
  });

const normalizeExperience = (
  id: string,
  data: Record<string, unknown>,
): Experience => ({
  id,
  company: typeof data.company === "string" ? data.company : "",
  role: typeof data.role === "string" ? data.role : "",
  period: typeof data.period === "string" ? data.period : "",
  description: typeof data.description === "string" ? data.description : "",
  createdAt:
    data.createdAt === undefined ? undefined : toIsoString(data.createdAt),
  updatedAt:
    data.updatedAt === undefined ? undefined : toIsoString(data.updatedAt),
});

const normalizeMessage = (
  id: string,
  data: Record<string, unknown>,
): Message => ({
  id,
  name: typeof data.name === "string" ? data.name : "",
  email: typeof data.email === "string" ? data.email : "",
  message: typeof data.message === "string" ? data.message : "",
  createdAt: toIsoString(data.createdAt),
});

const sortByCreatedAtDesc = <T extends { createdAt?: string }>(items: T[]) =>
  items.sort((left, right) =>
    (right.createdAt ?? "").localeCompare(left.createdAt ?? ""),
  );

export const api = {
  isAdminUser: async (user: User | null) => {
    if (!user) {
      return false;
    }

    return getAdminClaim(user);
  },

  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const credentials = await signInWithEmailAndPassword(auth, email, password);

    if (!(await api.isAdminUser(credentials.user))) {
      await signOut(auth);
      throw new Error("Your account does not have admin access.");
    }

    return credentials;
  },

  logout: async () => signOut(auth),

  subscribeToAuthChanges: (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback),

  getProjects: async (): Promise<Project[]> => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    return sortProjects(
      querySnapshot.docs.map((projectDoc) =>
        normalizeProject(projectDoc.id, projectDoc.data()),
      ),
    );
  },

  createProject: async (project: Partial<Project>): Promise<Project> => {
    await requireAdminUser();

    const createdAt = new Date().toISOString();
    const payload = {
      ...project,
      tags: toStringArray(project.tags),
      pinned: project.pinned === true,
      pinOrder: toNumberOrNull(project.pinOrder),
      caseStudy: {
        problem: project.caseStudy?.problem ?? "",
        research: project.caseStudy?.research ?? "",
        wireframes: project.caseStudy?.wireframes ?? "",
        finalUI: project.caseStudy?.finalUI ?? "",
        outcome: project.caseStudy?.outcome ?? "",
        gallery: toStringArray(project.caseStudy?.gallery),
      },
      createdAt,
      updatedAt: createdAt,
    };

    const documentRef = await addDoc(collection(db, "projects"), payload);
    return normalizeProject(documentRef.id, payload as Record<string, unknown>);
  },

  updateProject: async (
    id: string,
    project: Partial<Project>,
  ): Promise<Project> => {
    await requireAdminUser();

    const updatedAt = new Date().toISOString();
    const projectRef = doc(db, "projects", id);
    const payload = {
      ...project,
      tags: project.tags ? toStringArray(project.tags) : undefined,
      pinned: typeof project.pinned === "boolean" ? project.pinned : undefined,
      pinOrder:
        project.pinOrder !== undefined ? toNumberOrNull(project.pinOrder) : undefined,
      caseStudy: project.caseStudy
        ? {
            problem: project.caseStudy.problem ?? "",
            research: project.caseStudy.research ?? "",
            wireframes: project.caseStudy.wireframes ?? "",
            finalUI: project.caseStudy.finalUI ?? "",
            outcome: project.caseStudy.outcome ?? "",
            gallery: toStringArray(project.caseStudy.gallery),
          }
        : undefined,
      updatedAt,
    };

    const sanitizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    );

    await updateDoc(projectRef, sanitizedPayload);

    const updatedSnapshot = await getDoc(projectRef);

    return updatedSnapshot.exists()
      ? normalizeProject(updatedSnapshot.id, updatedSnapshot.data())
      : normalizeProject(id, sanitizedPayload as Record<string, unknown>);
  },

  deleteProject: async (id: string) => {
    await requireAdminUser();
    await deleteDoc(doc(db, "projects", id));
  },

  getExperience: async (): Promise<Experience[]> => {
    const querySnapshot = await getDocs(collection(db, "experience"));
    return sortByCreatedAtDesc(
      querySnapshot.docs.map((experienceDoc) =>
        normalizeExperience(experienceDoc.id, experienceDoc.data()),
      ),
    );
  },

  createExperience: async (
    experience: Partial<Experience>,
  ): Promise<Experience> => {
    await requireAdminUser();

    const createdAt = new Date().toISOString();
    const payload = {
      ...experience,
      createdAt,
      updatedAt: createdAt,
    };

    const documentRef = await addDoc(collection(db, "experience"), payload);
    return normalizeExperience(
      documentRef.id,
      payload as Record<string, unknown>,
    );
  },

  deleteExperience: async (id: string) => {
    await requireAdminUser();
    await deleteDoc(doc(db, "experience", id));
  },

  sendMessage: async (message: Partial<Message>) => {
    const payload = {
      name: message.name ?? "",
      email: message.email ?? "",
      message: message.message ?? "",
      createdAt: new Date().toISOString(),
    };

    const documentRef = await addDoc(collection(db, "messages"), payload);
    return normalizeMessage(documentRef.id, payload);
  },

  getMessages: async (): Promise<Message[]> => {
    await requireAdminUser();

    const querySnapshot = await getDocs(collection(db, "messages"));
    return sortByCreatedAtDesc(
      querySnapshot.docs.map((messageDoc) =>
        normalizeMessage(messageDoc.id, messageDoc.data()),
      ),
    );
  },

  uploadImage: async (file: File) => {
    await requireAdminUser();

    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const storageRef = ref(
      storage,
      `projects/${Date.now()}-${crypto.randomUUID()}-${safeName}`,
    );

    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },
};
