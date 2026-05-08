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
  configuration?: UserConfiguration;
  primaryImageAspectRatio?: number;
  remoteClients?: string[];
  lastActivityDate?: string;
  lastLoginDate?: string;
  lastPlayback?: string;
}

export interface UserPolicy {
  IsAdministrator: boolean;
  IsHidden: boolean;
  IsDisabled: boolean;
  blockedTags: string[];
  enableUserPreferenceAccess: boolean;
  accessSchedules: AccessSchedule[];
  maxParentalRating?: number;
  blockedMediaFolders?: string[];
  allowedMediaFolders?: string[];
}

export interface AccessSchedule {
  DayOfWeek: number;
  StartHour: number;
  EndHour: number;
}

export interface UserConfiguration {
  AudioLanguagePreference?: string;
  PlayDefaultAudioTrack?: boolean;
  SubtitleLanguagePreference?: string;
  DisplayMissingEpisodes?: boolean;
  GroupedFolders?: string[];
  IsCustomPreferences?: boolean;
  SubtitleMode?: SubtitleMode;
  SyncPlayAccess?: SyncPlayAccess;
  HidePlayedInLibrary?: boolean;
  HidePlayedInViews?: boolean;
  RememberAudioSelections?: boolean;
  RememberSubtitleSelections?: boolean;
  EnableNextEpisodeAutoPlay?: boolean;
}

export enum SubtitleMode {
  Default = 'Default',
  Always = 'Always',
  OnlyForced = 'OnlyForced',
  None = 'None',
  Smart = 'Smart'
}

export enum SyncPlayAccess {
  None = 'None',
  JoinAndJoin = 'JoinAndJoin',
  CreateAndJoin = 'CreateAndJoin',
  Join = 'Join'
}

export interface BaseItemDto {
  Name: string;
  Id: string;
  Type: ItemType;
  Type2?: string;
  SourceType?: string;
  IsFolder?: boolean;
  IsComposite?: boolean;
  ViewType?: string;
  ImageTags?: Record<string, string>;
  BackdropImageTags?: string[];
  backdrop?: string[];
  ParentBackdropImageTags?: string[];
  ParentBackdropItemId?: string;
  ParentLogoImageTag?: string;
  ParentLogoItemId?: string;
  ParentArtImageTag?: string;
  ParentArtItemId?: string;
  SeriesId?: string;
  SeriesName?: string;
  SeasonId?: string;
  SeasonName?: string;
  PrimaryImageAspectRatio?: number;
  Notes?: string;
  Status?: string;
  ContentType?: string;
  Cast?: BaseItemPerson[];
  CastWithImage?: BaseItemPerson[];
  Crew?: BaseItemPerson[];
  Genres?: string[];
  Studios?: NameGuidPair[];
  GenreIds?: string[];
  Tags?: string[];
  PremiereDate?: string;
  DateCreated?: string;
  EndDate?: string;
  ProductionYear?: number;
  ProductionLocations?: string[];
  EpisodeCount?: number;
  ChannelId?: string;
  ChannelName?: string;
  Overview?: string;
  ParentIndexNumber?: number;
  IndexNumber?: number;
  IndexNumberEnd?: number;
  IsTotalInteracts?: number;
  CommunityRating?: number;
  CumulativeCommunityRating?: number;
  MetadataRating?: number;
  ChildCount?: number;
  PlayAccess?: PlayAccess;
  PresentationUniqueKey?: string;
  EnableMediaSourceDisplay?: boolean;
  ShortOverview?: string;
  SeasonCount?: number;
  TextOverview?: string;
  SpecialEpisodeCount?: number;
  RequiresExternalDisc?: boolean;
  IsLiveTv?: boolean;
  IsSeries?: boolean;
  IsMovie?: boolean;
  IsSports?: boolean;
  IsNews?: boolean;
  IsKids?: boolean;
  IsPremiere?: boolean;
  IsNew?: boolean;
  IsRepeat?: boolean;
  isOwen?: boolean;
  isAvailable?: boolean;
  ProductionCountries?: string[];
  HasSubtitles?: boolean;
  ExternalId?: string;
  ExternalIdProvider?: string;
  RunTimeTicks?: number;
  ActualRunTimeTicks?: number;
  Container?: string;
  Categories?: string[];
  Studios2?: StudioNames[];
  Players?: number[];
  VideoType?: VideoType;
  Video3DFormat?: Video3DFormat;
  MediaType?: string;
  OriginalTitle?: string;
  SortName?: string;
  ExternalUrls?: ExternalUrl[];
  MediaStreams?: MediaStream[];
  ProviderIds?: Record<string, string>;
  IsHD?: boolean;
  LocaltrailerCount?: number;
  SpecialFeatureCount?: number;
  DisplayPreferencesId?: string;
  ThemeImageTag?: string;
  PrimaryImageItemId?: string;
  PrimaryImageTag?: string;
  Album?: string;
  ArtistItems?: NameIdPair[];
  AlbumId?: string;
  AlbumPrimaryImageTag?: string;
  SeriesThumbImageTag?: string;
  ImageBlurHashes?: Record<string, Record<string, string>>;
  SeriesPrimaryImageTag?: string;
  ParentThumbItemId?: string;
  ParentThumbImageTag?: string;
  SeriesStudio?: string;
  RecursiveItemCount?: number;
  settings?: UserSettings;
  RemoteTrailers?: MediaUrl[];
  AllowDelete?: boolean;
  AllowMediaConversion?: boolean;
  ChannelMapping?: ChannelMapping;
  EnableMediaDownload?: boolean;
  DownloadFilename?: string;
  ['Has plot']?: string;
  plot?: string;
}

