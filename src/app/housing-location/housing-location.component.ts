import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './housing-location.component.html',
  styleUrls: ['./housing-location.component.css'],
})

export class HousingLocationComponent {
  @Input() housingLocation!: HousingLocation;

  cuoreVuoto = true;

  get cuoreIcon(): string {
    return this.cuoreVuoto ? 'far fa-heart' : 'fas fa-heart';
  }

  toggleCuore(): void {
    this.cuoreVuoto = !this.cuoreVuoto;
  }
}
