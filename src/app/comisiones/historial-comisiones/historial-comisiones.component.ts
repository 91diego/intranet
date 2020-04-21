import { Component, OnInit } from '@angular/core';
import { position } from './../../../environments/environment';

@Component({
  selector: 'app-historial-comisiones',
  templateUrl: './historial-comisiones.component.html',
  styleUrls: ['./historial-comisiones.component.css']
})
export class HistorialComisionesComponent implements OnInit {

  workPosition;
  constructor() {

    this.workPosition = position.work_position;
    console.log('Mis comisiones historico: ' + this.workPosition);
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
