import { Component, OnInit } from '@angular/core';
import { PrototipoService } from '../services/prototipo.service';
import { DesarrolloService } from '../services/desarrollo.service';
import { HttpClient } from '@angular/common/http';
import { Prototipo } from '../interfaces/prototipo';
import { Desarrollo } from '../interfaces/desarrollo';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-precio',
  templateUrl: './param-precio.component.html',
  styleUrls: ['./param-precio.component.css']
})
export class ParamPrecioComponent implements OnInit {

  // GUARDA LOS DATOS DEL DESARROLLO OBTENIDOS DE LA RESPUESTA GET DEL API
  prototipos: Prototipo[];
  id: any;
  costo: Desarrollo[];

  // GUARDA LOS DATOS DEL FORMULARIO QUE SERAN ENVIADOS AL METODO POST DE LA API
  datos: Prototipo = {
    prototipo: null,
    metros_cuadrados: null,
    costo_venta_metro_cuadrado: null,
    precio: null,
    desarrollo_id: null
  };

  datosDesarrollo: Desarrollo = {
    nombre: null,
    precio_inicial: null,
    fecha_inicio_obra: null,
    created_at: null,
    updated_at: null
  };

  constructor(private activatedRoute: ActivatedRoute,
              private prototipoService: PrototipoService,
              private desarrolloService: DesarrolloService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

    this.id = this.activatedRoute.snapshot.params.id;

    // OBTENEMOS LOS DATOS DEL PROTOTIPO PASANDO POR PARAMETRO EL ID DEL DESARROLLO
    this.mostrarPrototipos(this.id);
    // OBTENEMOS LOS DATOS DEL DESARROLLO PASANDO POR PARAMETRO EL ID DEL DESARROLLO
    this.obtenerCostoMantenimiento(this.id);
    console.log('Id Desarrollo: ' + this.id);
    // INICIALIZAMOS LA VARIABLE desarrollo_id DENTRO DEL CONTRUCTOR
    this.datos.desarrollo_id = this.id;
  }

