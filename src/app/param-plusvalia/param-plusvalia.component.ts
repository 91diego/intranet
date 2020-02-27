import { Component, OnInit } from '@angular/core';
import { Plusvalia } from '../interfaces/plusvalia';
import { PlusvaliaService } from '../services/plusvalia.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-plusvalia',
  templateUrl: './param-plusvalia.component.html',
  styleUrls: ['./param-plusvalia.component.css']
})
export class ParamPlusvaliaComponent implements OnInit {

  id: any;

  // GUARDA INFORMACION QUE SE ENVIARA A LA API POR POST
  datos: Plusvalia = {

    porcentaje_plusvalia: null,
    desarrollo_id: null
  };

  // GUARDA LOS DATOS DE LA PETICION AL METODO GET
  plusvalia: Plusvalia[];

  constructor(private activatedRoute: ActivatedRoute,
              private plusvaliaService: PlusvaliaService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

                this.id = this.activatedRoute.snapshot.params.id;
                this.datos.desarrollo_id = this.id;
                this.obtenerPlusvalia(this.datos.desarrollo_id);
  }

  ngOnInit() {

    $(document).ready( () => {

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR SUPUESTO DE VENTA */
      $('#check_plusvalia').on('change', () => {

        console.log($('#check_plusvalia').val());
        if( $('#check_plusvalia').is(':checked') ) {
          $('#div_agregar_plusvalia').show();
        } else {

          $('#div_agregar_plusvalia').hide();
          $('#porcentaje_plusvalia').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */

      $('#btn_agregar_plusvalia').on('click', () => {

        $('#porcentaje_plusvalia').val('');
      });

    });
  }

  /* CREA PORCENTAJE DE PLUSVALIA */
  crearPlusvalia() {

    console.log('INFORMACION PLUSVALIA');
    console.log(this.datos);
    this.plusvaliaService.guardarPlusvalia(this.datos).subscribe(
      data => this.handleResponse(data, 'agregar_plusvalia'),
      error => this.handleError(error, 'agregar_plusvalia')
    );
  }
  /* FIN CREAR PORCENTAJE PLUSVALIA */

  /* OBTIENE LOS PORCENTAJE DE PLUSVALIA */
  obtenerPlusvalia(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/plusvalia/' + id).subscribe(
      (data: Plusvalia[]) => {
        this.plusvalia = data;
        console.log('INFORMACION PLUSVALIA');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER PORCENTAJES PLUSVALIA */

  /* EDITA PLUSVALIA */
  editarPlusvalia(id: number) {

    console.log(id);
    $('#botones_plusvalia_' + id).show();
    $('#btn_editar_plusvalia_' + id).hide();
    $('#porcentaje_plusvalia_' + id).prop('readonly', false);
    $('#porcentaje_enganche_' + id).prop('readonly', false);
    $('#duracion_credito_' + id).prop('readonly', false);
    $('#tasa_interes_' + id).prop('readonly', false);
    $('#porcentaje_descuento_' + id).prop('readonly', false);
  }
  /* FIN EDITA PLUSVALIA */

  /* GUARDA CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let porcentaje_plusvalia: any = $('#porcentaje_plusvalia_' + id).val();
    this.datos.porcentaje_plusvalia = porcentaje_plusvalia;
    this.datos.id = id;
    console.log(this.datos);
    this.plusvaliaService.editarPlusvalia(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_plusvalia'),
      error => this.handleError(error, 'modificar_plusvalia')
    );
  }
  /* FIN GUARDA CAMBIOS EDICION */

  /* CANCELA CAMBIOS EDICION */
  cancelarCambios(id: number) {

    $('#botones_plusvalia_' + id).hide();
    $('#btn_editar_plusvalia_' + id).show();
    $('#porcentaje_plusvalia_' + id).prop('readonly', true);
    console.log('Cancelando');
  }
  /*FIN CANCELA CAMBIOS EDICION*/

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_plusvalia':
        this.notificacion.success('El valor de la plusvalia ha sido agregado', 'Registro exitoso.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        this.obtenerPlusvalia(this.datos.desarrollo_id);
        this.datos.porcentaje_plusvalia = null;
        break;
      case 'modificar_plusvalia':
        this.notificacion.success('El valor de la plusvalia ha sido modificao', 'Modificacion exitosa.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        $('#porcentaje_plusvalia_' + this.id).prop('readonly', true);
        $('#btn_editar_plusvalia_' + this.id).show();
        $('#botones_plusvalia_' + this.id).hide();
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_plusvalia':
        this.notificacion.error('Error al agregar la plusvalia', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_plusvalia':
        this.notificacion.error('Error al agregar la plusvalia', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
    }
  }

}
