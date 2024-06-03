export interface Handle {
  metaTitle?: string;
  Layout?: React.ComponentType<{ children: React.ReactNode }>;
  headerType?: "BACK" | "DEFAULT";
}