export enum ItemType {
  AggregateFolder = 'AggregateFolder',
  Audio = 'Audio',
  AudioBook = 'AudioBook',
  BasePluginFolder = 'BasePluginFolder',
  Book = 'Book',
  BoxSet = 'BoxSet',
  Channel = 'Channel',
  ChannelFolderItem = 'ChannelFolderItem',
  CollectionFolder = 'CollectionFolder',
  Episode = 'Episode',
  Folder = 'Folder',
  LiveTvChannel = 'LiveTvChannel',
  LiveTvProgram = 'LiveTvProgram',
  LiveTvRecording = 'LiveTvRecording',
  Movie = 'Movie',
  MusicAlbum = 'MusicAlbum',
  MusicArtist = 'MusicArtist',
  MusicGenre = 'MusicGenre',
  MusicVideo = 'MusicVideo',
  Person = 'Person',
  Photo = 'Photo',
  PhotoAlbum = 'PhotoAlbum',
  Playlist = 'Playlist',
  Program = 'Program',
  Recording = 'Recording',
  Season = 'Season',
  Series = 'Series',
  Studio = 'Studio',
  Trailer = 'Trailer',
  TvChannel = 'TvChannel',
  TvProgram = 'TvProgram',
  TvRecording = 'TvRecording',
  Video = 'Video'
}

export enum PlayAccess {
  Full = 'Full',
  None = 'None',
  CONFLICT = 'Conflict',
  NotAllowed = 'NotAllowed'
}

export enum VideoType {
  VideoFile = 'VideoFile',
  BluRay = 'BluRay',
  Dvd = 'Dvd',
  DvdMedia = 'DvdMedia',
  Iso = 'Iso',
  VideoRange = 'VideoRange',
  SD = 'SD',
  HD = 'HD',
  UHD = 'UHD',
  HDR = 'HDR'
}

export enum Video3DFormat {
  HalfSideBySide = 'HalfSideBySide',
  FullSideBySide = 'FullSideBySide',
  FullTopAndBottom = 'FullTopAndBottom',
  HalfTopAndBottom = 'HalfTopAndBottom',
  TabSideBySide = 'TabSideBySide',
  MVC = 'MVC',
  None = 'None'
}

