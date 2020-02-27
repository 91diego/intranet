import { Component, OnInit } from '@angular/core';
import { SupuestoHipotecario } from '../interfaces/supuesto-hipotecario';
import { SupuestoHipotecarioService } from '../services/supuesto-hipotecario.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-param-hipotecario',
  templateUrl: './param-hipotecario.component.html',
  styleUrls: ['./param-hipotecario.component.css']
})
export class ParamHipotecarioComponent implements OnInit {

  id: any;

  // GUARDA INFORMACION QUE SE ENVIARA A LA API POR POST
  datos: SupuestoHipotecario = {

    porcentaje_comision_apertura: null,
    porcentaje_enganche: null,
    duracion_credito: null,
    tasa_interes: null,
    tasa_extra: null,
    repago_capital: null,
    porcentaje_descuento: null,
    desarrollo_id: null
  };

  // GUARDA LOS DATOS DE LA PETICION AL METODO GET
  supuestoHipotecario: SupuestoHipotecario[];

  constructor(private activatedRoute: ActivatedRoute,
              private supuestoHipotecarioService: SupuestoHipotecarioService,
              private httpClient: HttpClient,
              private notificacion: SnotifyService) {

    this.id = this.activatedRoute.snapshot.params.id;
    this.datos.desarrollo_id = this.id;
    this.obtenerSupuestoHipotecario(this.id);
  }

  ngOnInit() {

    $( () => {

      /* VISIBILIDAD DEL FORMULARIO PARA AGREGAR SUPUESTO DE VENTA */
      $('#check_supuesto_hipotecario').on('change', () => {

        console.log($('#check_supuesto_hipotecario').val());
        if ($('#check_supuesto_hipotecario').is(':checked') ) {
          $('#div_agregar_supuesto_hipotecario').show();
        } else {

          $('#div_agregar_supuesto_hipotecario').hide();
          $('#porcentaje_comision_apertura').val('');
          $('#porcentaje_enganche').val('');
          $('#duracion_credito').val('');
          $('#tasa_interes').val('');
          $('#tasa_extra').val('');
          $('#repago_capital').val('');
          $('#porcentaje_descuento_hipotecario').val('');
        }
      });
      /* FIN VISIBILIDAD DEL FORMULARIO PARA AGREGAR PISOS */

      $('#btn_agregar_supuesto_hipotecario').on('click', () => {

        $('#porcentaje_comision_apertura').val('');
        $('#porcentaje_enganche').val('');
        $('#duracion_credito').val('');
        $('#tasa_interes').val('');
        $('#tasa_extra').val('');
        $('#repago_capital').val('');
        $('#porcentaje_descuento_hipotecario').val('');
        $('#check_supuesto_hipotecario').prop('checked', false);
        $('#div_agregar_supuesto_hipotecario').hide();
      });

    });

  }

  /* CREA LOS CONCEPTOS DEL SUPUESTO DE MERCADO */
  crearSupuestoHipotecario() {

    console.log('INFORMACION SUPUESTO HIPOTECARIO');
    console.log(this.datos);
    this.supuestoHipotecarioService.guardarSupuestoHipotecario(this.datos).subscribe(
      data => this.handleResponse(data, 'agregar_supuesto_hipotecario'),
      error => this.handleError(error, 'agregar_supuesto_hipotecario')
    );
  }
  /* FIN CREAR CONCEPTOS */

