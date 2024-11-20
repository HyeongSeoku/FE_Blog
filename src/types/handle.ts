import { HeaderType } from "@/components/Header";

export interface Handle {
  metaTitle?: string;
  Layout?: React.ComponentType<{ children: React.ReactNode }>;
  headerType?: HeaderType;
}