export interface BaseItemPerson {
  Name: string;
  Id: string;
  Role?: string;
  Type?: string;
  PrimaryImageTag?: string;
  ImageTag?: string;
}

export interface NameGuidPair {
  Name: string;
  Id: string;
}

export interface NameIdPair {
  Name: string;
  Id: string;
}

export interface ExternalUrl {
  Name: string;
  Url: string;
}

export interface StudioNames {
  Name: string;
}

export interface ChannelMapping {
  TargetChannelId?: string;
  TargetExternalId?: string;
  ChannelId?: string;
  ExternalId?: string;
}

export interface MediaUrl {
  Name: string;
  Url: string;
}

export interface UserSettings {
  SubtitleFontSize?: number;
  SubtitleDeceleration?: boolean;
  SubtitlePreset?: string;
  SubtitleStretch?: number;
}

export interface MediaStream {
  Codec?: string;
  CodecTag?: string;
  Language?: string;
  ColorSpace?: string;
  ColorPrimaries?: string;
  ColorTransfer?: string;
  BitRate?: number;
  BitDepth?: number;
  RefFrames?: number;
  PacketLength?: number;
  Channels?: number;
  SampleRate?: number;
  IsDefault?: boolean;
  IsForced?: boolean;
  IsExternal?: boolean;
  Index?: number;
  IsAlternate?: boolean;
  Path?: string;
  Level?: number;
  Type?: MediaStreamType;
  Profile?: string;
  AspectRatio?: string;
  MeanBitRate?: number;
  RealFrameRate?: number;
  StreamId?: number;
  AudioCodec?: string;
  VideoCodec?: string;
  VideoRange?: string;
  AudioChannels?: number;
  AudioSpatialProperties?: string;
}

export enum MediaStreamType {
  Audio = 'Audio',
  Video = 'Video',
  Subtitle = 'Subtitle',
  EmbeddedImage = 'EmbeddedImage'
}

export interface ServerInfo {
  LocalAddress: string;
  Name: string;
  Id: string;
  Version: string;
  OperatingSystem?: string;
  WakeOnLanInfo?: WakeOnLanInfo;
  ServerName?: string;
  LocalEndPoint?: string;
  PublicPort?: number;
  PublicHttpsPort?: number;
  HttpPort?: number;
  HttpsPort?: number;
  EnableHttps?: boolean;
  BaseUrl?: string;
  LocalBaseUrl?: string;
  ExternalHttpsPort?: number;
  ExternalBaseUrl?: string;
  ManualAddress?: string;
  ExternalAddress?: string;
}

export interface WakeOnLanInfo {
  MacAddresses?: string[];
}

export interface SessionInfo {
  Id: string;
  UserId?: string;
  UserName?: string;
  DeviceId?: string;
  DeviceName?: string;
  Client?: string;
  ClientVersion?: string;
  ApplicationVersion?: string;
  LastActivityDate?: string;
  LastPlayback?: string;
  LastPlaybackCheckIn?: string;
  PlayState?: PlayState;
  NowPlayingQueue?: QueueItem[];
  NowPlayingQueueFullItems?: boolean;
  Capabilities?: ClientCapabilities;
  RemoteEndPoint?: string;
  LocalEndPoint?: string;
  IsActive?: boolean;
  SuppressUserId?: boolean;
  IsDisabled?: boolean;
  SupportedCommands?: string[];
}

export interface PlayState {
  PositionTicks?: number;
  Volume?: number;
  IsMuted?: boolean;
  IsPaused?: boolean;
  RepeatMode?: RepeatMode;
  SubtitleOffset?: number;
  AudioStreamIndex?: number;
  SubtitleStreamIndex?: number;
  MediaSourceId?: string;
  PlayMethod?: PlayMethod;
  LiveStreamId?: string;
}

export enum RepeatMode {
  RepeatNone = 'RepeatNone',
  RepeatAll = 'RepeatAll',
  RepeatOne = 'RepeatOne'
}

