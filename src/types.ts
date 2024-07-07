interface Avatar {
  id: number;
  avtr: string;
  title: string;
  thumbnailUrl: string;
}

interface AvatarSite {
  id: string;
  name: string;
  thumbnailImageUrl: string;
}


export type { Avatar };
export type { AvatarSite };