export interface Room {
    id: string; // e.g., '101', '1001'
    floor: number; // 1..10
    pos: number; // leftmost is 1
    occupied: boolean;
}