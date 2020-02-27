import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment, position } from './../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private activateRoute: ActivatedRoute) {
    position.work_position = this.activateRoute.snapshot.paramMap.get('workPosition');
    console.log(position.work_position);
  }

  ngOnInit() {
  }

}
