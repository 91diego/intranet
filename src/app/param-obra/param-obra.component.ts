import { Component, OnInit } from '@angular/core';
import { SupuestoObra } from '../interfaces/supuesto-obra';
import { SupuestoObraService } from '../services/supuesto-obra.service';
import { DesarrolloService } from '../services/desarrollo.service';
import { Desarrollo } from '../interfaces/desarrollo';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-obra',
  templateUrl: './param-obra.component.html',
  styleUrls: ['./param-obra.component.css']
})

export class ParamObraComponent implements OnInit {

  id: any;
  costo: Desarrollo[];

  // GUARDA INFORMACION QUE SE ENVIARA A LA API POR POST
  datos: SupuestoObra = {

    torre: null,
    duracion_meses: null,
    fecha_termino: null,
    desarrollo_id: null
  };

  datosDesarrollo: Desarrollo = {
    nombre: null,
    precio_inicial: null,
    fecha_inicio_obra: null,
    created_at: null,
    updated_at: null
  };

  // GUARDA LOS DATOS DE LA PETICION AL METODO GET
  supuestoObra: SupuestoObra[];

  constructor(private activatedRoute: ActivatedRoute,
              private supuestoObraService: SupuestoObraService,
              private desarrolloService: DesarrolloService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

    this.id = this.activatedRoute.snapshot.params.id;
    this.datos.desarrollo_id = this.id;
    this.obtenerSupuestoObra(this.id);
    this.obtenerFechaInicio(this.id);
  }

