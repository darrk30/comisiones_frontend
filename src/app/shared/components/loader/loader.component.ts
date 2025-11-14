import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class LoaderComponent implements OnInit {

	loading: boolean = true;

	constructor() {

	}

	ngOnInit(): void {
	}

}