export enum PlayMethod {
  DirectStream = 'DirectStream',
  DirectPlay = 'DirectPlay',
  Transcode = 'Transcode'
}

export interface QueueItem {
  Id?: string;
  playlistItemId?: string;
}

export interface ClientCapabilities {
  PlayableMediaTypes?: string[];
  SupportedCommands?: string[];
  SupportsPersistentIdentifier?: boolean;
  SupportsMediaControl?: boolean;
  SupportsContentUploading?: boolean;
  MessageCallbackUrl?: string;
  SupportsOfflinePlayback?: boolean;
  SupportsExternalStorage?: boolean;
  supportsLiveMediaControl?: boolean;
  SupportedLiveMediaTypes?: string[];
}

export interface ItemsResult {
  Items: BaseItemDto[];
  TotalRecordCount: number;
  StartIndex: number;
  ParentId?: string;
}

export interface ArtistsResult {
  Items: BaseItemPerson[];
  TotalRecordCount: number;
  StartIndex: number;
}

export interface GenresResult {
  Items: NameGuidPair[];
  TotalRecordCount: number;
  StartIndex: number;
}

export interface StudiosResult {
  Items: NameGuidPair[];
  TotalRecordCount: number;
  StartIndex: number;
}

export interface RootFolder {
  Id: string;
  Name: string;
  Type: string;
  Path?: string;
  IsHidden?: boolean;
  Items?: BaseItemDto[];
}

export interface SystemInfo {
  Id?: string;
  OperatingSystem?: string;
  CompletedInstallations?: string[];
  Version?: string;
  Architecture?: string;
  MetadataPath?: string;
  PreferredMetadataLanguage?: string;
  MetadataCountryCode?: string;
  ServerName?: string;
  LocalAddress?: string;
  ExternalAddress?: string;
  HTTPSPort?: number;
  EnableHttps?: boolean;
  HTTPPort?: number;
  BaseUrl?: string;
  EnableUPnP?: boolean;
}

export interface StartupInfo {
  Servers?: ServerInfo[];
  HasPassword?: boolean;
  HasConfiguredPassword?: boolean;
  HasConfiguredEasyPassword?: boolean;
  EnableAutoLogin?: boolean;
  CachePath?: string;
}

export interface PublicInfo {
  EnableAutoLogin?: boolean;
  HasPassword?: boolean;
  HasConfiguredPassword?: boolean;
  HasConfiguredEasyPassword?: boolean;
  CachePath?: string;
  CacheDeltaPath?: string;
  EnableRealtimeMonitor?: boolean;
  EnableAutomaticRestart?: boolean;
  IsStartupWizardCompleted?: boolean;
}

export interface TranscodingInfo {
  IsActive: boolean;
  CompletionPercentage?: number;
  FfmpegProcessId?: number;
  TranscodingFramerate?: number;
  AudioCodec?: string;
  VideoCodec?: string;
  Container?: string;
  VideoBitrate?: number;
  AudioBitrate?: number;
  MaxConcurrentSessions?: number;
  VideoApplication?: string;
  FailReason?: string;
}

export interface LiveTvInfo {
  Services?: LiveTvServiceInfo[];
  IsEnabled: boolean;
  EnabledUsers?: EnabledUserInfo[];
}

export interface LiveTvServiceInfo {
  Name: string;
  Id: string;
}

export interface EnabledUserInfo {
  UserId?: string;
  UserName?: string;
}

export interface RecordingGroup {
  Id: string;
  Name: string;
  RecordingCount?: number;
}