  ngOnInit() {

    $( () => {

      /*ASIGNAR FECHA DE TERMINO DE LA OBRA */
      $('#duracion_meses_supuesto_obra').on('change', () => {

        let fecha: any;
        let fechaFormato: any;
        let fechaFormatoFinal: any;
        let mesesduracionObra: any;
        let mes: any;
        fecha = $('#fecha_inicio_obra').val();
        console.log(fecha);
        mesesduracionObra = $('#duracion_meses_supuesto_obra').val();
        console.log(mesesduracionObra);
        fechaFormato = new Date(fecha);
        console.log(fechaFormato);
        mes = fechaFormato.setMonth((fechaFormato.getMonth()) +
        Number(mesesduracionObra));
        fechaFormatoFinal = new Date(fechaFormato).toISOString().slice(0 , 10).split('T')[0];
        if (fechaFormato.getDate() === '31' || fechaFormato.getDate() === 31) {
          fechaFormato.setDate(fechaFormato.setDate() + 1);
        }
        console.log(fechaFormatoFinal);
        $('#fecha_termino_supuesto_obra').val(fechaFormatoFinal);
      });
      /* ASIGNAR FECHA DE TERMINO DE LA OBRA */

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR SUPUESTO DE OBRA */
      $('#check_supuesto_obra').on('change', () => {

        console.log($('#check_supuesto_obra').val());
        if( $('#check_supuesto_obra').is(':checked') ) {
          $('#div_agregar_supuesto_obra').show();
        } else {

          $('#div_agregar_supuesto_obra').hide();
          $('#torre_supuesto_obra').val('');
          $('#duracion_meses_supuesto_obra').val('');
          $('#fecha_termino_supuesto_obra').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO */

      /* CAMBIAR FECHA DE INICIO DE OBRA */
      $('#check_fecha_inicio_obra').on('change',  () => {

        console.log($('#check_fecha_inicio_obra').val());
        if( $('#check_fecha_inicio_obra').is(':checked') ) {
          $('#div_modificar_fecha_inicio_obra').show();
        } else {

          $('#div_modificar_fecha_inicio_obra').hide();
        }
      });
      /* FIN FECHA INICIO DE OBRA */

      $('#btn_agregar_supuesto_obra').on('click', () => {

        $('#torre_supuesto_obra').val('');
        $('#duracion_meses_supuesto_obra').val('');
        $('#fecha_termino_supuesto_obra').val('');
      });

    });

  }

  /* CREA SUPUESTO DE OBRA */
  crearSupuestoObra() {

    console.log('INFORMACION SUPUESTO OBRA');
    this.datos.fecha_termino = $('#fecha_termino_supuesto_obra').val();
    console.log(this.datos);
    this.supuestoObraService.guardarSupuestoObra(this.datos).subscribe(
      data => this.handleResponse(data, 'agregar_supuesto_obra'),
      error => this.handleError(error, 'agregar_supuesto_obra')
    );
  }
  /* FIN CREA SUPUESTO DE OBRA */

  /* OBTENER SUPUESTO DE OBRA */
  obtenerSupuestoObra(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-obra/' + id).subscribe(
      (data: SupuestoObra[]) => {
        this.supuestoObra = data;
        console.log('INFORMACION SUPUESTO DE OBRA');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER SUPUESTO DE OBRA */

  /* MODIFICA LA FECHA DE INICIO CONSTRUCCION DEL DESARROLLO */
  modificarFechaInicio() {

    const fechaInicioObra: any = $('#fecha_inicio_obra').val();
    const costo: any = $('#costo_metro').val();
    this.datosDesarrollo.id = this.id;
    this.datosDesarrollo.fecha_inicio_obra = fechaInicioObra;
    this.datosDesarrollo.precio_inicial = costo;
    console.log('Datos desarrollo');
    console.log(this.datosDesarrollo);
    console.log(this.desarrolloService.editarFechaInicio(this.datosDesarrollo));
    this.desarrolloService.editarFechaInicio(this.datosDesarrollo).subscribe(
      data => this.handleResponse(data, 'modificar_fecha_inicio'),
      error => this.handleError(error, 'modificar_fecha_inicio')
    );
  }
  /* FIN FECHA INICIO CONSTRUCCION */

  /* OBTIENE EL COSTO DEL MANTENIMIENTO POR DESARROLLO */
  obtenerFechaInicio(id: number) {

    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos/' + id).subscribe( (data: Desarrollo[]) => {
      this.costo = data;
      console.log('Informacion desarrollo');
      console.log(data);
    });
  }

  /* EDITA SUPUESTO DE VENTA */
  editarSupuestoMercado(id: number) {

    console.log(id);
    $('#botones_supuesto_obra_' + id).show();
    $('#btn_editar_supuesto_obra_' + id).hide();
    $('#torre_' + id).prop('readonly', false);
    $('#fecha_inicio_' + id).prop('readonly', true);
    $('#duracion_meses_' + id).prop('readonly', false);
    $('#fecha_termino_' + id).prop('readonly', true);
  }
  /* FIN EDITA SUPUESTO DE VENTA */

  /* GUARDA CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let fechaTermino: any;
    let fecha: any;
    let mes: any;
    let torre: any;
    let fechaInicio: any;
    let duracionMeses: any;
    let fechaFormateada: any;

    torre = $('#torre_' + id).val();
    fechaInicio = $('#fecha_inicio_' + id).val();
    duracionMeses = $('#duracion_meses_' + id).val();


    // SE LE DA FORMATO A LA FECHA
    fecha = new Date(fechaInicio);
    // SE SUMAN LOS MESES A LA FECHA
    mes = fecha.setMonth((fecha.getMonth()) +
    Number(duracionMeses));

    // SE RECONSTRUYE LA FECHA CON FORMATO
    fechaFormateada = new Date(fecha).toISOString().slice(0 , 10).split('T')[0];
    fechaTermino = $('#fecha_termino_' + id).val(fechaFormateada);

    this.datos.torre = torre;
    this.datos.fecha_termino = fechaFormateada;
    this.datos.duracion_meses = duracionMeses;
    this.datos.id = id;
    console.log(this.datos);
    this.supuestoObraService.editarSupuestoObra(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_supuesto_obra'),
      error => this.handleError(error, 'modificar_supuesto_obra')
    );
  }
  /* FIN GUARDA CAMBIOS EDICION */

  /* CANCELA CAMBIOS EDICION */
  cancelarCambios(id: number) {

    $('#botones_supuesto_obra_' + id).hide();
    $('#btn_editar_supuesto_obra_' + id).show();
    $('#torre_' + id).prop('readonly', true);
    $('#fecha_inicio_' + id).prop('readonly', true);
    $('#duracion_meses_' + id).prop('readonly', true);
    $('#fecha_termino_' + id).prop('readonly', true);
    console.log('Cancelando');
  }
  /*FIN CANCELA CAMBIOS EDICION*/

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_obra':
        this.notificacion.success('El supuesto de obra ha sido agregado.', 'Registro exitoso.', {
          showProgressBar: false,
          timeout: 0,
          titleMaxLength: 200
        });
        this.obtenerSupuestoObra(this.datos.desarrollo_id);
        this.datos.torre = null;
        this.datos.fecha_termino = null;
        this.datos.duracion_meses = null;
        break;
      case 'modificar_supuesto_obra':
        this.notificacion.success('La informacion del supuesto de obra ha sido modificada.', 'Modificacion exitosa.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        $('#torre_' + this.id).prop('readonly', true);
        $('#fecha_inicio_' + this.id).prop('readonly', true);
        $('#duracion_meses_' + this.id).prop('readonly', true);
        $('#fecha_termino_' + this.id).prop('readonly', true);
        $('#btn_editar_supuesto_obra_' + this.id).show();
        $('#botones_supuesto_obra_' + this.id).hide();
        console.log(data);
        break;
      case 'modificar_fecha_inicio':
        this.notificacion.success('La fecha de incio de construccion ha sido modificada.', 'Modificacion realizada.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        this.obtenerSupuestoObra(this.id);
        this.obtenerFechaInicio(this.id);
        $('#check_fecha_inicio_obra').prop('checked', false);
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_obra':
        this.notificacion.error('Error al modificar el supuesto de obra.', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_supuesto_obra':
        this.notificacion.error('Error al modificar el supuesto de obra', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_fecha_inicio':
        this.notificacion.error('Error al modificar la fecha de inicio de obra.', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
    }
  }

}
