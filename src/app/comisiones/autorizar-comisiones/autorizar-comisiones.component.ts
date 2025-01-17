import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autorizar-comisiones',
  templateUrl: './autorizar-comisiones.component.html',
  styleUrls: ['./autorizar-comisiones.component.css']
})
export class AutorizarComisionesComponent implements OnInit {

  constructor() { }

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
