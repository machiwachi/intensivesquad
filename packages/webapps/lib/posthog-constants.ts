// PostHog 用户属性常量
export const USER_PROPERTIES = {
  WALLET_ADDRESS: "wallet_address",
  AUTH_METHOD: "auth_method",
  LOGIN_TIMESTAMP: "login_timestamp",
  LAST_ACTIVE: "last_active",
  TEAM_ID: "team_id",
  TEAM_NAME: "team_name",
  USER_ROLE: "user_role",
  TOTAL_SCORE: "total_score",
  RANK: "rank",
} as const;

// PostHog 事件类型
export const POSTHOG_EVENTS = {
  // 认证相关事件
  USER_SIGNED_IN: "user_signed_in",
  USER_SIGNED_OUT: "user_signed_out",
  WALLET_CONNECTED: "wallet_connected",
  WALLET_DISCONNECTED: "wallet_disconnected",

  // 用户属性更新事件
  USER_PROFILE_UPDATED: "user_profile_updated",
  TEAM_JOINED: "team_joined",
  TEAM_LEFT: "team_left",

  // 现有事件（保持向后兼容）
  CTA_CLICKED: "cta_clicked",
  EXTERNAL_LINK_CLICKED: "external_link_clicked",
  LEADERBOARD_CLAN_VIEWED: "leaderboard_clan_viewed",
  IDO_REWARD_CLAIMED: "ido_reward_claimed",
  IDO_RULES_VIEWED: "ido_rules_viewed",
  STORE_ITEM_PURCHASED: "store_item_purchased",
  PROPOSAL_VOTED: "proposal_voted",
  KIOSK_CREDIT_REQUESTED: "kiosk_credit_requested",
  KIOSK_CREDIT_TRANSACTIONS_RECEIVED: "kiosk_credit_transactions_received",
  CONNECT_WALLET_CLICKED: "connect-wallet-clicked",
  CLAN_CREATION_SUBMITTED: "clan_creation_submitted",
  CLAN_CREATION_CANCELLED: "clan_creation_cancelled",
  CLAN_JOINED: "clan_joined",
  CLAN_LEFT: "clan_left",
  LEADERBOARD_OPENED: "leaderboard_opened",
  CREATE_CLAN_BUTTON_CLICKED: "create_clan_button_clicked",
} as const;

// 认证方法常量
export const AUTH_METHODS = {
  SIWE: "siwe",
  EMAIL: "email",
  SOCIAL: "social",
} as const;

// 用户角色常量
export const USER_ROLES = {
  MEMBER: "member",
  LEADER: "leader",
  ADMIN: "admin",
} as const;

// 类型定义
export type UserProperty =
  (typeof USER_PROPERTIES)[keyof typeof USER_PROPERTIES];
export type PostHogEvent = (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS];
export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
