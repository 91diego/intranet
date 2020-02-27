import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prototipo } from '../interfaces/prototipo';
import { Desarrollo } from '../interfaces/desarrollo';
import { HttpClient } from '@angular/common/http';
import { PrototipoService } from '../services/prototipo.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment, position } from './../../environments/environment';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  // PUESTO DEL USUARIO, SE UTILIZA PARA REGRESAR A LA TURA HOME
  workPosition;

  constructor(private ngxService: NgxUiLoaderService) {

    this.workPosition = position.work_position;
    console.log('Puesto desde la configuracion: ' + this.workPosition);
   }

  ngOnInit() {
    this.ngxService.start(); // start foreground loading with 'default' id

    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground loading with 'default' id
    }, 7000);
    $( () => {

      /* MUESTRA DATOS DE LOS PROTOTIPOS */
      $('#check_menu_prototipo').on('change', () => {

        console.log($('#check_piso').val());
        if ( $('#check_menu_prototipo').is(':checked') ) {
          $('#param_precio').show();
        } else {
          $('#param_precio').hide();
        }
      });
      /* FIN MUESTRA DATOS DE LOS PROTOTIPOS */

      /* MUESTRA DATOS DE LOS PISOS */
      $('#check_menu_piso').on('change', () => {

        console.log($('#check_menu_piso').val());
        if ( $('#check_menu_piso').is(':checked') ) {
          $('#param_piso').show();
        } else {
          $('#param_piso').hide();
        }
      });
      /* FIN MUESTRA DATOS DE LOS PISOS */

      /* MUESTRA DATOS DEL SUPUESTO DE VENTA */
      $('#check_menu_supuesto_venta').on('change', () => {

        console.log($('#check_menu_supuesto_venta').val());
        if ( $('#check_menu_supuesto_venta').is(':checked') ) {
          $('#param_venta').show();
        } else {
          $('#param_venta').hide();
        }
      });
      /* FIN MUESTRA DATOS DEL SUPUESTO DE VENTA */

      /* MUESTRA DATOS DEL SUPUESTO DE MERCADO */
      $('#check_menu_supuesto_mercado').on('change', () => {

        console.log($('#check_menu_supuesto_mercado').val());
        if ( $('#check_menu_supuesto_mercado').is(':checked') ) {
          $('#param_mercado').show();
        } else {
          $('#param_mercado').hide();
        }
      });
      /* FIN MUESTRA DATOS DEL SUPUESTO DE MERCADO */

      /* MUESTRA DATOS DEL SUPUESTO HIPOTECARIO */
      $('#check_menu_supuesto_hipotecario').on('change', () => {

        console.log($('#check_menu_supuesto_hipotecario').val());
        if ( $('#check_menu_supuesto_hipotecario').is(':checked') ) {
          $('#param_hipotecario').show();
        } else {
          $('#param_hipotecario').hide();
        }
      });
      /* FIN MUESTRA DATOS DEL SUPUESTO HIPOTECARIO */

      /* MUESTRA DATOS DEL SUPUESTO DE OBRA */
      $('#check_menu_supuesto_obra').on('change', () => {

        console.log($('#check_menu_supuesto_obra').val());
        if ( $('#check_menu_supuesto_obra').is(':checked') ) {
          $('#param_obra').show();
        } else {
          $('#param_obra').hide();
        }
      });
      /* FIN MUESTRA DATOS DEL SUPUESTO DE OBRA */

      /* MUESTRA DATOS DE LOS SUPUESTOS DE COMPRA */
      $('#check_menu_supuesto_compra').on('change', () => {

        console.log($('#check_menu_supuesto_compra').val());
        if ( $('#check_menu_supuesto_compra').is(':checked') ) {
          $('#param_compra').show();
        } else {
          $('#param_compra').hide();
        }
      });
      /* FIN MUESTRA DATOS DE LOS SUPUESTOS DE COMPRA */

      /* MUESTRA DATOS DE PLUSVALIA */
      $('#check_menu_plusvalia').on('change', () => {

        console.log($('#check_menu_plusvalia').val());
        if ( $('#check_menu_plusvalia').is(':checked') ) {
          $('#param_plusvalia').show();
        } else {
          $('#param_plusvalia').hide();
        }
      });
      /* FIN MUESTRA DATOS DE PLUSVALIA */

    });
  }

}
