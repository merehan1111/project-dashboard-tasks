export type ProjectStatus = "Planned" | "In Progress" | "On Hold" | "Completed";
export type Priority = "Low" | "Medium" | "High";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  owner: string;
  priority: Priority;
}

export interface Task {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
  assignee: string;
}
