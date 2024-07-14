import { ESlotSize, EVehicleType } from "../constants";

export interface IParkingSlot {
  id: number;
  distances: number[];
  size: `${ESlotSize}`;
  isOccupied: boolean;
}

export interface IVechicle {
  size: `${EVehicleType}`;
  entryTime: Date;
  exitTime?: Date;
  slot?: IParkingSlot;
}
