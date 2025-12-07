import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Room } from '../../models/room.model';


@Component({
  selector: 'app-room-grid',
  templateUrl: './room-grid.component.html',
  styleUrls: ['./room-grid.component.scss']
})
export class RoomGridComponent {
  @Input() rooms: Room[] = [];
  @Input() selectedIds: string[] = [];
  @Output() toggle = new EventEmitter<string>();

  floors(): number[] {
    return Array.from({ length: 10 }, (_, i) => 10 - i);
  }

  roomsByFloor(floor: number): Room[] {
    return this.rooms.filter(r => r.floor === floor).sort((a, b) => a.pos - b.pos);
  }

  classFor(r: Room) {
    if (this.selectedIds.includes(r.id)) return 'room selected';
    if (r.occupied) return 'room booked';
    return 'room available';
  }

  onToggle(id: string) { this.toggle.emit(id); }
}