export interface TimerInfoDto {
  Id?: string;
  Type?: string;
  Category?: string;
  Title?: string;
  Overview?: string;
  StartDate?: string;
  EndDate?: string;
  ServesDvr?: boolean;
  DvrService?: string;
  ChannelId?: string;
  ChannelName?: string;
  ChannelImageURL?: string;
  ProgramId?: string;
  SeriesTimerId?: string;
  IsPrePaddingRequired?: boolean;
  PostPaddingSeconds?: number;
  PrePaddingSeconds?: number;
  IsPostPaddingRequired?: boolean;
  Notify?: boolean;
  FirstReminderMinutes?: number;
  SecondReminderMinutes?: number;
  IsChildren?: boolean;
  ManualVisit?: boolean;
  Type2?: string;
  Status?: RecordingStatus;
  CancellationReason?: string;
}

export enum RecordingStatus {
  New = 'New',
  Scheduled = 'Scheduled',
  Recording = 'Recording',
  Completed = 'Completed',
  Aborted = 'Aborted',
  Cancelled = 'Cancelled'
}

export interface ChannelInfoDto {
  Id: string;
  Name: string;
  Type?: string;
  ChannelNumber?: string;
  CallSign?: string;
  ProviderId?: string;
  ChannelType?: string;
  Number?: string;
  Tags?: string[];
  IsFavorite?: boolean;
  channelImageUrl?: string;
  hasImage?: boolean;
  serviceName?: string;
}

export interface ProgramInfoDto {
  Id: string;
  Id2?: string;
  ChannelId?: string;
  ChannelName?: string;
  ChannelNumber?: string;
  ChannelType?: string;
  Name?: string;
  Title?: string;
  EpisodeTitle?: string;
  Description?: string;
  IsMovie?: boolean;
  IsSeries?: boolean;
  IsSports?: boolean;
  IsNews?: boolean;
  IsKids?: boolean;
  IsPremiere?: boolean;
  isOwen?: boolean;
  IsRepeat?: boolean;
  IsLive?: boolean;
  IsNew?: boolean;
  StartDate?: string;
  EndDate?: string;
  RunTimeTicks?: number;
  Priority?: number;
  GenreItems?: NameGuidPair[];
  Genres?: string[];
  Type?: string;
  ProductionYear?: number;
  IndexNumber?: number;
  ParentIndexNumber?: number;
  SeriesTimerId?: string;
  TimerId?: string;
  ExternalId?: string;
  ExternalEpgRequest?: string;
  ExternalChannelId?: string;
  ChannelImageUrl?: string;
  ImageUrl?: string;
  ThumbnailImageUrl?: string;
  ProgramImageUrl?: string;
  IsOffline?: boolean;
  MediaType?: string;
  Tags?: string[];
  OriginalTitle?: string;
  CriticRating?: number;
}

export interface LiveTvOptions {
  EnableRecordingDeficiencyData?: boolean;
  EnableAutoCollections?: boolean;
  EnablePeopleEpg?: boolean;
  GroupProgramsBySeries?: boolean;
  PrePaddingMinutes?: number;
  PostPaddingMinutes?: number;
  DefaultListingQuantity?: number;
  SaveRecordingInMediaLibrary?: boolean;
  RemoteClientUserAgent?: string;
  GuideDays?: number;
}

export interface DlnaProfile {
  Id?: string;
  Name?: string;
  Type?: string;
  Enabled?: boolean;
  Description?: string;
  Identification?: Identification;
  FriendlyNames?: string[];
  Manufacturer?: string;
  ManufacturerUrl?: string;
  ModelDescription?: string;
  ModelName?: string;
  ModelNumber?: string;
  ModelUrl?: string;
  SerialNumber?: string;
  AlbumArtPn?: string;
  DatabaseUuid?: string;
  Devices?: DlnaDevice[];
}

export interface Identification {
  Manufacturer?: string;
  ManufacturerUrl?: string;
  ModelDescription?: string;
  ModelName?: string;
  ModelNumber?: string;
  ModelUrl?: string;
  SerialNumber?: string;
}

export interface DlnaDevice {
  Name?: string;
  Description?: string;
  Manufacturer?: string;
  ModelDescription?: string;
  ModelName?: string;
  ModelNumber?: string;
  FirmwareRevision?: string;
  SerialNumber?: string;
}

