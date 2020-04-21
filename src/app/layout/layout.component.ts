import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment, position } from './../../environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private activateRoute: ActivatedRoute) {
    position.work_position = this.activateRoute.snapshot.paramMap.get('workPosition');
    console.log(position.work_position);
   }

  ngOnInit() {
  }

}
