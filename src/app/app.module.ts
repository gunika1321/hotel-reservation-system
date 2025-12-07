import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { RoomGridComponent } from './components/room-grid/room-grid.component';
import { BookingControlsComponent } from './components/booking-controls/booking-controls.component';


import { BookingService } from './services/booking.service';


@NgModule({
  declarations: [AppComponent, RoomGridComponent, BookingControlsComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [BookingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