  /* OBTIENE LOS SUPUESTO DE VENTA */
  obtenerSupuestoHipotecario(id: number) {
    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-hipotecario/' + id).subscribe(
      (data: SupuestoHipotecario[]) => {
        this.supuestoHipotecario = data;
        console.log('INFORMACION SUPUESTO HIPOTECARIO');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER SUPUESTO DE VENTA */

  /* EDITA SUPUESTO DE VENTA */
  editarSupuestoHipotecario(id: number) {

    console.log(id);
    $('#botones_supuesto_venta_hipotecario_' + id).show();
    $('#btn_editar_supuesto_hipotecario_' + id).hide();
    $('#porcentaje_comision_apertura_' + id).prop('readonly', false);
    $('#porcentaje_enganche_' + id).prop('readonly', false);
    $('#duracion_credito_' + id).prop('readonly', false);
    $('#tasa_interes_' + id).prop('readonly', false);
    $('#tasa_extra_' + id).prop('readonly', false);
    $('#repago_capital_' + id).prop('readonly', false);
    $('#porcentaje_descuento_hipotecario_' + id).prop('readonly', false);
  }
  /* FIN EDITA SUPUESTO DE VENTA */

  /* GUARDA CAMBIOS DE LA EDICION */
  guardarCambios(id: number) {

    let porcentaje_comision_apertura: any = $('#porcentaje_comision_apertura_' + id).val();
    let porcentaje_enganche: any = $('#porcentaje_enganche_' + id).val();
    let duracion_credito: any = $('#duracion_credito_' + id).val();
    let tasa_interes: any = $('#tasa_interes_' + id).val();
    let tasa_extra: any = $('#tasa_extra_' + id).val();
    let repago_capital: any = $('#repago_capital_' + id).val();
    let porcentaje_descuento: any = $('#porcentaje_descuento_hipotecario_' + id).val();
    this.datos.porcentaje_comision_apertura = porcentaje_comision_apertura;
    this.datos.porcentaje_enganche = porcentaje_enganche;
    this.datos.duracion_credito = duracion_credito;
    this.datos.tasa_interes = tasa_interes;
    this.datos.tasa_extra = tasa_extra;
    this.datos.repago_capital = repago_capital;
    this.datos.porcentaje_descuento = porcentaje_descuento;
    this.datos.id = id;
    console.log(this.datos);
    this.supuestoHipotecarioService.editarSupuestoHipotecario(this.datos).subscribe(
      data => this.handleResponse(data, 'modificar_supuesto_hipotecario'),
      error => this.handleError(error, 'modificar_supuesto_hipotecario')
    );
  }
  /* FIN GUARDA CAMBIOS EDICION */

  /* CANCELA CAMBIOS EDICION */
  cancelarCambios(id: number) {

    $('#botones_supuesto_venta_hipotecario_' + id).hide();
    $('#btn_editar_supuesto_hipotecario_' + id).show();
    $('#porcentaje_comision_apertura_' + id).prop('readonly', true);
    $('#porcentaje_enganche_' + id).prop('readonly', true);
    $('#duracion_credito_' + id).prop('readonly', true);
    $('#tasa_interes_' + id).prop('readonly', true);
    $('#tasa_extra_' + id).prop('readonly', true);
    $('#repago_capital_' + id).prop('readonly', true);
    $('#porcentaje_descuento_hipotecario_' + id).prop('readonly', true);
    console.log('Cancelando');
  }
  /*FIN CANCELA CAMBIOS EDICION*/

  // Respuesta
  handleResponse(data: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_hipotecario':
        this.notificacion.success('El supuesto de mercado ha sido agregado', 'Registro realizado.', {
          showProgressBar: false,
          timeout: 0,
          titleMaxLength: 200
        });
        this.obtenerSupuestoHipotecario(this.datos.desarrollo_id);
        this.datos.duracion_credito = null;
        this.datos.porcentaje_comision_apertura = null;
        this.datos.porcentaje_descuento = null;
        this.datos.porcentaje_enganche = null;
        this.datos.tasa_interes = null;
        this.datos.tasa_extra = null;
        this.datos.repago_capital = null;
        break;
      case 'modificar_supuesto_hipotecario':
        this.notificacion.success('La informacion del supuesto de mercado ha sido modificada', 'Modificacion realizada.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        $('#porcentaje_comision_apertura_' + this.id).prop('readonly', true);
        $('#porcentaje_enganche_' + this.id).prop('readonly', true);
        $('#duracion_credito_' + this.id).prop('readonly', true);
        $('#tasa_interes_' + this.id).prop('readonly', true);
        $('#tasa_extra_' + this.id).prop('readonly', true);
        $('#repago_capital_' + this.id).prop('readonly', true);
        $('#porcentaje_descuento_hipotecario_' + this.id).prop('readonly', true);
        $('#btn_editar_supuesto_hipotecario_' + this.id).show();
        $('#botones_supuesto_venta_hipotecario_' + this.id).hide();
        console.log(data);
        break;
    }
    console.log(data);
  }
  // Manejo de errores
  handleError(error: any, tipo: any) {

    switch (tipo) {
      case 'agregar_supuesto_hipotecario':
        this.notificacion.error('Error al agregar el supuesto de mercado', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
      case 'modificar_supuesto_hipotecario':
        this.notificacion.error('Error al modificar el supuesto de mercado', 'Ha ocurrido un error.', {
          showProgressBar: false,
          titleMaxLength: 200
        });
        console.log(error);
        break;
    }
  }

}
