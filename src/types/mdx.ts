export interface FrontMatterProps {
  title: string;
  description: string;
  category: string;
  createdAt: string;
  subCategory?: string;
  tags?: string[];
}

export interface HeadingsProps {
  id: string;
  text: string;
  level: number;
  isVisit: boolean;
}
