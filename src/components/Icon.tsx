import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import mediumWeight from 'expo-symbols/androidWeights/medium';
import type { ColorValue } from 'react-native';

import { colors } from '@/theme';

/**
 * Semantic icon names used across the app.
 *
 * Every icon resolves to a Material Symbol on Android/web (matching the Stitch
 * designs, which use Material Symbols) and an SF Symbol on iOS. Keeping the map
 * here means swapping icon libraries later touches exactly one file.
 */
export const icons = {
  // Navigation
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  inbox: { ios: 'tray.fill', android: 'inbox', web: 'inbox' },
  notifications: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  profile: { ios: 'person.fill', android: 'person', web: 'person' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  forward: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  expand: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  more: { ios: 'ellipsis', android: 'more_vert', web: 'more_vert' },
  logout: {
    ios: 'rectangle.portrait.and.arrow.right',
    android: 'logout',
    web: 'logout',
  },

  // Brand / status
  truck: { ios: 'truck.box.fill', android: 'local_shipping', web: 'local_shipping' },
  help: { ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' },
  error: { ios: 'exclamationmark.circle', android: 'error', web: 'error' },
  warning: {
    ios: 'exclamationmark.triangle.fill',
    android: 'warning',
    web: 'warning',
  },
  success: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  pending: { ios: 'clock', android: 'pending', web: 'pending' },
  verified: { ios: 'checkmark.seal', android: 'verified_user', web: 'verified_user' },

  // Auth
  qr: { ios: 'qrcode.viewfinder', android: 'qr_code_scanner', web: 'qr_code_scanner' },
  barcode: { ios: 'barcode.viewfinder', android: 'barcode_scanner', web: 'barcode_scanner' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
  visible: { ios: 'eye', android: 'visibility', web: 'visibility' },
  hidden: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  refresh: {
    ios: 'arrow.triangle.2.circlepath',
    android: 'refresh',
    web: 'refresh',
  },

  // Trip / ops
  route: { ios: 'map', android: 'route', web: 'route' },
  calendar: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  schedule: { ios: 'clock', android: 'schedule', web: 'schedule' },
  location: { ios: 'location.fill', android: 'location_on', web: 'location_on' },
  gps: { ios: 'location.fill', android: 'gps_fixed', web: 'gps_fixed' },
  cargo: { ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' },
  vehicle: { ios: 'car.fill', android: 'directions_car', web: 'directions_car' },
  fuel: { ios: 'fuelpump.fill', android: 'local_gas_station', web: 'local_gas_station' },
  fuelCard: { ios: 'creditcard', android: 'credit_card', web: 'credit_card' },
  odometer: { ios: 'speedometer', android: 'speed', web: 'speed' },
  defect: { ios: 'wrench.and.screwdriver', android: 'build', web: 'build' },
  checklist: {
    ios: 'list.bullet.clipboard',
    android: 'fact_check',
    web: 'fact_check',
  },
  assignment: { ios: 'doc.plaintext', android: 'assignment', web: 'assignment' },
  document: { ios: 'doc.text', android: 'description', web: 'description' },
  camera: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  signature: { ios: 'signature', android: 'draw', web: 'draw' },
  edit: { ios: 'square.and.pencil', android: 'edit', web: 'edit' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  filter: {
    ios: 'line.3.horizontal.decrease',
    android: 'filter_list',
    web: 'filter_list',
  },
  sync: { ios: 'arrow.clockwise', android: 'sync', web: 'sync' },
  online: { ios: 'wifi', android: 'wifi', web: 'wifi' },
  trendingUp: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up', web: 'trending_up' },
  trendingDown: { ios: 'chart.line.downtrend.xyaxis', android: 'trending_down', web: 'trending_down' },
  cloudDone: { ios: 'checkmark.icloud', android: 'cloud_done', web: 'cloud_done' },
  performance: { ios: 'speedometer', android: 'trending_up', web: 'trending_up' },
  history: { ios: 'clock', android: 'history', web: 'history' },
  receipt: { ios: 'doc.plaintext', android: 'receipt_long', web: 'receipt_long' },
  // Auth extras
  key: { ios: 'key', android: 'key', web: 'key' },
  chat: { ios: 'message', android: 'chat', web: 'chat' },
  dialpad: { ios: 'circle.grid.3x3', android: 'dialpad', web: 'dialpad' },
  messageUnread: {
    ios: 'ellipsis.message',
    android: 'mark_chat_unread',
    web: 'mark_chat_unread',
  },
  flash: { ios: 'flashlight.on.fill', android: 'flash_on', web: 'flash_on' },
  scan: { ios: 'viewfinder', android: 'filter_center_focus', web: 'filter_center_focus' },
  support: { ios: 'person.wave.2', android: 'support_agent', web: 'support_agent' },
  idCard: { ios: 'person.text.rectangle', android: 'badge', web: 'badge' },
  phone: { ios: 'phone.fill', android: 'call', web: 'call' },
  emergency: { ios: 'staroflife.fill', android: 'emergency', web: 'emergency' },
  contactCard: { ios: 'person.crop.rectangle', android: 'contact_page', web: 'contact_page' },
  timeline: {
    ios: 'point.topleft.down.to.point.bottomright.curvepath',
    android: 'timeline',
    web: 'timeline',
  },
  wifi: { ios: 'wifi', android: 'wifi', web: 'wifi' },
  hourglass: { ios: 'hourglass', android: 'hourglass_empty', web: 'hourglass_empty' },
  sliders: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  image: { ios: 'photo', android: 'image', web: 'image' },
  bookmark: { ios: 'bookmark', android: 'bookmark', web: 'bookmark' },
  flag: { ios: 'flag', android: 'flag', web: 'flag' },

  // Profile hub destinations
  analytics: {
    ios: 'chart.line.uptrend.xyaxis',
    android: 'analytics',
    web: 'analytics',
  },
  wallet: { ios: 'wallet.pass', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  payments: { ios: 'dollarsign.circle', android: 'payments', web: 'payments' },
  health: { ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' },
  award: { ios: 'medal.fill', android: 'workspace_premium', web: 'workspace_premium' },
  school: { ios: 'graduationcap', android: 'school', web: 'school' },
  report: { ios: 'exclamationmark.bubble', android: 'report', web: 'report' },
  shield: { ios: 'checkmark.shield.fill', android: 'gpp_good', web: 'gpp_good' },

  // Trip flow extras
  map: { ios: 'map', android: 'map', web: 'map' },
  distance: { ios: 'ruler', android: 'straighten', web: 'straighten' },
  pin: { ios: 'mappin', android: 'pin_drop', web: 'pin_drop' },
  recenter: { ios: 'location.fill', android: 'my_location', web: 'my_location' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  cancel: { ios: 'xmark.circle', android: 'cancel', web: 'cancel' },
  note: { ios: 'note.text', android: 'edit_note', web: 'edit_note' },
  chatBubble: { ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' },
  upload: { ios: 'icloud.and.arrow.up', android: 'cloud_upload', web: 'cloud_upload' },
  taskDone: { ios: 'checklist', android: 'task_alt', web: 'task_alt' },
  play: { ios: 'play.circle', android: 'play_circle', web: 'play_circle' },
  send: { ios: 'paperplane.fill', android: 'send', web: 'send' },
  arrowUp: { ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' },
  save: { ios: 'square.and.arrow.down', android: 'save', web: 'save' },
  workOrder: { ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' },

  // Batch 3 — fuel, telemetry, assets, safety
  temperature: { ios: 'thermometer.medium', android: 'device_thermostat', web: 'device_thermostat' },
  humidity: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' },
  tire: { ios: 'circle.dotted', android: 'tire_repair', web: 'tire_repair' },
  repeat: { ios: 'arrow.2.squarepath', android: 'event_repeat', web: 'event_repeat' },
  navigation: { ios: 'location.north.fill', android: 'navigation', web: 'navigation' },
  nearMe: { ios: 'location.circle', android: 'near_me', web: 'near_me' },
  timer: { ios: 'timer', android: 'timer', web: 'timer' },
  power: { ios: 'power', android: 'power_settings_new', web: 'power_settings_new' },
  sensors: { ios: 'sensor.tag.radiowaves.forward', android: 'sensors', web: 'sensors' },
  contactless: { ios: 'wave.3.right', android: 'contactless', web: 'contactless' },
  headset: { ios: 'headphones', android: 'headset_mic', web: 'headset_mic' },
  routeAlt: { ios: 'arrow.triangle.branch', android: 'alt_route', web: 'alt_route' },
  bolt: { ios: 'bolt.fill', android: 'bolt', web: 'bolt' },
  speed: { ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' },
  delete: { ios: 'trash', android: 'delete', web: 'delete' },
  expandLess: { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' },
  road: { ios: 'road.lanes', android: 'add_road', web: 'add_road' },
} as const satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: SymbolViewProps['style'];
}

export function Icon({ name, size = 24, color = colors.ink, style }: IconProps) {
  return (
    <SymbolView
      name={icons[name]}
      size={size}
      tintColor={color}
      weight={{ ios: 'medium', android: mediumWeight }}
      style={[{ width: size, height: size }, style]}
    />
  );
}
