import { Component, OnInit } from '@angular/core';
import { DesarrolloService } from '../services/desarrollo.service';
import { HttpClient } from '@angular/common/http';
import { Desarrollo } from '../interfaces/desarrollo';
import { Prototipo } from '../interfaces/prototipo';
import * as $ from 'jquery';
import { SnotifyService } from 'ng-snotify';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment, position } from '../../environments/environment';

@Component({
  selector: 'app-parametros-calculadora',
  templateUrl: './parametros-calculadora.component.html',
  styleUrls: ['./parametros-calculadora.component.css']
})
export class ParametrosCalculadoraComponent implements OnInit {

  // API_ENDPOINT = 'http://127.0.0.1:8000/api';
  API_ENDPOINT = 'https://administracion.idex.cc/api';

  // GUARDA LOS DATOS DEL DESARROLLO OBTENIDOS DE LA RESPUESTA GET DEL API
  desarrollos: Desarrollo[];
  prototipos: Prototipo[];

  // GUARDA LOS DATOS DEL FORMULARIO QUE SERAN ENVIADOS AL METODO POST DE LA API
  datos: Desarrollo = {
    nombre: null,
    precio_inicial: null,
    fecha_inicio_obra: null
  };

  valorId = 'Selecciona el desarrollo';
  // GUARDA LOS VALUES DE LOS CHECKS
  checkNuevoDesarrollo;
  checkReplicarConfiguracion;
  // PUESTO DEL USUARIO, SE UTILIZA PARA REGRESAR A LA TURA HOME
  workPosition;

  constructor(private desarrolloService: DesarrolloService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService,
              private ngxService: NgxUiLoaderService) {

                this.actualizarListaDesarrollos();
                this.workPosition = position.work_position;
                console.log('Puesto desde los parametos: ' + this.workPosition);
  }

  ngOnInit() {
    this.ngxService.start(); // start foreground loading with 'default' id

    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground loading with 'default' id
    }, 2000);
    $( () => {

      /* VALIDA SELECCION DE DESARROLLO */
      if($('#select_desarrollo').val() === null) {

        $('#config_desarrollo').hide();
      }
      /* FIN VALIDA SELECCION DEL DESARROLLO */

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR DESARROLLOS */
      $('#check_desarrollo').on('change', () => {

        if( $('#check_desarrollo').is(':checked') ) {
          $('#agregar_desarrollo').show();
        } else {
          $('#agregar_desarrollo').hide();
          $('#check_configuracion').prop('checked', false);
          $('#replicar_config').hide();
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR DESARROLLOS */

      /* VISIBILIDAD REPLICAR CONFIGURACION */
      $('#check_configuracion').on('change', () => {

        if( $('#check_configuracion').is(':checked') ) {
          $('#replicar_config').show();
        } else {
          $('#replicar_config').hide();
        }
      });
      /* FIN VISIBILIDAD REPLICAR CONFIGURACION */

      /* MOSTRAR PARAMETROS */
      $('#select_desarrollo').on('change', () => {

        let desarrollo: any;
        desarrollo = $('#select_desarrollo').val();
        if(desarrollo != null) {

          $('#config_desarrollo').show();
        }
      });
      /* FIN MOSTRAR PARAMETROS */

    });
  }

  // METODO QUE ACTUALIZA LA LISTA
  actualizarListaDesarrollos() {

    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos').subscribe( (data: Desarrollo[]) => {
      this.desarrollos = data;
    } );
  }

  // METODO QUE AGREGA DESARROLLOS
  agregarDesarrollo() {

  console.log(this.datos);
  this.desarrolloService.guardar(this.datos).subscribe(
    data => this.handleResponse(data),
    error => this.handleError(error)
    );
  }

   // Respuesta
   handleResponse(data) {
    this.notificacion.success('El desarrollo ha sido agregado');
    this.datos.nombre = null;
    this.datos.precio_inicial = null;
    this.datos.fecha_inicio_obra = null;
    this.actualizarListaDesarrollos();
    console.log(data);
  }
  // Manejo de errores
  handleError(error) {
    this.notificacion.error('Ha ocurrido un error al agregar el desarrollo');
    console.log(error);
  }
}