  ngOnInit() {

    $( () => {

      $('#mts_cuadrados').on('change', () => {

        // VALOR INMUEBLE
        let metros: any;
        let costo: any;
        let costoVenta: any;
        let totalPrecio: any;

        metros = $('#mts_cuadrados').val();
        costo = $('#costo_metro').val();
        costoVenta = $('#costo_venta_metro_cuadrado').val();
        // MULTIPLICA LOS MT2 POR EL COSTO INICIAL DEL DESARROLLO
        // totalPrecio = metros * costo;

        // CAMBIO SOLICITADO, MULTIPLICA LOS MTS2 POR EL COSTO DE VENTA ESPECIFICO DEL PROTOTIPO
        totalPrecio = metros * costoVenta;
        $('#precio_prototipo').val(totalPrecio);
      });

      $('#costo_venta_metro_cuadrado').on('change', () => {

        // VALOR INMUEBLE
        let metros: any;
        let costo: any;
        let costoVenta: any;
        let totalPrecio: any;

        metros = $('#mts_cuadrados').val();
        costo = $('#costo_metro').val();
        costoVenta = $('#costo_venta_metro_cuadrado').val();
        // MULTIPLICA LOS MT2 POR EL COSTO INICIAL DEL DESARROLLO
        // totalPrecio = metros * costo;

        // CAMBIO SOLICITADO, MULTIPLICA LOS MTS2 POR EL COSTO DE VENTA ESPECIFICO DEL PROTOTIPO
        totalPrecio = metros * costoVenta;
        $('#precio_prototipo').val(totalPrecio);
      });

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR DESARROLLOS */
      $('#check_prototipo').on('change', () => {

        if ( $('#check_prototipo').is(':checked') ) {
          $('#div_agregar_prototipo').show();
        } else {
          $('#div_agregar_prototipo').hide();
          $('#nombre_prototipo').val('');
          $('#mts_cuadrados').val('');
          $('#precio_prototipo').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR DESARROLLOS */

      /* VISIBILIDAD REPLICAR CONFIGURACION */
      $('#check_costo').on('change', () => {

        if ( $('#check_costo').is(':checked') ) {
          $('#div_modificar_costo').show();
        } else {
          $('#div_modificar_costo').hide();
        }
      });
      /* FIN VISIBILIDAD REPLICAR CONFIGURACION */
    });

  }

  /* FUNCION PARA MOSTRAR EL DIV CON LOS BOTONES DE GUARDAR Y CANCELAR */
  editarPrecio(id: number) {

    console.log(id);
    $('#botones_precio_' + id).show();
    $('#btn_editar_precio_' + id).hide();
    $('#nombre_prototipo_' + id).prop('readonly', false);
    $('#mts_cuadrados_' + id).prop('readonly', false);
    $('#costo_venta_mt2_' + id).prop('readonly', false);
  }

  /* GUARDAR LOS CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let costo: any;
    let prototipo: any;
    let mtsCuadrados: any;
    let costoVentaMtsCuadrados: any;
    let precio: any;

    costo = $('#costo_metro').val();
    prototipo = $('#nombre_prototipo_' + id).val();
    mtsCuadrados = $('#mts_cuadrados_' + id).val();
    costoVentaMtsCuadrados = $('#costo_venta_mt2_' + id).val();
    // precio = $('#precio_prototipo_' + id).val(costo * mtsCuadrados);
    precio = $('#precio_prototipo_' + id).val(costoVentaMtsCuadrados * mtsCuadrados);
    this.datos.prototipo = prototipo;
    this.datos.metros_cuadrados = mtsCuadrados;
    this.datos.costo_venta_metro_cuadrado = costoVentaMtsCuadrados;
    this.datos.precio = mtsCuadrados * costoVentaMtsCuadrados;
    // this.datos.precio = mtsCuadrados * costo;
    this.datos.id = id;

    this.prototipoService.editarPrototipo(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_prototipo'),
      error => this.handleError(error, 'modificar_prototipo')
    );
  }

  /* CANCELAR EDICION */
  cancelarCambios(id: number) {

    $('#botones_precio_' + id).hide();
    $('#btn_editar_precio_' + id).show();
    $('#nombre_prototipo_' + id).prop('readonly', true);
    $('#mts_cuadrados_' + id).prop('readonly', true);
    $('#costo_venta_mt2_' + id).prop('readonly', true);
    console.log('Cancelando');
  }

  // OBTIENE EL COSTO DEL MANTENIMIENTO POR DESARROLLO
  obtenerCostoMantenimiento(id: number) {

    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos/' + id).subscribe( (data: Desarrollo[]) => {
      this.costo = data;
      console.log('Informacion desarrollo');
      console.log(data);
    });
  }

  // MUESTRA INFORMACION DEL DESARROLLO
  mostrarPrototipos(id: number) {

    this.httpClient.get(environment.API_ENDPOINT + '/prototipos/' + id).subscribe( (data: Prototipo[]) => {
      this.prototipos = data;
      console.log('Informacion prototipos');
      console.log(data);
    } );
  }

  // METODO QUE AGREGA DESARROLLOS
  agregarPrototipo() {

    let metros: any;
    let costo: any;
    metros = $('#mts_cuadrados').val();
    costo = $('#costo_metro').val();
    this.datos.precio = metros * costo;
    console.log(this.datos);
    this.prototipoService.guardarPrototipo(this.datos).subscribe(
        data => this.handleResponse(data, 'agregar_prototipo'),
        error => this.handleError(error, 'agregar_prototipo')
      );
    }

    modificarCosto() {

      const costo: any = $('#costo_metro').val();
      const fechaInicioObra: any = $('#fecha_inicio_obra').val();
      this.datosDesarrollo.id = this.id;
      this.datosDesarrollo.precio_inicial = costo;
      this.datosDesarrollo.fecha_inicio_obra = fechaInicioObra;
      console.log(this.datosDesarrollo);
      // console.log(this.desarrolloService.editarCosto(this.datosDesarrollo));
      this.desarrolloService.editarCosto(this.datosDesarrollo).subscribe(
        (data) => this.handleResponse(data, 'modificar_costo'),
        (error) => this.handleError(error, 'modificar_costo')
      );
    }

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_prototipo':
        this.notificacion.success('El prototipo ha sido agregado', 'Registro exitoso.', {
          showProgressBar: false,
          timeout: 0,
          titleMaxLength: 200
        });
        this.mostrarPrototipos(this.id);
        $('#nombre_prototipo').val('');
        $('#mts_cuadrados').val('');
        $('#costo_venta_metro_cuadrado').val('');
        $('#precio_prototipo').val('');
        $('#check_prototipo').prop('checked', false);
        $('#div_agregar_prototipo').hide();
        this.datos.prototipo = null;
        this.datos.metros_cuadrados = null;
        this.datos.costo_venta_metro_cuadrado = null;
        this.datos.precio = null;
        console.log(data);

        break;
      case 'modificar_prototipo':
        this.notificacion.success('La informacion del prototipo ha sido modificada', 'Modificacion exitosa.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        $('#nombre_prototipo_' + this.id).prop('readonly', true);
        $('#mts_cuadrados_' + this.id).prop('readonly', true);
        $('#mts_cuadrados_' + this.id).prop('readonly', true);
        $('#costo_venta_mt2_' + this.id).prop('readonly', true);
        $('#precio_prototipo_' + this.id).prop('disabled', true);
        $('#botones_precio_' + this.id).hide();
        $('#btn_editar_precio_' + this.id).show();
        break;
      case 'modificar_costo':
        this.notificacion.success('El costo ha sido modificado', 'Modificacion realizada.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        this.mostrarPrototipos(this.id);
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_prototipo':
        this.notificacion.error('Error al agregar el prototipo', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_prototipo':
        this.notificacion.error('Error al modificar el prototipo', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_costo':
        this.notificacion.error('Error al modificar el costo', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
    }
  }

}
