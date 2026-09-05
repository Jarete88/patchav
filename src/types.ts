export type SignalCategory = 'input' | 'mixer' | 'destination' | 'converter';

export type CableProtocol = 'HDMI 2.1' | '12G-SDI' | 'FIBRA' | 'DP 1.4';

export type CableDistance = '5m' | '10m' | '15m' | '20m' | '30m' | '50m' | '100m';

export interface SignalNode {
  id: string;
  name: string;
  label: string;
  category: SignalCategory;
  protocol?: string;
  subtext?: string;
  resolution?: string;
  fps?: string;
  icon?: string;
  status?: string;
}

export interface SignalRun {
  id: string;
  name: string;
  input: string;
  mixer: string;
  destination: string;
  converter: string;
  cableType: CableProtocol;
  distance: CableDistance;
  status: 'SYNC LOCKED' | 'STANDBY' | 'ON AIR' | 'NO SYNC';
  wire1Label: string;
  wire2Label: string;
  wire3Label: string;
  resolution: string;
  colorScheme: 'cyan' | 'amber' | 'blue' | 'purple';
  checkedInTruck?: boolean;
}

export interface MatrixRoute {
  id: string;
  inputId: string;
  outputId: string;
  active: boolean;
  locked: boolean;
  protocol: CableProtocol;
  bandwidth: string;
}

export interface Project {
  id: string;
  name: string;
  venue: string;
  rackCode: string;
  date: string;
  runs: SignalRun[];
}
