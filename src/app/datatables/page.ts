export class Page {
  id: number;
  title: string;
  description: string;
  icon: string;
  sidebar: string;
  is_active: boolean;
}

export class Tags {
  id: number;
  tagname: string;
}

export class assoc_top_tag {
  id: number;
  top_id: number;
  tag_id: number;
  is_active: boolean;
}

export class SubPage {
  id: number;
  top_id: number;
  title: string;
  description: string;
  icon: string;
  memo: string;
  url: string;
  url_target: string;
  is_active: boolean;
}



