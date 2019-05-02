export class Page {
  id: number;
  title: string;
  description: string;
  icon: string;
  sidebar: string;
  tags: any[];
  isactive: boolean;
}

export class Tags {
  id: number;
  tag: string;
  isChecked: boolean;
}

export class assoc_top_tag {
  id: number;
  pageid: number;
  tagid: number;
  isactive: boolean;
  update: boolean;
}

export class SubPage {
  id: number;
  pageid: number;
  title: string;
  description: string;
  icon: string;
  memo: string;
  url: string;
  url_target: string;
  isactive: boolean;
}

export class RelatedPages {
  relatedPage: string;
}

export class Thumbnails {
  icon_name: string;
}



