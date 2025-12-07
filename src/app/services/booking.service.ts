import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';

@Injectable()
export class BookingService {
    constructor() { }


    generateRooms(): Room[] {
        let rooms: Room[] = [];
        for (let f = 1; f <= 9; f++) {
            for (let r = 1; r <= 10; r++) {
                rooms.push({ id: (f * 100 + r).toString(), floor: f, pos: r, occupied: false });
            }
        }
        for (let r = 1; r <= 7; r++) {
            rooms.push({ id: (1000 + r).toString(), floor: 10, pos: r, occupied: false });
        }
        return rooms;
    }
    travelTime(a: Room, b: Room): number {
        if (a.floor === b.floor) return Math.abs(a.pos - b.pos) * 1;
        let toStairs = Math.abs(a.pos - 1);
        let floors = Math.abs(a.floor - b.floor);
        let vertical = floors * 2;
        let fromStairs = Math.abs(b.pos - 1);
        return toStairs + vertical + fromStairs;
    }


    minimalVisitCost(set: Room[]): number {
        if (set.length <= 1) return 0;
        let perms = this.permute(set);
        let best = Infinity;
        for (let p of perms) {
            let cost = 0;
            for (let i = 0; i < p.length - 1; i++) cost += this.travelTime(p[i], p[i + 1]);
            if (cost < best) best = cost;
        }
        return best;
    }
    private permute(arr: Room[]): Room[][] {
        let res: Room[][] = [];
        let used = new Array(arr.length).fill(false);
        let cur: Room[] = [];
        let dfs = () => {
            if (cur.length === arr.length) { res.push(cur.slice()); return; }
            for (let i = 0; i < arr.length; i++) {
                if (used[i]) continue;
                used[i] = true; cur.push(arr[i]); dfs(); cur.pop(); used[i] = false;
            }
        };
        dfs(); return res;
    }
    // combination utility
    combinations<T>(arr: T[], k: number): T[][] {
        let res: T[][] = [];
        let cur: T[] = [];
        let dfs = (i: number) => {
            if (cur.length === k) { res.push(cur.slice()); return; }
            if (i >= arr.length) return;
            cur.push(arr[i]); dfs(i + 1); cur.pop(); dfs(i + 1);
        };
        dfs(0); return res;
    }


    findBestRooms(available: Room[], k: number): Room[] {
        let byFloor: Record<number, Room[]> = {};
        for (let r of available) { (byFloor[r.floor] ||= []).push(r); }


        let bestSame: { rooms: Room[]; cost: number } | null = null;
        for (let f of Object.keys(byFloor)) {
            let arr = byFloor[+f];
            if (arr.length >= k) {
                let combos = this.combinations(arr, k);
                for (let c of combos) {
                    let cost = this.minimalVisitCost(c);
                    if (!bestSame || cost < bestSame.cost) bestSame = { rooms: c, cost };
                }
            }
        }
        if (bestSame) return bestSame.rooms;


        let n = available.length;
        let dist: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) dist[i][j] = this.travelTime(available[i], available[j]);


        let best: { rooms: Room[] | null; cost: number } = { rooms: null, cost: Infinity };
        let maxBranch = 6;
        for (let s = 0; s < n; s++) {
            let stack: { indices: number[]; used: Set<number> }[] = [{ indices: [s], used: new Set([s]) }];
            while (stack.length) {
                let node = stack.pop()!;
                if (node.indices.length === k) {
                    let setRooms = node.indices.map(i => available[i]);
                    let cost = this.minimalVisitCost(setRooms);
                    if (cost < best.cost) best = { rooms: setRooms, cost };
                    continue;
                }
                let last = node.indices[node.indices.length - 1];
                let options = available.map((_, idx) => ({ idx, d: dist[last][idx] }))
                    .filter(x => !node.used.has(x.idx))
                    .sort((a, b) => a.d - b.d)
                    .slice(0, maxBranch);
                for (let opt of options) {
                    let used2 = new Set(node.used);
                    used2.add(opt.idx);
                    stack.push({ indices: [...node.indices, opt.idx], used: used2 });
                }
            }
        }
        if (!best.rooms) return available.slice(0, k);
        return best.rooms;
    }
}