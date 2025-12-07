import { Component } from '@angular/core';
import { BookingService } from './services/booking.service';
import { Room } from './models/room.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rooms: Room[] = [];
  selectedIds: string[] = [];
  message = '';

  constructor(private bookingService: BookingService) {
    this.rooms = this.bookingService.generateRooms();
  }

  toggleRoom(id: string) {
    let idx = this.rooms.findIndex(r => r.id === id);
    if (idx >= 0) this.rooms[idx].occupied = !this.rooms[idx].occupied;
    this.selectedIds = [];
    this.message = '';
  }

  doRandom() {
    this.rooms = this.rooms.map(r => ({ ...r, occupied: Math.random() < 0.28 }));
    this.selectedIds = [];
    this.message = '';
  }
  doReset() {
    this.rooms = this.bookingService.generateRooms();
    this.selectedIds = [];
    this.message = '';
  }

  doBook(k: number) {
    let available = this.rooms.filter(r => !r.occupied);
    if (available.length < k) { this.message = 'Not enough available rooms.'; return; }
    let best = this.bookingService.findBestRooms(available, k);

    for (let b of best) {
      let idx = this.rooms.findIndex(r => r.id === b.id);
      if (idx >= 0) this.rooms[idx].occupied = true;
    }
    this.selectedIds = best.map(r => r.id);
    let cost = this.bookingService.minimalVisitCost(best);
    this.message = `Booked ${best.length} rooms • minimal travel time ≈ ${cost} min`;
  }
}