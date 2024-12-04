
export type LoginResponse = {
  twoFactorAuthMethod: string
  cookie: string
}

export type Avatar = {
  id: string
  name: string
  thumbnailImageUrl: string
}

export type AvatarSearch = {
  totalPages: number
  avatars: Avatar[]
}
