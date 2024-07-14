import { EntryPoints, ESlotSize } from "./constants";
import { IParkingSlot, IVechicle } from "./types";

const { Small, Medium, Large } = ESlotSize;

const parkingSlots: IParkingSlot[] = [
  { id: 1, distances: [2, 4, 5], size: Small, isOccupied: false },
  { id: 2, distances: [1, 5, 1], size: Small, isOccupied: false },
  { id: 3, distances: [3, 2, 3], size: Medium, isOccupied: false },
  { id: 4, distances: [5, 1, 3], size: Large, isOccupied: false },
];

let parkedVehicle: IVechicle = {} as IVechicle;

const findAvailableParkingSlot = (
  vehicle: IVechicle,
  entryPoint: `${EntryPoints}`
) => {
  const availableParkingSlots = parkingSlots.filter((slot) => {
    if (slot.isOccupied) return false;

    switch (vehicle.size) {
      case "S":
        return true; // S vehicles can park in SP, MP and LP parking spaces;

      case "M":
        return slot.size !== "SP"; //  M vehicles can park in MP and LP parking spaces

      case "L":
        return slot.size === "LP"; // L vehicles can park only in LP parking spaces.

      default:
        return false;
    }
  });

  if (availableParkingSlots?.length) {
    availableParkingSlots.sort(
      (a, b) => a.distances[entryPoint] - b.distances[entryPoint]
    ); /** find a possible and available slot closest to the parking entrance */

    const [assignSlot] = availableParkingSlots;
    assignSlot.isOccupied = true; /** set to occupied slot */

    vehicle.slot = assignSlot;

    return vehicle;
  }

  return undefined;
};

const calculateFee = (vehicle: IVechicle) => {
  if (vehicle && vehicle.exitTime && vehicle.slot) {
    const totalHours = Math.ceil(
      (vehicle.exitTime.getTime() - vehicle.entryTime.getTime()) /
        (1000 * 60 * 60)
    ); /** Parking fees are calculated using rounding up method, e.g. 6.5 hours must be rounded to 7. */

    /**
     * All types of car pay the flat rate of 40 pesos for the first three (3) hours;
     */
    const flatRate = 40;
    if (totalHours <= 3) {
      return flatRate;
    }

    const exceedingHours = totalHours - 3;

    const dailyRate = 5000;
    const wholeDay = Math.floor(
      totalHours / 24
    ); /** round a number downwards to the nearest integer. */

    const remainingHours = totalHours % 24; /** The remainder hours charge */

    // Calculate the exceeding hours
    const hourlyRate = exceedingHourlyRate(exceedingHours, vehicle.slot.size);
    //
    const exceedRate = exceedingHours * hourlyRate;
    //
    const dailyFee = wholeDay * dailyRate + remainingHours;

    const fee = dailyFee + exceedRate + flatRate;

    return fee;
  }

  return 0;
};

/** The exceeding hourly rate beyond the initial three (3) hours will be charged */
const exceedingHourlyRate = (
  exceedingHours: number,
  slotSize: `${ESlotSize}`
) => {
  if (!exceedingHours) return 0;

  switch (slotSize) {
    case "SP":
      return 20; /** 20/hour for vehicles parked in SP */

    case "MP":
      return 60; /**60/hour for vehicles parked in MP */

    case "LP":
      return 100; /** 100/hour for vehicles parked in LP */
  }
};

const parkVehicle = () => {
  // Assign
  const vehicle: IVechicle = { size: "M", entryTime: new Date() };
  const entryPoint: `${EntryPoints}` = "1";

  const parked = findAvailableParkingSlot(vehicle, entryPoint);

  if (parked) {
    parkedVehicle = parked;
    console.log("Vehicle successfully parked!");
  } else {
    console.log("No available parking slot!");
  }
};

const unParkVehicle = () => {
  /**
   * Step 1
   * Create checkout park
   */
  const currentDate = new Date();
  const exitTime = new Date(currentDate);
  // exitTime.setDate(currentDate.getDate() + 1);
  exitTime.setHours(23, 0, 0);
  const vehicle: IVechicle = { ...parkedVehicle, exitTime };

  /**
   * Step 2
   * Calculate fee
   */
  const fee = calculateFee(vehicle);

  console.log(`Parking fee ₱${fee.toFixed(2)} pesos`);
};

parkVehicle();
unParkVehicle();