export interface ActivityLogEntry {
  Name?: string;
  ShortOverview?: string;
  Overview?: string;
  Type?: string;
  ItemId?: string;
  UserId?: string;
  UserPrimaryImageTag?: string;
  Date?: string;
  Severity?: string;
}

export interface ScheduledTaskDto {
  Name?: string;
  Key?: string;
  Description?: string;
  Category?: string;
  IsHidden?: boolean;
  IsEnabled?: boolean;
  IsInteractive?: boolean;
  CurrentState?: TaskState;
  Progress?: number;
  LastExecutionPoint?: number;
}

export enum TaskState {
  Idle = 'Idle',
  Running = 'Running',
  Cancelling = 'Cancelling',
  Available = 'Available'
}

export interface TaskTriggerInfo {
  Type?: string;
  TimeOfDayTicks?: number;
  IntervalTicks?: number;
  DayOfWeek?: number;
  DayTicks?: number;
}

export interface NotificationDto {
  Name?: string;
  Description?: string;
  NotificationType?: string;
  Category?: string;
  ItemId?: string;
  ItemName?: string;
  UserId?: string;
  UserName?: string;
  NotificationLevel?: NotificationLevel;
  Date?: string;
}

export enum NotificationLevel {
  Normal = 'Normal',
  Warning = 'Warning',
  Error = 'Error'
}

export interface PluginInfo {
  Id?: string;
  Name?: string;
  Description?: string;
  Status?: PluginStatus;
  Version?: string;
  ConfigurationUrl?: string;
  StatusMessage?: string;
}

export enum PluginStatus {
  Active = 'Active',
  Deactivated = 'Deactivated',
  Error = 'Error',
  RestartRequired = 'RestartRequired',
  InvalidSignature = 'InvalidSignature'
}

export interface PackageInfo {
  name?: string;
  description?: string;
  owners?: string[];
  category?: string;
  isRegistered?: boolean;
  installedVersion?: string;
  latestVersion?: string;
  targetSystems?: string[];
  previewFiles?: PackageFileInfo[];
  registrations?: RegistrationInfo[];
  repository?: string;
  linkParameters?: string;
}

export interface PackageFileInfo {
  type?: string;
  arch?: string;
  os?: string;
  version?: string;
  runAs?: string;
  sourceUrl?: string;
  checksumUrl?: string;
  targetFilename?: string;
  isPriority?: boolean;
  infoUrl?: string;
  developmentVersion?: boolean;
}

export interface RegistrationInfo {
  name?: string;
  productId?: string;
  expires?: string;
}

export interface DisplayPreferences {
  Id?: string;
  UserId?: string;
  Client?: string;
  CustomPrefs?: Record<string, string>;
}

export interface SyncData {
  TargetId?: string;
  ItemIds?: string[];
  SyncNewContent?: boolean;
}

export interface SyncJob {
  Id?: string;
  ProfileId?: string;
  TargetId?: string;
  Status?: SyncJobStatus;
  Progress?: number;
  ItemCount?: number;
  DateCreated?: string;
  DateModified?: string;
  LastSyncTime?: string;
}

export enum SyncJobStatus {
  Queued = 'Queued',
  Converting = 'Converting',
  Transferring = 'Transferring',
  Completed = 'Completed',
  CompletedWithError = 'CompletedWithError',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
}

export interface RemoteImageInfo {
  ProviderName?: string;
  Url?: string;
  ThumbnailUrl?: string;
  Width?: number;
  Height?: number;
  CommunityRating?: number;
  VoteCount?: number;
  Name?: string;
  Type?: RemoteImageType;
  primary?: boolean;
}

export enum RemoteImageType {
  Primary = 'Primary',
  BoxArt = 'BoxArt',
  Backdrop = 'Backdrop',
  Banner = 'Banner',
  Disc = 'Disc',
  Logo = 'Logo',
  Menu = 'Menu',
  Chapter = 'Chapter',
  BoxRear = 'BoxRear',
  Art = 'Art'
}
