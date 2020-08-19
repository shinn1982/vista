export const VERSION = 'Version.2020.4.1';
export const FOOTER_INFO = 'Copyright 2020 Cisco Systems, Inc. All rights reserved.';
export const DEVICE_RESULT_DIC = {
  'N/A': '未配置',
  'checking': '检查中',
  'true': '通过',
  'false': '未通过',
  'unchecked': '未检查'
};
export const RESULT_DIC = {
  'N/A': '未配置',
  'checking': '检查中',
  'true': '通过',
  'false': '未通过',
  'unchecked': '未检查'
};

export const FSM_STATUS_DIC = {
  ESTABLISHED: 'ESTABLISHED',
  IDLE: 'IDLE',
  OPEN: 'IDLE',
  CONNECT: 'IDLE'
};

export const PROTOCOLS = {
  1: 'IS-IS Level 1',
  2: 'IS-IS Level 2',
  3: 'OSPFv2',
  4: 'Direct',
  5: 'Static Configuration',
  6: 'OSPFv3'
};
export const CONTAINER_STATUS_DIC = {
  creating: 'CREATING',
  created: 'CREATED',
  starting: 'STARTING',
  running: 'RUNNING',
  stopping: 'STOPPING',
  exited: 'EXITED',
  error: 'ERROR',
  deleting: 'DELETING'
};
export const AFI_SAFI_DIC = {
  'flowspec': 'FSv4',
  'ipv4': 'v4',
  'ipv4_unicast': 'v4',
  'vpnv4': 'VPNv4',
  'ipv4_srte': 'SRv4',
  'bgpls': 'LS'
};
export const POLICY_STATUS_DIC = {
  'inactive_created': '未运行（新创建）',
  'inactive_stop': '未运行（已停止）',
  'inactive_failed': '未运行（运行失败）',
  'inactive_withdraw': '未运行（已撤销）',
  'active': '运行中',
  'active_partial': '运行中（部分下发）',
  'inactive_ready': '运行中（准备中）',
  'in_deploying': '重部署中',
  'in_withdrawing': '撤销中',
  'in_advertising': '激活中',
  'failed': '失败'
};
export const CONDITION_ACTION_STATUS_DIC = {
  'active': '已激活',
  'advertise_failed': '下发失败',
  'withdraw_failed': '撤销失败',
  'inactive': '未激活'
};

export const FACILITY_TYPE_DIC = {
  'session': '目标Session',
  'device': '目标设备',
  'session group': '目标Session Group',
  'device group': '目标设备Group'
};

export const CPathColors = ['#03dac6', '#93c913', '#03dac6', '#018786', '#8e7cc3', '#6200ee', '#3700b3'];
export const ChartSeriesColors = ['#439efc', '#f44336', '#673ab7', '#00bcd4', '#e91e63', '#cddc39',
'#009688', '#9c27b0', '#ffc107', '#ffeb3b', '#ff5722', '#795548'];

export const DEFAULT_LINK_WIDTH = 8;
