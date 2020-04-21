import { Component, OnInit } from '@angular/core';
import { position } from './../../../environments/environment';

@Component({
  selector: 'app-mis-comisiones',
  templateUrl: './mis-comisiones.component.html',
  styleUrls: ['./mis-comisiones.component.css']
})
export class MisComisionesComponent implements OnInit {

  workPosition;
  constructor() {

    this.workPosition = position.work_position;
    console.log('Mis comisiones: ' + this.workPosition);
  }

  ngOnInit() {

    $( () => {

      // BUSQUEDA ELEMENTO
      $('#tableSearch').on('keyup', function() {
        let value: any;
        value = $(this).val().toLowerCase();
        $('#myTable tr').filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
      // FIN BUSQUEDA ELEMENTO

    });
  }

}
