export interface User {
  Id: string;
  Name: string;
  PrimaryImageTag?: string;
  HasPassword: boolean;
  HasConfiguredPassword: boolean;
  HasConfiguredEasyPassword: boolean;
  EnableUserPreferenceAccess: boolean;
  adminRoles: string[];
  policy: UserPolicy;
}

export interface UserPolicy {
  IsAdministrator: boolean;
  IsHidden: boolean;
  IsDisabled: boolean;
  blockedTags: string[];
  enableUserPreferenceAccess: boolean;
  accessSchedules: AccessSchedule[];
}

export interface AccessSchedule {
  DayOfWeek: number;
  StartHour: number;
  EndHour: number;
}

export interface BaseItemDto {
  Id: string;
  Name: string;
  Type: string;
  ImageTags?: Record<string, string>;
  BackdropImageTags?: string[];
  ParentLogoImageTag?: string;
  ParentArtImageTag?: string;
  PremiereDate?: string;
  ProductionYear?: number;
  runTimeTicks?: number;
  communityRating?: number;
  officialRating?: string;
}

export interface ServerInfo {
  Id: string;
  Name: string;
  LocalAddress: string;
  RemoteAddress: string;
  Version: string;
  operatingSystem?: string;
}

export interface SessionInfo {
  Id: string;
  UserId: string;
  UserName: string;
  DeviceId: string;
  DeviceName: string;
  Client: string;
  LastActivityDate: string;
  NowPlayingItem?: BaseItemDto;
  PlayState?: PlayState;
}

export interface PlayState {
  PositionTicks: number;
  Volume: number;
  IsMuted: boolean;
  IsPaused: boolean;
  RepeatMode: RepeatMode;
}

export enum RepeatMode {
  RepeatNone = 'RepeatNone',
  RepeatAll = 'RepeatAll',
  RepeatOne = 'RepeatOne'
}
