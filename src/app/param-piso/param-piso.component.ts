import { Component, OnInit } from '@angular/core';
import { Piso } from '../interfaces/piso';
import {PisoService} from '../services/piso.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-piso',
  templateUrl: './param-piso.component.html',
  styleUrls: ['./param-piso.component.css']
})
export class ParamPisoComponent implements OnInit {

  // ID DEL DESARROLLO
  id: any;
  // GUARDA LOS DATOS DEL DESARROLLO OBTENIDOS DE LA RESPUESTA GET DEL API
  pisos: Piso[];

  // INFORMACION DEL FORMULARIO
  piso: Piso = {
    id: null,
    numero_piso: null,
    descuento: null,
    desarrollo_id: null
  };

  constructor(private activatedRoute: ActivatedRoute,
              private pisoService: PisoService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

    this.id = this.activatedRoute.snapshot.params.id;
    this.piso.desarrollo_id = this.id;
    this.obtenerPiso(this.id);
  }

  ngOnInit() {

    $(document).ready(function() {

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */
      $('#check_piso').on('change', () => {

        console.log($('#check_piso').val());
        if( $('#check_piso').is(':checked') ) {
          $('#div_agregar_piso').show();
        } else {
          $('#div_agregar_piso').hide();
          $('#numero_piso').val('');
          $('#descuento').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */

      $('#btn_agregar_piso').on('click', () => {

        $('#numero_piso').val('');
        $('#descuento').val('');
      });

    });
  }

  /* FUNCION PARA MOSTRAR EL DIV CON LOS BOTONES DE GUARDAR Y CANCELAR */
  editarPiso(id: number) {

    console.log(id);
    $('#botones_pisos_' + id).show();
    $('#btn_editar_piso' + id).hide();
    $('#numero_piso' + id).prop('readonly', false);
    $('#piso' + id).prop('readonly', false);
  }

  /* GUARDAR LOS CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let descuento: any = $('#piso' + id).val();
    let piso: any = $('#numero_piso' + id).val();
    this.piso.id = id;
    this.piso.numero_piso = piso;
    this.piso.descuento = descuento;
    console.log(this.piso);
    this.pisoService.editarPiso(this.piso).subscribe(
      data => this.handleResponse(data, 'modificar_piso'),
      error => this.handleError(error, 'modificar_piso'),
    );
  }

  /* CANCELAR EDICION */
  cancelarCambios(id: number) {

    $('#botones_pisos_' + id).hide();
    $('#btn_editar_piso' + id).show();
    $('#numero_piso' + id).prop('readonly', true);
    $('#piso' + id).prop('readonly', true);
    console.log('Cancelando');
  }

  crearPiso() {

    console.log('INFORMACION NUEVO PISO: ');
    console.log(this.piso);
    this.pisoService.crearPiso(this.piso).subscribe(
      data => this.handleResponse(data, 'agregar_piso'),
      error => this.handleError(error, 'agregar_piso')
    );
  }

  obtenerPiso(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/pisos/' + id).subscribe(
      (data: Piso[]) => {
        this.pisos = data;
        console.log('INFORMACION PISOS');
        console.log(data);
      }
    );
  }

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_piso':
        this.notificacion.success('El piso ha sido agregado');
        this.piso.numero_piso = null;
        this.piso.descuento = null;
        this.obtenerPiso(this.id);
        console.log(data);

        break;
      case 'modificar_piso':
        this.notificacion.success('La informacion del piso ha sido modificada');
        $('#numero_piso' + this.id).prop('readonly', true);
        $('#piso' + this.id).prop('readonly', true);
        $('#btn_editar_piso' + this.id).show();
        $('#botones_pisos_' + this.id).hide();
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_piso':
        this.notificacion.error('Ha ocurrido un error al agregar el piso.');
        console.log(error);
        break;
      case 'modificar_piso':
        this.notificacion.error('Ha ocurrido un error al modificar el piso.');
        console.log(error);
        break;
    }
  }
}
