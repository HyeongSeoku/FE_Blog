import { HeaderType } from "~/components/shared/header";

export interface Handle {
  metaTitle?: string;
  Layout?: React.ComponentType<{ children: React.ReactNode }>;
  headerType?: HeaderType;
}
