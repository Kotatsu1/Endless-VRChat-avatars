interface Avatar {
  id: number;
  avtr: string;
  title: string;
  thumbnailUrl: string;
}

interface SiteAvatar {
  id: string;
  name: string;
  thumbnailImageUrl: string;
}

interface SearchAvatar {
  avtr: string,
  title: string,
  thumbnailUrl: string
}

interface Badge {
  assignedAt: string;
  badgeDescription: string;
  badgeId: string;
  badgeImageUrl: string;
  badgeName: string;
  hidden: boolean;
  showcased: boolean;
  updatedAt: string;
}

interface Presence {
  avatarThumbnail: string;
  currentAvatarTags: string;
  debugflag: string;
  displayName: string;
  groups: string[];
  id: string;
  instance: string;
  instanceType: string;
  isRejoining: string;
  platform: string;
  profilePicOverride: string;
  status: string;
  travelingToInstance: string;
  travelingToWorld: string;
  userIcon: string;
  world: string;
}

interface PastDisplayName {
  displayName: string;
  reverted: boolean;
  updated_at: string;
}

interface SteamDetails {
  avatar: string;
  avatarfull: string;
  avatarhash: string;
  avatarmedium: string;
  commentpermission: number;
  communityvisibilitystate: number;
  loccityid: number;
  loccountrycode: string;
  locstatecode: string;
  personaname: string;
  personastate: number;
  personastateflags: number;
  primaryclanid: string;
  profilestate: number;
  profileurl: string;
  realname: string;
  steamid: string;
  timecreated: number;
}

interface User {
  acceptedPrivacyVersion: number;
  acceptedTOSVersion: number;
  accountDeletionDate: string | null;
  accountDeletionLog: string | null;
  activeFriends: string[];
  allowAvatarCopying: boolean;
  badges: Badge[];
  bio: string;
  bioLinks: string[];
  currentAvatar: string;
  currentAvatarAssetUrl: string;
  currentAvatarImageUrl: string;
  currentAvatarTags: string[];
  currentAvatarThumbnailImageUrl: string;
  date_joined: string;
  developerType: string;
  displayName: string;
  emailVerified: boolean;
  fallbackAvatar: string;
  friendGroupNames: string[];
  friendKey: string;
  friends: string[];
  googleDetails: Record<string, unknown>;
  googleId: string;
  hasBirthday: boolean;
  hasEmail: boolean;
  hasLoggedInFromClient: boolean;
  hasPendingEmail: boolean;
  hideContentFilterSettings: boolean;
  homeLocation: string;
  id: string;
  isBoopingEnabled: boolean;
  isFriend: boolean;
  last_activity: string;
  last_login: string;
  last_mobile: string | null;
  last_platform: string;
  obfuscatedEmail: string;
  obfuscatedPendingEmail: string;
  oculusId: string;
  offlineFriends: string[];
  onlineFriends: string[];
  pastDisplayNames: PastDisplayName[];
  picoId: string;
  presence: Presence;
  profilePicOverride: string;
  profilePicOverrideThumbnail: string;
  pronouns: string;
  queuedInstance: string | null;
  state: string;
  status: string;
  statusDescription: string;
  statusFirstTime: boolean;
  statusHistory: string[];
  steamDetails: SteamDetails;
  steamId: string;
  tags: string[];
  twoFactorAuthEnabled: boolean;
  twoFactorAuthEnabledDate: string | null;
  unsubscribe: boolean;
  updated_at: string;
  userIcon: string;
  userLanguage: string;
  userLanguageCode: string;
  username: string;
  viveId: string;
}


export type { User };
export type { Avatar };
export type { SiteAvatar };
export type { SearchAvatar };