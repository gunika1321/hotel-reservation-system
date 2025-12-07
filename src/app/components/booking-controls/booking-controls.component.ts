import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-booking-controls',
  templateUrl: './booking-controls.component.html',
  styleUrls: ['./booking-controls.component.scss']
})
export class BookingControlsComponent {
  @Input() maxRooms = 5;
  roomsToBook = 1;
  @Output() book = new EventEmitter<number>();
  @Output() randomize = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();


  doBook() { this.book.emit(Math.max(1, Math.min(this.maxRooms, this.roomsToBook))); }
}