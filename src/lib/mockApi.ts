import type { Project, Task, ProjectStatus, Priority } from "@/types";

let projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    status: "In Progress",
    startDate: "2024-01-10",
    endDate: "2024-03-30",
    progress: 65,
    budget: 25000,
    owner: "Alice",
    priority: "High",
  },
  {
    id: "2",
    name: "Mobile App Launch",
    status: "Planned",
    startDate: "2024-04-01",
    endDate: "2024-08-15",
    progress: 10,
    budget: 50000,
    owner: "Bob",
    priority: "Medium",
  },
  {
    id: "3",
    name: "Marketing Campaign Q2",
    status: "On Hold",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    progress: 30,
    budget: 15000,
    owner: "Carol",
    priority: "Low",
  },
];

const projectTasks: Record<string, Task[]> = {
  "1": [
    { id: "t1", title: "Design system", status: "Done", assignee: "Alice" },
    { id: "t2", title: "Landing page", status: "In Progress", assignee: "David" },
  ],
  "2": [
    { id: "t3", title: "Wireframes", status: "Todo", assignee: "Bob" },
  ],
  "3": [
    {
      id: "t4",
      title: "Audience research",
      status: "In Progress",
      assignee: "Erin",
    },
  ],
};

export interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: ProjectStatus | "All";
  priority?: Priority | "All";
  owner?: string;
  sortBy?: "name" | "startDate" | "endDate" | "progress" | "budget";
  sortDir?: "asc" | "desc";
}

export async function listProjects(params: ListParams) {
  const {
    page,
    pageSize,
    search,
    status = "All",
    priority = "All",
    owner,
    sortBy = "name",
    sortDir = "asc",
  } = params;

  let filtered = [...projects];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(s));
  }

  if (status !== "All") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (priority !== "All") {
    filtered = filtered.filter((p) => p.priority === priority);
  }

  if (owner) {
    filtered = filtered.filter((p) => p.owner === owner);
  }

  filtered.sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);

  await new Promise((r) => setTimeout(r, 400));
  return { items: pageItems, total };
}

export async function getProject(id: string) {
  await new Promise((r) => setTimeout(r, 200));
  return projects.find((p) => p.id === id) || null;
}

export async function updateProjectPartial(
  id: string,
  patch: Partial<Pick<Project, "status" | "budget" | "progress">>
) {
  await new Promise((r) => setTimeout(r, 300));
  projects = projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
  return projects.find((p) => p.id === id)!;
}

export async function listTasks(projectId: string) {
  await new Promise((r) => setTimeout(r, 300));
  return projectTasks[projectId] || [];
}

export async function addTask(
  projectId: string,
  title: string,
  assignee: string
) {
  await new Promise((r) => setTimeout(r, 200));
  const t: Task = {
    id: Math.random().toString(36).slice(2),
    title,
    status: "Todo",
    assignee,
  };
  projectTasks[projectId] = [...(projectTasks[projectId] || []), t];
  return t;
}

export async function updateTasksStatus(
  projectId: string,
  taskIds: string[],
  status: Task["status"]
) {
  await new Promise((r) => setTimeout(r, 250));
  projectTasks[projectId] =
    projectTasks[projectId]?.map((t) =>
      taskIds.includes(t.id) ? { ...t, status } : t
    ) ?? [];
  return projectTasks[projectId];
}

export async function updateTask(
  projectId: string,
  taskId: string,
  patch: Partial<Pick<Task, "title" | "assignee" | "status">>
) {
  await new Promise((r) => setTimeout(r, 200));
  const tasks = projectTasks[projectId] || [];
  projectTasks[projectId] = tasks.map((t) =>
    t.id === taskId ? { ...t, ...patch } : t
  );
  return projectTasks[projectId].find((t) => t.id === taskId) || null;
}
