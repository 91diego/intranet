import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Desarrollo } from '../interfaces/desarrollo';
import { SupuestoVenta } from '../interfaces/supuesto-venta';
import { SupuestoCompra } from '../interfaces/supuesto-compra';
import { SupuestoHipotecario } from '../interfaces/supuesto-hipotecario';
import { SupuestoObra } from '../interfaces/supuesto-obra';
import { SupuestoMercado } from '../interfaces/supuesto-mercado';
import { Prototipo } from '../interfaces/prototipo';
import { Piso } from '../interfaces/piso';
import { Plusvalia } from '../interfaces/plusvalia';
import { HojaLlenado } from '../interfaces/calculadora/hoja-llenado';
import * as $ from 'jquery';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Finance } from 'financejs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnotifyService, SnotifyPosition, SnotifyToast } from 'ng-snotify';
import { environment, position } from '../../environments/environment';

// FUNCION PARA TRUNCAR LOS DECIMALES DE UN NUMERO
function trunc(x, posiciones = 0) {
  const s = x.toString();
  const l = s.length;
  const decimalLength = s.indexOf('.') + 1;
  const numStr = s.substr(0, decimalLength + posiciones);
  return Number(numStr);
}
// CONSTANTE PARA DAR FORMATO DE MONEDA A LOS NUMEROS
const formatterPeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const formatterPercent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements OnInit {

  opcionFinanciamiento: FormControl;
  validacionPrototipo: FormControl;
  validacionTorre: FormControl;
  validacionPiso: FormControl;
  validacionFechaContrato: FormControl;
  validacionTasaHipotecaria: FormControl;
  validacionPlusvalia: FormControl;
  validacionObjetivoCompra: FormControl;
  validacionNombreCliente: FormControl;
  validacionNombreDepartamento: FormControl;

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  desarrollos: Desarrollo[];
  desarrolloDetalles: Desarrollo[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestoVenta: SupuestoVenta[];
  supuestoVentaDetalles: SupuestoVenta[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestosHipotecarios: SupuestoHipotecario[];
  supuestosHipotecariosDetalles: SupuestoHipotecario[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestosCompra: SupuestoCompra[];
  supuestosCompraDetalles: SupuestoCompra[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestosObra: SupuestoObra[];
  supuestosObraDetalles: SupuestoObra[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestoMercado: SupuestoMercado[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  prototipos: Prototipo[];
  prototipoDetalles: Prototipo[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  pisos: Piso[];
  pisoDetalles: Piso[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  plusvalias: Plusvalia[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  hojaLLenado: HojaLlenado[];

  idSupuestoCompra;
  idDesarrollo;
  idPrototipo;
  idPiso;
  idSupuestoVenta;
  idSupuestoObra;

  datosCaratula: HojaLlenado = {
    metodo_financiamiento: null,
    prototipo: null,
    fecha_contrato: null,
    torre: null,
    piso: null,
    tasa_banxico: null,
    tasa_cliente: null,
    tasa_plusvalia: null,
    tasa_0: null,
    plusvalia: null,
    objetivo_compra: null
  };

  // PUESTO DEL USUARIO, SE UTILIZA PARA REGRESAR A LA TURA HOME
  workPosition;

  constructor(private httpClient: HttpClient,
              private ngxService: NgxUiLoaderService,
              private notificacion: SnotifyService) {

                this.workPosition = position.work_position;
                console.log('Puesto desde la calculadora: ' + this.workPosition);

                this.opcionFinanciamiento = new FormControl('', [
                  Validators.required
                ]);
                this.opcionFinanciamiento.valueChanges.subscribe(
                  value => {
                    console.log('Opcion financiamiento: ' + value);
                  }
                );
                this.validacionPrototipo = new FormControl('', [
                  Validators.required
                ]);
                this.validacionTorre = new FormControl('', [
                  Validators.required
                ]);
                this.validacionFechaContrato = new FormControl('', [
                  Validators.required
                ]);
                this.validacionPlusvalia = new FormControl('', [
                  Validators.required
                ]);
                this.validacionObjetivoCompra = new FormControl('', [
                  Validators.required
                ]);
                this.validacionPiso = new FormControl('', [
                  Validators.required
                ]);
                this.validacionTasaHipotecaria = new FormControl('', [
                  Validators.required
                ]);
                this.validacionNombreCliente = new FormControl('', [
                  Validators.required
                ]);
                this.validacionNombreDepartamento = new FormControl('', [
                  Validators.required
                ]);
  }

  ngOnInit() {

    this.ngxService.start(); // start foreground loading with 'default' id

    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground loading with 'default' id
    }, 2000);

    this.actualizarListaDesarrollos();
    $( () => {

      /* VALIDACIONES DEL FORMULARIO */
      $('#metodo_financiamiento_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#prototipo_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#torre_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#piso_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#fecha_inicio_contrato_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#tasa_plusvalia').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#objetivo_compra_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#años_objetivo_compra').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#dia_pago_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });

      $('#fecha_pago_apartado_hoja_llenado').on('change', () => {

        if ($('#metodo_financiamiento_hoja_llenado').val() === null || $('#prototipo_hoja_llenado').val() === null ||
        $('#torre_hoja_llenado').val() === null || $('#piso_hoja_llenado').val() === null ||
        $('#fecha_inicio_contrato_hoja_llenado').val() === null || $('#tasa_plusvalia').val() === null ||
        $('#tasa_plusvalia').val() === 'NA' || $('#objetivo_compra_hoja_llenado').val() === null
        || $('#años_objetivo_compra').val() === null
        || $('#dia_pago_hoja_llenado').val() === null || $('#fecha_pago_apartado_hoja_llenado').val() === null) {

          $('#btn_caratula').hide();
        } else {
          $('#btn_caratula').show();
        }
      });
      /* FIN VALIDACIONES DEL FORMULARIO */

      /* VALIDA SELECCION DE DESARROLLO */
      if ($('#select_desarrollo_calculos').val() === null) {

        $('#div_hoja_llenado').hide();
      }
      /* FIN VALIDA SELECCION DEL DESARROLLO */

      /* MUESTRA EL DIV DE LA HOJA DE LLENADO */
      $('#select_desarrollo_calculos').on('change', () => {

        if ($('#select_desarrollo_calculos').val() != null) {
          this.ngxService.start(); // start foreground loading with 'default' id

          // Stop the foreground loading after 5s
          setTimeout(() => {
            this.ngxService.stop(); // stop foreground loading with 'default' id
          }, 3000);
          $('#div_hoja_llenado').show();
        }
      });
      /* FIN MUESTRA HOJA DE LLENADO */

      /* VALIDA METODO FINANCIAMIENTO */
      $('#tasa_hipotecaria_llenado').on('change', () => {
        /* MUESTRA div_metodo_financiamiento*/
        if ($('#tasa_hipotecaria_llenado').val() === 'SI') {
          $('#div_tasa_cliente').show();
          $('#div_tasa_banxico').hide();
        } else if ($('#tasa_hipotecaria_llenado').val() === 'NO') {
          $('#div_tasa_cliente').hide();
          $('#div_tasa_banxico').show();
          $('#tasa_cliente').val('');
        } else {
          $('#div_tasa_cliente').hide();
          $('#div_tasa_banxico').hide();
        }
        /* FIN MUESTRA div_metodo_financiamiento*/
      });
      /* FIN VALIDA METODO FINANCIAMIENTO */

      /* VALIDA RESPUESTA TASA PLUSVALIA */
      $('#tasa_plusvalia').on('change', () => {
        /* MUESTRA div_metodo_financiamiento*/
        if ($('#tasa_plusvalia').val() === 'SI') {
          $('#div_tasa_0').hide();
          $('#div_tasa').show();
        } else if ($('#tasa_plusvalia').val() === 'NO') {
          $('#div_tasa_0').show();
          $('#div_tasa').hide();
          $('#tasa_0').val(0);
        } else {
          $('#div_tasa_0').hide();
          $('#div_tasa').hide();
        }
        /* FIN MUESTRA div_metodo_financiamiento*/
      });
      /* FIN VALIDA RESPUESTA TASA PLUSVALIA */

      /* MUESTRA TASA HIPOTECARIA */
      $('#metodo_financiamiento_hoja_llenado').on('change', () => {
        const financiamiento: any = $('#metodo_financiamiento_hoja_llenado').val();
        /* MUESTRA div_metodo_financiamiento*/
        if (financiamiento.includes('HIPOTECARIO')) {
          $('#div_tasa_hipotecaria').show();
        } else {
          $('#div_tasa_hipotecaria').hide();
        }
        /* FIN MUESTRA div_metodo_financiamiento*/
      });
      /* FIN MUESTRA TASA HIPOTECARIA */

      $('#btn_caratula').on('click', () => {

        /* OBTIENE DATOS PARA LA CARATULA */
        const metodo: any = $('#nombre_venta').val();
        const metrosCuadradosPrototipo: any = $('#metros_cuadrados_prototipo').val();
        const precioInicialDesarrollo: any = $('#precio_incial_desarrollo').val();
        const plusvaliaPiso: any = $('#plusvalia_piso').val();
        const descuentoVenta: any = $('#descuento_venta').val();
        const rendimientoVenta: any = $('#rendimiento_venta').val();
        const firmaVenta: any = $('#firma_venta').val();
        const comisionApertura: any = $('#comision_apertura').val();
        const plazoVenta: any = $('#plazo_venta').val();
        const mesesFinanciamientoContrato: any = $('#meses_plazo_venta').val();
        const costo: any = $('#costo_cierre_mercado').val();
        const escritura: any = $('#escritura_venta').val();
        const codigoCompra: any = $('#codigo_compra').val();
        const rentaMercado: any = $('#renta_mercado').val();
        const costoMtto: any = $('#mantenimiento_mercado').val();
        const inflacion: any = $('#inflacion_mercado').val();
        const tasaExtra: any = $('#tasa_extra').val();
        const repagoCapital: any = $('#repago_capital').val();
        const tasaBanxico: any = $('#tasa_banxico').val();
        const tasaHipotecariaCliente: any = $('#tasa_cliente').val();
        const respuestaTasaHipotecaria: any = $('#tasa_hipotecaria_llenado').val();

        let plusvalia: any;
        if ($('#tasa_plusvalia').val() === 'SI') {
          plusvalia = $('#tasa_plusvalia_hoja_llenado').val();
        } else if ($('#tasa_plusvalia').val() === 'NO') {
          plusvalia = $('#tasa_0').val();
          $('#caratula_tasa_hipotecaria').val(tasaBanxico);
        }

        const fechaInicioDesarrollo: any = $('#fecha_inicio_desarrollo').val();
        const fechaTerminoObra: any = $('#fecha_termino_obra').val();

        /* OBTENEMOS LA DIFERENCIA DE MESES */
        let fechaInicio: any;
        let fechaFin: any;
        let nMeses: any;
        fechaInicio = new Date(fechaInicioDesarrollo);
        fechaFin = new Date(fechaTerminoObra);

        const a1: any = fechaInicio.getFullYear();
        const a2: any = fechaFin.getFullYear();
        let m1: any = fechaInicio.getMonth();
        let m2: any = fechaFin.getMonth();

        if (m1 === 0) {
          m1++;
          m2++;
        }
        nMeses = ( (a2 - a1) * 12 + (m2 - m1) ) - Number(mesesFinanciamientoContrato);
        console.log('Dif meses: ' + nMeses);
        const mesesFinanciamientoExtra: any = $('#caratula_meses_financimiento_extra').val(nMeses);
        /* FIN OBTENEMOS LA DIFERENCIA DE MESES */

        $('#div_caratula').show();
        $('#div_hoja_llenado').hide();
        $('#div_calculos_desarrollo').hide();
        $('#caratula_metodo_financiamiento').val(metodo);
        $('#caratula_metros_cuadrados').val(metrosCuadradosPrototipo);
        $('#caratula_precio_inicial').val(formatterPeso.format(precioInicialDesarrollo));
        $('#caratula_plusvalia_piso').val(plusvaliaPiso); // plusvalia
        $('#caratula_descuento_mf').val(descuentoVenta);
        $('#caratula_rendimiento').val(rendimientoVenta);
        $('#caratula_pago_plazos').val(plazoVenta);
        $('#caratula_conoce_tasa').val(respuestaTasaHipotecaria);
        $('#caratula_costo_cierre').val(costo);
        $('#caratula_meses_financiamiento').val(mesesFinanciamientoContrato);
        $('#caratula_fecha_inicio_obra').val(fechaInicioDesarrollo);
        $('#caratula_fecha_fin_torre').val(fechaTerminoObra);
        $('#caratula_objetivo_compra').val($('#objetivo_compra').val());
        $('#caratula_codigo_compra').val(codigoCompra);
        $('#caratula_inflacion').val(inflacion);
        $('#caratula_agrego_plusvalia').val($('#tasa_plusvalia').val());

        /* OBTIENE MESES REVENTA */
        const añosObjetivo: any = $('#años_objetivo_compra').val();
        const mesReventa: any = añosObjetivo * 12;

        if (mesReventa === 0) {
          $('#caratula_mes_reventa').val('1');
        } else {
          $('#caratula_mes_reventa').val(mesReventa);
        }
        /* FIN OBTIENE MESES REVENTA */

        /* VALIDA METODO DE FINANCIAMIENTO */
        if (metodo.includes('HIPOTECARIO')) {

          $('#caratula_comision_apertura').val(comisionApertura);
        } else {
          // alert($('#tasa_hipotecaria_llenado').val());
          $('#caratula_comision_apertura').val(0);
        }
        /* FIN VALIDA METODO DE FINANCIAMIENTO*/

        /* VALIDA RESPUESTA CONOCE TASA BANCO */
        if ($('#caratula_conoce_tasa').val() === 'SI') {

          $('#caratula_tasa_hipotecaria').val($('#tasa_cliente').val());
        } else if ($('#caratula_conoce_tasa').val() === 'NO') {

          $('#caratula_tasa_hipotecaria').val($('#tasa_banxico').val());
        }
        /* FIN VALIDA RESPUESTA CONOCE TASA BANCO */

        /* VALIDA RESPUESTA AGREGAR TASA PLUSVALIA */
        if ($('#caratula_agrego_plusvalia').val() === 'SI') {

          $('#caratula_plusvalia').val($('#tasa_plusvalia_hoja_llenado').val());
        } else if ($('#caratula_agrego_plusvalia').val() === 'NO') {

          $('#caratula_plusvalia').val('0');
        }
        /* FIN VALIDA RESPUESTA AGREGAR TASA PLUSVALIA */
      /* FIN OBTIENE DATOS PARA LA CARATULA */

      /* INFORMACION FLUJO BASICO */
        let valorInmuebleDescuento: any;
        let pagoInicial: any;
        let pagoFirma: any;
        let porcentajeComisionInmueble: any;
        let montoPlazo: any;
        let costoCierre: any;
        let escrituracion: any;
        let valorHipoteca: any;
        let valorRentaMenosMantenimiento: any;
        let precioDeVenta: any;
        let mensualidadHipoteca: any;
        let valorRestanteHipoteca: any;

        valorInmuebleDescuento = precioInicialDesarrollo * metrosCuadradosPrototipo
        * (1 + (plusvaliaPiso / 100)) * (1 - (descuentoVenta / 100 ));

        /*
          CALCULO DEL PAGO INICIAL
          Y PAGO A LA FIRMA, VALIDA SI ES UN PORCENTAJE O
          UN MONTO.
        */
        if (firmaVenta.length > 3) {
          porcentajeComisionInmueble = Number(valorInmuebleDescuento) * (1 + (Number(comisionApertura) / 100)) -
          Number(valorInmuebleDescuento);
          pagoFirma = Number(firmaVenta) + Number(porcentajeComisionInmueble);
          pagoInicial = Number(firmaVenta);
        } else {
          pagoFirma = ((Number(firmaVenta) / 100) * Number(valorInmuebleDescuento)) + Number(porcentajeComisionInmueble);
          pagoInicial = ((Number(firmaVenta) / 100) * Number(valorInmuebleDescuento));
        }

        $('#caratula_pago_firma').val(pagoFirma);
        console.log('PAGO INICIAL Y PAGO A LA FIRMA');
        console.log('Pago a la firma: ' + pagoFirma);
        console.log('Porcentaje comision inmueble: ' + porcentajeComisionInmueble);
        console.log('Pago inicial: ' + pagoInicial);
        /* FIN CALCULO DEL PAGO INICIAL Y PAGO A LA FIRMA */

        /* CALCULO DEL MONTO PLAZO */
        if (metodo.includes('PLAZO')) {
          montoPlazo = (Number(valorInmuebleDescuento) * (Number(plazoVenta) / 100)) / Number(mesesFinanciamientoContrato);
        } else if (plazoVenta === '0') {
          montoPlazo = 0;
        } else {
          montoPlazo =  ( Number(valorInmuebleDescuento) * (Number(plazoVenta) / 100) - Number(pagoInicial))
          / mesesFinanciamientoContrato;
          // montoPlazo =  ( Number(valorInmuebleDescuento) * Number(plazoVenta) - Number(pagoInicial) ) /
          Number(mesesFinanciamientoContrato);
        }
        console.log('');
        console.log('MONTO PLAZO');
        console.log('Valor inmueble: ' + valorInmuebleDescuento);
        console.log('Plazo Venta: ' + (plazoVenta / 100));
        console.log('Pago inicial: ' + pagoInicial);
        console.log('Meses financiamiento: ' + mesesFinanciamientoContrato);
        console.log('Monto plazo: ' + montoPlazo);
        /* FIN CALCULO DEL MONTO PLAZO */

        /* CALCULO COSTO CIERRE */
        if (metodo.includes('HIPOTECARIO')) {
          costoCierre = ( (Number(valorInmuebleDescuento) * (Number(costo) / 100)) )
          + ( Number(valorInmuebleDescuento) * Number(comisionApertura / 100) );
        } else {
          costoCierre = (Number(valorInmuebleDescuento) * (Number(costo) / 100));
        }
        console.log('');
        console.log('COSTO CIERRE');
        console.log('Costo cierre: ' + costoCierre);
        /* FIN CALCULO COSTO CIERRE */

        /* CALCULO ESCITURACION */
        if (metodo.includes('HIPOTECARIO')) {
          escrituracion = 0;
        } else {
          escrituracion = (Number(valorInmuebleDescuento) * (Number(escritura) / 100));
        }
        console.log('COSTO ESCRITURACION');
        console.log('Costo escrituracion: ' + escrituracion);
        /* FIN CALCULO ESCITURACION */

        /* CALCULO VALOR HIPOTECA */
        valorHipoteca = Number(valorInmuebleDescuento) * (1 - (Number(plazoVenta) / 100));
        console.log('');
        console.log('VALOR HIPOTECA');
        console.log('Valor Hipoteca: ' + valorHipoteca);
        /* FIN CALCULO VALOR HIPOTECA */

        /* T A B L A  D E   A M O R T I Z A C I O N */
        console.log('');
        console.log('DATOS  TABLA  AMORTIZACION');
        let tasaPromedioBanxico: any;
        let tasaAux: any;
        let tasaReglaTres: any;
        let tasaAmortizacion: any;
        let tasaExtraAmortizacion: any;
        let repagoCapitalAmortizacion: any;
        let tasaTotalAmortizacion: any;

        if (metodo.includes('HIPOTECARIO') && respuestaTasaHipotecaria.includes('SI')) {

          tasaAux = trunc( (Number(tasaBanxico) / 12), 4);
          tasaPromedioBanxico = Number(tasaHipotecariaCliente);
          console.log('TASA PROMEDIO HIPOTECARIA: ' + tasaPromedioBanxico);
          console.log('TASA AUX: ' + tasaAux);

          tasaAmortizacion = Number(tasaPromedioBanxico) / 12;
          console.log('TASA AMORTIZACION: ' + trunc(tasaAmortizacion, 2) );

          tasaReglaTres = - ( ( (tasaAmortizacion * 100) / tasaAux ) - 100 );
          console.log('PORCENTAJE: ' + tasaReglaTres);

          tasaExtraAmortizacion = tasaExtra;
          console.log('TASA EXTRA AMORTIZACION: ' + tasaExtraAmortizacion);

          repagoCapitalAmortizacion = ( repagoCapital * ( 100 + Number(tasaReglaTres) ) ) / 100;
          console.log('REPAGO CAPITAL AMOTIZACION: ' + repagoCapitalAmortizacion);

          tasaTotalAmortizacion = Number(tasaAmortizacion) + Number(tasaExtraAmortizacion) + Number(repagoCapitalAmortizacion);
          console.log('TASA TOTAL AMORTIZACION: ' + tasaTotalAmortizacion);
        } else {

          tasaPromedioBanxico = Number(tasaBanxico);
          console.log('TASA PROMEDIO HIPOTECARIA: ' + tasaPromedioBanxico);

          tasaAmortizacion = Number(tasaPromedioBanxico) / 12;
          console.log('TASA AMORTIZACION: ' + trunc(tasaAmortizacion, 2) );

          tasaExtraAmortizacion = tasaExtra;
          console.log('TASA EXTRA AMORTIZACION: ' + tasaExtraAmortizacion);

          repagoCapitalAmortizacion = Number(repagoCapital);
          console.log('REPAGO CAPITAL AMOTIZACION: ' + repagoCapitalAmortizacion);

          tasaTotalAmortizacion = Number(tasaAmortizacion) + Number(tasaExtraAmortizacion) + Number(repagoCapitalAmortizacion);
          console.log('TASA TOTAL AMORTIZACION: ' + tasaTotalAmortizacion);
        }

        const datosTablaAmortizacion: any = [];
        let montoInicial: any;
        let pagoTotal: any;
        let pagoIntereses: any;
        let pagoCapital: any;

        // CALCULOS
        if (metodo.includes('HIPOTECARIO')) {

          for (let i = 1; i <= 240; i++) {
            if (i === 1) {
              console.log('');
              console.log('PARTIDA ' + i);
              montoInicial = Number(trunc(valorHipoteca, 2));
              console.log('MONTO INICIAL: ' + trunc(montoInicial, 2));
              pagoTotal = ( montoInicial * trunc(tasaTotalAmortizacion, 4) ) / 100;
              console.log('PAGO TOTAL: ' + trunc(pagoTotal, 2));
              pagoIntereses = ( Number(montoInicial) * ( Number(trunc(tasaAmortizacion, 4))
              + Number(trunc(tasaExtraAmortizacion, 4)) ) ) / 100;
              console.log('PAGO INTERESES: ' + pagoIntereses);
              pagoCapital = Number(trunc(pagoTotal, 2)) - Number(trunc(pagoIntereses, 2));
              console.log(i + ' PAGO CAPITAL: ' + trunc(pagoCapital, 2));
            } else {
              console.log('');
              console.log('MES ' + i);
              montoInicial = Number(montoInicial) - Number(pagoCapital);
              console.log(typeof(montoInicial));
              console.log('MONTO INICIAL: ' + trunc(montoInicial, 2));
              pagoTotal = Number(trunc(pagoTotal, 2)) * 0.9998;
              console.log(typeof(pagoTotal));
              console.log('PAGO TOTAL: ' + trunc(pagoTotal, 2));
              pagoIntereses = ( Number(montoInicial) * ( Number(tasaAmortizacion) + Number(tasaExtraAmortizacion) ) ) / 100;
              console.log(typeof(pagoIntereses));
              console.log('PAGO INTERESES: ' + trunc(pagoIntereses, 2));
              pagoCapital = Number(trunc(pagoTotal, 2)) - Number(trunc(pagoIntereses, 2));
              console.log(typeof(pagoCapital));
              console.log('PAGO CAPITAL: ' + trunc(pagoCapital, 2));
            }
            datosTablaAmortizacion.push(
              {
                'numero de mes': i,
                'monto inicial': montoInicial,
                'pago total': pagoTotal,
                'pago intereses': pagoIntereses,
                'pago capital': pagoCapital
              }
            );
          }
          console.log(datosTablaAmortizacion);
        } else {

          console.log('NO ES POSIBLE GENERAR UNA TABLA DE AMORTIZACION PARA ESTE PLAN');
        }
        // FIN CALCULOS

        /* F I N  T A B L A  D E   A M O R T I Z A C I O N */

        /* CALCULO MENSUALIDAD HIPOTECA */
        if (metodo.includes('HIPOTECARIO')) {
          mensualidadHipoteca = trunc(datosTablaAmortizacion[0]['pago intereses'], 2);
        } else {
          mensualidadHipoteca = 0;
        }
        console.log('MENSUALIDAD DE HIPOTECA');
        console.log('Mensualidad: ' + mensualidadHipoteca);
        /* FIN CALCULO MENSUALIDAD HIPOTECA */
        // let tasaPromedio: any = tasa;
        /* CALCULO VALOR RENTA MENOS MANTENIMIENTO */
        if (codigoCompra.includes('RENTA')) {
          valorRentaMenosMantenimiento = ( ( Number(valorInmuebleDescuento) *
          ( 1 + (Number(descuentoVenta) / 100) ) ) * (Number(rentaMercado) / 100) ) -
          ( Number(costoMtto) * Number(metrosCuadradosPrototipo) );
        } else {
          valorRentaMenosMantenimiento = Number(costoMtto) * Number(metrosCuadradosPrototipo);
        }
        console.log('COSTO ESCRITURACION');
        console.log('Costo escrituracion: ' + valorRentaMenosMantenimiento);
        /* FIN CALCULO VALOR RENTA MENOS MANTENIMIENTO */

        /* CALCULO PRECIO DE VENTA */
        let exponente: any;
        let base: any;
        let resPotencia: any;
        base = ( 1 + ( ( (Number(inflacion) / 100) + (Number(plusvalia) / 100) ) / 12 ) );
        exponente = Number(mesesFinanciamientoContrato) + Number(nMeses) + Number(mesReventa);
        resPotencia = Math.pow(base, exponente);
        precioDeVenta = ( Number(valorInmuebleDescuento) * ( 1 + (Number(descuentoVenta) / 100) ) ) * resPotencia;
        console.log('COSTO PRECIO DE VENTA');
        console.log('Costo precio de venta: ' + precioDeVenta);
        /* FIN CALCULO PRECIO DE VENTA */

        /* CALCULO VALOR RESTANTE HIPOTECA */
        if (metodo.includes('HIPOTECARIO')) {
          valorRestanteHipoteca = trunc(datosTablaAmortizacion[mesReventa - 1]['monto inicial'], 2);
        } else {
          valorRestanteHipoteca = 0;
        }
        console.log('VALOR RESTANTO DE LA HIPOTECA');
        console.log('Valor restante hipoteca: ' + valorRestanteHipoteca);
        /* FIN CALCULO VALOR RESTANTE HIPOTECA */

        /* CALCULOS PARA GENERAR EL FLUJO BASICO */
        let cantidadFlujoBasico: any;
        for (let i = 0; i < mesesFinanciamientoContrato; i++) {
          console.log('FLUJO BASICO');
          if (i < mesesFinanciamientoContrato) {
            cantidadFlujoBasico = montoPlazo;
          } else if (i < ( Number(mesesFinanciamientoContrato) + Number(mesesFinanciamientoExtra) )) {
            cantidadFlujoBasico = 0;
          } else if (i === Number(mesesFinanciamientoContrato) + Number(mesesFinanciamientoExtra) ) {
            cantidadFlujoBasico = Number(escrituracion) - Number(montoPlazo) - Number(costoCierre);
          } else if (i < ( Number(mesesFinanciamientoContrato) + Number(mesesFinanciamientoExtra) + Number(mesReventa) )) {
            cantidadFlujoBasico = Number(valorRentaMenosMantenimiento) - Number(2);
          }
        }
        /* CALCULOS PARA GENERAR EL FLUJO BASICO */

      /* FIN INFORMACION FLUJO BASICO */

      });

      $('#btn_hoja_llenado').on('click', () => {
        $('#div_hoja_llenado').show();
        $('#div_calculos_desarrollo').show();
        $('#div_caratula').hide();
        $('#caratula_metodo_financiamiento').val($('#metodo_financiamiento_hoja_llenado').val());
      });

    });
  }

  /* METODO ACTUALIZAR LISTA */
  actualizarListaDesarrollos() {

    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos').subscribe( (data: Desarrollo[]) => {
      this.desarrollos = data;
    } );
  }
  /* FIN METODO ACTUALIZAR LISTA */

  /* OBTIENE DETALLES SUPUESTO DE COMPRA */
  obtenerDetalleSupuestoCompra(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-compra/details/' + id).subscribe(
      (data: SupuestoCompra[]) => {
        this.supuestosCompraDetalles = data;
        console.log('DETALLES SUPUESTOS COMPRA');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES SUPUESTO DE COMPRA */

  /* OBTIENE DETALLES DESARROLLO */
  obtenerDetalleDesarrollo(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos/details/' + id).subscribe(
      (data: Desarrollo[]) => {
        this.desarrolloDetalles = data;
        console.log('DETALLES DESARROLLO');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES DESARROLLO */

  /* OBTIENE DETALLES PROTOTIPO */
  obtenerDetallePrototipo(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/prototipos/details/' + id).subscribe(
      (data: Prototipo[]) => {
        this.prototipoDetalles = data;
        console.log('DETALLES PROTOTIPO');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES PROTOTIPO */

  /* OBTIENE DETALLES DEL PISO */
  obtenerDetallePiso(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/pisos/details/' + id).subscribe(
      (data: Piso[]) => {
        this.pisoDetalles = data;
        console.log('DETALLES PISO');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES DEL PISO */

  /* OBTIENE DETALLES DEL SUPUESTO DE VENTA */
  obtenerDetalleSupuestoVenta(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-venta/details/' + id).subscribe(
      (data: SupuestoVenta[]) => {
        this.supuestoVentaDetalles = data;
        console.log('DETALLES SUPUESTO VENTA');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES DEL SUPUESTO DE VENTA */

  /* OBTIENE DETALLES DEL SUPUESTO HIPOTECARIO */
  obtenerDetalleSupuestoHipotecario(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-hipotecario/details/' + id).subscribe(
      (data: SupuestoHipotecario[]) => {
        this.supuestosHipotecariosDetalles = data;
        console.log('DETALLES SUPUESTO HIPOTECARIO');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES DEL SUPUESTO HIPOTECARIO */

  /* OBTIENE DETALLES DEL SUPUESTO DE OBRA */
  obtenerDetalleSupuestoObra(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-obra/details/' + id).subscribe(
      (data: SupuestoObra[]) => {
        this.supuestosObraDetalles = data;
        console.log('DETALLES SUPUESTO OBRA');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES DEL SUPUESTO DE OBRA */

  /* OBTENER INFORMACION GENERAL */
  obtenerDatos(id: number) {
    console.log('ID del desarrollo.');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-venta/' + id).subscribe(
      (data: SupuestoVenta[]) => {
        this.supuestoVenta = data;
        console.log('INFORMACION SUPUESTO VENTA');
        console.log(data);
      }
    );

    this.httpClient.get(environment.API_ENDPOINT + '/prototipos/' + id).subscribe(
      (data: Prototipo[]) => {
        this.prototipos = data;
        console.log('INFORMACION PROTOTIPO');
        console.log(data);
      }
    );


    this.httpClient.get(environment.API_ENDPOINT + '/pisos/' + id).subscribe(
      (data: Piso[]) => {
        this.pisos = data;
        console.log('INFORMACION PISOS');
        console.log(data);
      }
    );

    this.httpClient.get(environment.API_ENDPOINT + '/plusvalia/' + id).subscribe(
      (data: Plusvalia[]) => {
        this.plusvalias = data;
        console.log('INFORMACION PLUSVALIAS');
        console.log(data);
      }
    );

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-hipotecario/' + id).subscribe(
      (data: SupuestoHipotecario[]) => {
        this.supuestosHipotecarios = data;
        console.log('INFORMACION SUPUESTO HIPOTECARIO');
        console.log(data);
      }
    );

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-compra/' + id).subscribe(
      (data: SupuestoCompra[]) => {
        this.supuestosCompra = data;
        console.log('INFORMACION SUPUESTOS COMPRA');
        console.log(data);
      }
    );

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-obra/' + id).subscribe(
      (data: SupuestoObra[]) => {
        this.supuestosObra = data;
        console.log('INFORMACION SUPUESTOS OBRA');
        console.log(data);
      }
    );

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-mercado/' + id).subscribe(
      (data: SupuestoMercado[]) => {
        this.supuestoMercado = data;
        console.log('INFORMACION SUPUESTOS MERCADO');
        console.log(data);
      }
    );
  }
  /* FIN OBTENER INFORMACION */

  /* CREA EL PDF */
  generarPDF() {

        /* OBTIENE DATOS PARA LA CARATULA */
        let nombreCliente: any;
        let metodo: any;
        let metrosCuadradosPrototipo: any;
        let nombreDepartamento: any;
        let prototipoDepartamento: any;
        let nivelDepartamento: any;
        let torreDepartamento: any;
        let fechaPagoApartado: any;
        let fechaInicioContrato: any;
        let diaPago: any;
        let precioInicialDesarrollo: any;
        let plusvaliaPiso: any;
        let descuentoVenta: any;
        let rendimientoVenta: any;
        let firmaVenta: any;
        let comisionApertura: any;
        let plazoVenta: any;
        let mesesFinanciamientoContrato: any;
        let costo: any;
        let escritura: any;
        let codigoCompra: any;
        let rentaMercado: any;
        let costoMtto: any;
        let agregarCostoMantenimiento: any;
        let inflacion: any;
        let tasaExtra: any;
        let repagoCapital: any;
        let tasaBanxico: any;
        let tasaHipotecariaCliente: any;
        let respuestaTasaHipotecaria: any;

        nombreCliente = $('#nombre_cliente_hoja_llenado').val();
        metodo = $('#nombre_venta').val();
        metrosCuadradosPrototipo = $('#metros_cuadrados_prototipo').val();
        nombreDepartamento = $('#nombre_departamento_hoja_llenado').val();
        prototipoDepartamento = $('#nombre_prototipo_desarrollo').val();
        nivelDepartamento = $('#numero_piso_piso').val();
        torreDepartamento = $('#torre_obra').val();
        fechaPagoApartado = $('#fecha_pago_apartado_hoja_llenado').val();
        fechaInicioContrato = $('#fecha_inicio_contrato_hoja_llenado').val();
        diaPago = $('#dia_pago_hoja_llenado').val();
        precioInicialDesarrollo = $('#precio_incial_desarrollo').val();
        plusvaliaPiso = $('#plusvalia_piso').val();
        descuentoVenta = $('#descuento_venta').val();
        rendimientoVenta = $('#rendimiento_venta').val();
        firmaVenta = $('#firma_venta').val();
        comisionApertura = $('#comision_apertura').val();
        plazoVenta = $('#plazo_venta').val();
        mesesFinanciamientoContrato = $('#meses_plazo_venta').val();
        costo = $('#costo_cierre_mercado').val();
        escritura = $('#escritura_venta').val();
        codigoCompra = $('#codigo_compra').val();
        rentaMercado = $('#renta_mercado').val();
        costoMtto = $('#mantenimiento_mercado').val();
        agregarCostoMantenimiento = $('#agregar_mantenimiento').val();
        inflacion = $('#inflacion_mercado').val();
        tasaExtra = $('#tasa_extra').val();
        repagoCapital = $('#repago_capital').val();
        tasaBanxico = $('#tasa_banxico').val();
        tasaHipotecariaCliente = $('#tasa_cliente').val();
        respuestaTasaHipotecaria = $('#tasa_hipotecaria_llenado').val();

        let plusvalia: any;
        if ($('#tasa_plusvalia').val() === 'SI') {
          plusvalia = $('#tasa_plusvalia_hoja_llenado').val();
        } else if ($('#tasa_plusvalia').val() === 'NO') {
          plusvalia = $('#tasa_0').val();
          $('#caratula_tasa_hipotecaria').val(tasaBanxico);
        }

        const fechaInicioDesarrollo: any = $('#fecha_inicio_desarrollo').val();
        const fechaTerminoObra: any = $('#fecha_termino_obra').val();

        /* OBTENEMOS LA DIFERENCIA DE MESES */
        let fechaInicio: any;
        let fechaFin: any;
        let nMeses: any;
        // fechaInicio = new Date(fechaInicioDesarrollo);
        fechaInicio = new Date(fechaInicioDesarrollo);
        fechaFin = new Date(fechaTerminoObra);

        const a1: any = fechaInicio.getFullYear();
        const a2: any = fechaFin.getFullYear();
        let m1: any = fechaInicio.getMonth();
        let m2: any = fechaFin.getMonth();

        if (m1 === 0) {
          m1++;
          m2++;
        }
        nMeses = ( ( (a2 - a1) * 12 + (m2 - m1) ) + 1 ) - Number(mesesFinanciamientoContrato);
        console.log('Dif meses: ' + nMeses);
        const mesesFinanciamientoExtra: any = $('#caratula_meses_financimiento_extra').val(nMeses);
        /* FIN OBTENEMOS LA DIFERENCIA DE MESES */

        $('#div_caratula').show();
        $('#div_hoja_llenado').hide();
        $('#div_calculos_desarrollo').hide();
        $('#caratula_metodo_financiamiento').val(metodo);
        $('#caratula_metros_cuadrados').val(metrosCuadradosPrototipo);
        $('#caratula_precio_inicial').val(precioInicialDesarrollo);
        $('#caratula_plusvalia_piso').val(plusvaliaPiso); // plusvalia
        $('#caratula_descuento_mf').val(descuentoVenta);
        $('#caratula_rendimiento').val(rendimientoVenta);
        $('#caratula_pago_plazos').val(plazoVenta);
        $('#caratula_conoce_tasa').val(respuestaTasaHipotecaria);
        $('#caratula_costo_cierre').val(costo);
        $('#caratula_meses_financiamiento').val(mesesFinanciamientoContrato);
        $('#caratula_fecha_inicio_obra').val(fechaInicioDesarrollo);
        $('#caratula_fecha_fin_torre').val(fechaTerminoObra);
        $('#caratula_objetivo_compra').val($('#objetivo_compra').val());
        $('#caratula_codigo_compra').val(codigoCompra);
        $('#caratula_inflacion').val(inflacion);
        $('#caratula_agrego_plusvalia').val($('#tasa_plusvalia').val());

        /* OBTIENE MESES REVENTA */
        let añosObjetivo: any;
        let mesReventa: any;
        añosObjetivo = $('#años_objetivo_compra').val();
        mesReventa = añosObjetivo * 12;

        if (mesReventa === 0) {
          $('#caratula_mes_reventa').val('1');
          mesReventa = 1;
        } else {
          $('#caratula_mes_reventa').val(mesReventa);
        }
        /* FIN OBTIENE MESES REVENTA */

        let mesesPagoHipoteca: any;
        /* OBTIENE MESES DE PAGO HIPOTECA */
        if (metodo.includes('HIPOTECARIO')) {
          mesesPagoHipoteca = mesReventa;
        } else {
          mesesPagoHipoteca = 'No aplica';
        }
        /* FIN OBTIENE MESES DE PAGO HIPOTECA */

        /* VALIDA METODO DE FINANCIAMIENTO */
        if (metodo.includes('HIPOTECARIO')) {

          $('#caratula_comision_apertura').val(comisionApertura);
        } else {
          $('#caratula_comision_apertura').val(0);
        }
        /* FIN VALIDA METODO DE FINANCIAMIENTO*/

        /* VALIDA RESPUESTA CONOCE TASA BANCO */
        if ($('#caratula_conoce_tasa').val() === 'SI') {

          $('#caratula_tasa_hipotecaria').val($('#tasa_cliente').val());
        } else if ($('#caratula_conoce_tasa').val() === 'NO') {

          $('#caratula_tasa_hipotecaria').val($('#tasa_banxico').val());
        }
        /* FIN VALIDA RESPUESTA CONOCE TASA BANCO */

        /* VALIDA RESPUESTA AGREGAR TASA PLUSVALIA */
        if ($('#caratula_agrego_plusvalia').val() === 'SI') {

          $('#caratula_plusvalia').val($('#tasa_plusvalia_hoja_llenado').val());
        } else if ($('#caratula_agrego_plusvalia').val() === 'NO') {

          $('#caratula_plusvalia').val('0');
        }
        /* FIN VALIDA RESPUESTA AGREGAR TASA PLUSVALIA */
      /* FIN OBTIENE DATOS PARA LA CARATULA */

      /* INFORMACION FLUJO BASICO */
        let valorInmuebleDescuento: any;
        let pagoInicial: any;
        let pagoFirma: any;
        let porcentajeComisionInmueble: any;
        let montoPlazo: any;
        let costoCierre: any;
        let escrituracion: any;
        let valorHipoteca: any;
        let mensualidadHipoteca: any;
        let valorRentaMenosMantenimiento: any;
        let precioDeVenta: any;
        let valorRestanteHipoteca: any;

        valorInmuebleDescuento = precioInicialDesarrollo * metrosCuadradosPrototipo
        * (1 + (plusvaliaPiso / 100)) * (1 - (descuentoVenta / 100 ));
        // (valorInmuebleDescuento * (1 + (comisionApertura / 100)) - valorInmuebleDescuento );

        /* CALCULO DEL PAGO INICIAL Y PAGO A LA FIRMA */
        if (firmaVenta.length > 3) {
          porcentajeComisionInmueble = Number(valorInmuebleDescuento) * (1 + (Number(comisionApertura) / 100)) -
          Number(valorInmuebleDescuento);
          pagoFirma = Number(firmaVenta) + Number(porcentajeComisionInmueble);
          pagoInicial = Number(firmaVenta);
        } else {
          pagoFirma = ((Number(firmaVenta) / 100) * Number(valorInmuebleDescuento)) + Number(porcentajeComisionInmueble);
          pagoInicial = ((Number(firmaVenta) / 100) * Number(valorInmuebleDescuento));
        }
        $('#caratula_pago_firma').val(pagoInicial);
        console.log('PAGO INICIAL Y PAGO A LA FIRMA');
        console.log('Pago a la firma: ' + pagoFirma);
        console.log('Porcentaje comision inmueble: ' + porcentajeComisionInmueble);
        console.log('Pago inicial: ' + pagoInicial);
        /* FIN CALCULO DEL PAGO INICIAL Y PAGO A LA FIRMA */

        /* CALCULO DEL MONTO PLAZO */
        if (metodo.includes('PLAZO PLUS')) {

          montoPlazo =  ( Number(valorInmuebleDescuento) * (Number(plazoVenta) / 100) - Number(pagoInicial))
          / mesesFinanciamientoContrato;
          console.log('PRUEBA MONTO PLAZO 3: ' + montoPlazo);
          // montoPlazo =  ( Number(valorInmuebleDescuento) * Number(plazoVenta) - Number(pagoInicial) ) /
          Number(mesesFinanciamientoContrato);
        } else if (plazoVenta === '0') {

          montoPlazo = 0;
          console.log('PRUEBA MONTO PLAZO 2: ' + montoPlazo);
        } else if (metodo.includes('PLAZO')) {

          montoPlazo = (Number(valorInmuebleDescuento) * (Number(plazoVenta) / 100)) / Number(mesesFinanciamientoContrato);
          console.log('PRUEBA MONTO PLAZO 1: ' + montoPlazo);
        } else {
          montoPlazo =  ( Number(valorInmuebleDescuento) * (Number(plazoVenta) / 100) - Number(pagoInicial))
          / mesesFinanciamientoContrato;
          console.log('PRUEBA MONTO PLAZO 3: ' + montoPlazo);
          // montoPlazo =  ( Number(valorInmuebleDescuento) * Number(plazoVenta) - Number(pagoInicial) ) /
          Number(mesesFinanciamientoContrato);
        }
        console.log('MONTO PLAZO');
        console.log('Valor inmueble: ' + valorInmuebleDescuento);
        console.log('Plazo Venta: ' + (plazoVenta / 100));
        console.log('Pago inicial: ' + pagoInicial);
        console.log('Meses financiamiento: ' + mesesFinanciamientoContrato);
        console.log('Monto plazo: ' + montoPlazo);
        /* FIN CALCULO DEL MONTO PLAZO */

        /* CALCULO COSTO CIERRE */
        if (metodo.includes('HIPOTECARIO')) {
          costoCierre = ( (Number(valorInmuebleDescuento) * (Number(costo) / 100)) )
          + ( Number(valorInmuebleDescuento) * Number(comisionApertura / 100) );
        } else {
          costoCierre = (Number(valorInmuebleDescuento) * (Number(costo) / 100));
        }
        console.log('COSTO CIERRE');
        console.log('Costo cierre: ' + costoCierre);
        /* FIN CALCULO COSTO CIERRE */

        /* CALCULO ESCITURACION */
        if (metodo.includes('HIPOTECARIO')) {
          escrituracion = 0;
        } else {
          escrituracion = (Number(valorInmuebleDescuento) * (Number(escritura) / 100));
        }
        console.log('COSTO ESCRITURACION');
        console.log('Costo escrituracion: ' + escrituracion);
        /* FIN CALCULO ESCITURACION */

        /* CALCULO VALOR HIPOTECA */
        if (metodo.includes('HIPOTECARIO')) {
          valorHipoteca = Number(valorInmuebleDescuento) * (1 - (Number(plazoVenta) / 100));
        } else {
          valorHipoteca = 0;
        }

        console.log('VALOR HIPOTECA');
        console.log('Valor Hipoteca: ' + valorHipoteca);
        /* FIN CALCULO VALOR HIPOTECA */

        /* T A B L A  D E   A M O R T I Z A C I O N */
        console.log('');
        console.log('DATOS  TABLA  AMORTIZACION');


        let tasaInteresAnual: any;
        let tasaInteresMensual: any;
        let periodosMensuales: any;
        let cuotaFijaMensual: any;
        let baseCalculo: any;
        let exponenteCalculo: any;

        periodosMensuales = 240;

        if (metodo.includes('HIPOTECARIO') && respuestaTasaHipotecaria.includes('SI')) {

          tasaInteresAnual = Number(tasaHipotecariaCliente);
          baseCalculo = (1 + (tasaInteresAnual / 100));
          exponenteCalculo = (1 / 12);
          tasaInteresMensual = Math.pow(baseCalculo, exponenteCalculo) - 1;
          cuotaFijaMensual = (tasaInteresMensual * Math.pow( (1 + tasaInteresMensual) , periodosMensuales) * valorHipoteca) /
          ( ( Math.pow( (1 + tasaInteresMensual) , periodosMensuales) ) - 1 );
        } else {

          tasaInteresAnual = Number(tasaBanxico);
          baseCalculo = (1 + (tasaInteresAnual / 100));
          exponenteCalculo = (1 / 12);
          tasaInteresMensual = Math.pow(baseCalculo, exponenteCalculo) - 1;
          cuotaFijaMensual = (tasaInteresMensual * Math.pow( (1 + tasaInteresMensual) , periodosMensuales) * valorHipoteca) /
          ( ( Math.pow( (1 + tasaInteresMensual) , periodosMensuales) ) - 1 );
        }

        console.log('Cuota fija mensual ' + cuotaFijaMensual);

        const datosTablaAmortizacion: any = [];
        // TABLA DE AMORTIZACION HIPOTECARIA
        const tablaAmortizacion: any = [];

        // CORRIDA FINANCIERA
        const tablaCorridaFinanciera: any = [];
        let montoInicial: any;
        let cuotaAmortizacion: any;
        let pagoIntereses: any;
        let pagoCapital: any;
        let saldoFinal: any;
        /* NUMERO DE PAGINA DEL PDF */

        // CALCULOS
        if (metodo.includes('HIPOTECARIO')) {
          for (let i = 1; i <= 240; i++) {
            if (i === 1) {
              // console.log('');
              console.log('PARTIDA ' + i);
              montoInicial = Number(valorHipoteca);
              console.log('MONTO INICIAL: ' + montoInicial);

              console.log('CUOTA AMORTIZACION ' + i);
              cuotaAmortizacion = Number(cuotaFijaMensual);
              console.log('CUOTA AMORTIZACION: ' + cuotaAmortizacion);

              pagoIntereses = Number(montoInicial) * Number(tasaInteresMensual);
              console.log('PAGO INTERESES: ' + pagoIntereses);
              // alert('PAGO INTERESES: ' + pagoIntereses);

              pagoCapital = Number(trunc(cuotaAmortizacion, 2)) - Number(pagoIntereses);
              console.log(i + ' PAGO CAPITAL: ' + pagoCapital);
              // alert('PAGO CAPITAL: ' + trunc(pagoCapital, 2));

              saldoFinal = Number(montoInicial) - Number(pagoCapital);
            } else {
              // console.log('');
              console.log('MES ' + i);
              montoInicial = Number(saldoFinal);
              console.log('MONTO INICIAL: ' + montoInicial);

              console.log('CUOTA AMORTIZACION ' + i);
              cuotaAmortizacion = Number(cuotaFijaMensual);
              console.log('CUOTA AMORTIZACION: ' + cuotaAmortizacion);

              pagoIntereses = Number(montoInicial) * Number(tasaInteresMensual);
              console.log('PAGO INTERESES: ' + pagoIntereses);

              pagoCapital = Number(cuotaAmortizacion) - Number(pagoIntereses);
              console.log(i + ' PAGO CAPITAL: ' + pagoCapital);
              saldoFinal = Number(montoInicial) - Number(pagoCapital);
              if (i === 240) {
                saldoFinal = Number(montoInicial) - Number(pagoCapital);
                saldoFinal = Math.floor(saldoFinal);
              }

            }
            datosTablaAmortizacion.push(
              {
                'numero de mes': i,
                'monto inicial': montoInicial,
                'cuota fija': cuotaAmortizacion,
                'pago intereses': pagoIntereses,
                'pago capital': pagoCapital,
                'saldo final': saldoFinal
              }
            );
            tablaAmortizacion.push(
              [
                i,
                montoInicial,
                cuotaAmortizacion,
                pagoIntereses,
                pagoCapital,
                saldoFinal
              ]
            );
          }
          console.log('TABLA DE AMORTIZACION:');
          console.log(datosTablaAmortizacion);
        } else {

          console.log('NO ES POSIBLE GENERAR UNA TABLA DE AMORTIZACION PARA ESTE PLAN');
        }
        // FIN CALCULOS


        /* F I N  T A B L A  D E   A M O R T I Z A C I O N */

        /* CALCULO MENSUALIDAD HIPOTECA */
        if (metodo.includes('HIPOTECARIO')) {
          mensualidadHipoteca = datosTablaAmortizacion[0]['cuota fija'];
        } else {
          mensualidadHipoteca = 0;
        }
        console.log('MENSUALIDAD DE HIPOTECA');
        console.log('Mensualidad: ' + mensualidadHipoteca);
        /* FIN CALCULO MENSUALIDAD HIPOTECA */

        /* CALCULO VALOR RENTA MENOS MANTENIMIENTO */
        if (codigoCompra.includes('RENTA')) {
          // alert('RENTA')
          if (agregarCostoMantenimiento === 'SI') {
            valorRentaMenosMantenimiento = ( ( Number(valorInmuebleDescuento) *
            ( 1 + (Number(descuentoVenta) / 100) ) ) * (Number(rentaMercado) / 100) ) +
            ( Number(costoMtto) * Number(metrosCuadradosPrototipo) );
          } else {
            valorRentaMenosMantenimiento = ( ( Number(valorInmuebleDescuento) *
            ( 1 + (Number(descuentoVenta) / 100) ) ) * (Number(rentaMercado) / 100) ) -
            ( Number(costoMtto) * Number(metrosCuadradosPrototipo) );
          }

        } else {
          // alert('PROPIO');
          valorRentaMenosMantenimiento = -( Number(costoMtto) * Number(metrosCuadradosPrototipo) );
        }
        console.log('RENTA COSTO MENOS MANTENIMIENTO');
        console.log('Renta costo menos mantenimiento: ' + valorRentaMenosMantenimiento);
        /* FIN CALCULO VALOR RENTA MENOS MANTENIMIENTO */

        /* CALCULO PRECIO DE VENTA */
        let exponente: any;
        let base: any;
        let resPotencia: any;
        base = ( 1 + ( ( (Number(inflacion) / 100) + (Number(plusvalia) / 100) ) / 12 ) );
        exponente = Number(mesesFinanciamientoContrato) + Number(nMeses) + Number(mesReventa);
        resPotencia = Math.pow(base, exponente);
        precioDeVenta = ( Number(valorInmuebleDescuento) * ( 1 + (Number(descuentoVenta) / 100) ) ) * ( resPotencia );
        console.log('COSTO PRECIO DE VENTA');
        console.log('Costo precio de venta: ' + precioDeVenta);
        /* FIN CALCULO PRECIO DE VENTA */

        /* CALCULO VALOR RESTANTE HIPOTECA */
        if (metodo.includes('HIPOTECARIO')) {
          valorRestanteHipoteca = trunc(datosTablaAmortizacion[mesReventa - 1]['monto inicial'], 2);
        } else {
          valorRestanteHipoteca = 0;
        }
        console.log('VALOR RESTANTO DE LA HIPOTECA');
        console.log('Valor restante hipoteca: ' + valorRestanteHipoteca);
        /* FIN CALCULO VALOR RESTANTE HIPOTECA */

        let cantidadFlujoRentaContado: any;
        const datosFlujoRentaContado: any = [];
        let cantidadFlujoBasico: any;
        const datosFlujoBasico: any = [];
        let cantidadModificacionesPlazoPlus: any;
        const datosModificacionesPlazoPlus: any = [];
        const datosPrecioFinal: any = [];
        cantidadFlujoBasico = - Number(escrituracion) - Number(montoPlazo) - Number(costoCierre);

        /* CALCULOS PARA GENERAR EL FLUJO BASICO */
        console.log('');
        console.log('Meses financiamiento contrato: ' + mesesFinanciamientoContrato);
        console.log('Meses financiamiento extra obra: ' + nMeses);
        console.log('FLUJO BASICO');
        datosPrecioFinal.push([pagoInicial]);

        for (let i = 1; i <= 240; i++) {
          if (i < mesesFinanciamientoContrato) {

            cantidadFlujoBasico = - Number(montoPlazo);
            // console.log(i + ' Entra primer condicion');
            // console.log(montoPlazo);
          } else if (i < ( Number(mesesFinanciamientoContrato) + Number(nMeses) )) {

            cantidadFlujoBasico = 0;
            // console.log(i + ' Entra segunda condicion');
            // console.log(cantidadFlujoBasico);
          } else if (i === Number(mesesFinanciamientoContrato) + Number(nMeses) ) {

            cantidadFlujoBasico = - Number(escrituracion) - Number(montoPlazo) - Number(costoCierre);
            // console.log(i + ' Entra tercer condicion');
          } else if (i < ( Number(mesesFinanciamientoContrato) + Number(nMeses) + Number(mesReventa) )) {

            cantidadFlujoBasico = ( Number(valorRentaMenosMantenimiento) ) - Number(mensualidadHipoteca);
            // console.log(i + ' Entra cuarta condicion');
          } else  if (i === ( Number(mesesFinanciamientoContrato) + Number(nMeses) + Number(mesReventa) )) {

            cantidadFlujoBasico = Number(precioDeVenta) + Number(valorRentaMenosMantenimiento)
            - Number(mensualidadHipoteca) - Number(valorRestanteHipoteca);
            // console.log(i + ' Entra quinta condicion');
          } else {

            cantidadFlujoBasico = 0;
            // console.log(i + ' Entra sexta condicion');
          }
          datosFlujoBasico.push(
            {
              numero: i,
              valor: cantidadFlujoBasico
            }
          );
        }

        console.log('');
        console.log('');
        console.log('DATOS FLUJO BASICO');
        console.log(datosFlujoBasico);
        /* CALCULOS PARA GENERAR EL FLUJO BASICO */

        /* CALCULOS PARA FLUJO MODIFICACIONES RENTA CONTADO */
        let sumaCantidadFlujoRentaContado: any;
        sumaCantidadFlujoRentaContado = 0;
        if (metodo.includes('RENTA CONTADO')) {
          datosPrecioFinal.push([0]);
          for (let i = 1; i <= 240; i++) {

            if (i < ( Number(mesesFinanciamientoContrato) + Number(nMeses) + Number(mesReventa) )) {
              if (Number(rendimientoVenta) > 0) {
                cantidadFlujoRentaContado = Number(pagoInicial) * ( ( Number(rendimientoVenta) / 100 ) / 12 );
              } else {
                cantidadFlujoRentaContado = 0;
              }
            } else {
              cantidadFlujoRentaContado = 0;
            }

            sumaCantidadFlujoRentaContado = sumaCantidadFlujoRentaContado + cantidadFlujoRentaContado;
            datosFlujoRentaContado.push(
              {
                numero: i,
                valor: cantidadFlujoRentaContado
              }
            );
          }
        }
        console.log('');
        console.log('');
        console.log('DATOS MODIFICACIONES RENTA CONTADO');
        console.log(datosFlujoRentaContado);
        console.log('Ingresos proyectados por rentas: ' + sumaCantidadFlujoRentaContado);
        /* CALCULOS PARA FLUJO MODIFICACIONES RENTA CONTADO */

        /* CALCULOS PARA MODIFICACIONES PLAZO PLUS */
        if (metodo.includes('PLAZO PLUS')) {
          datosPrecioFinal.push([0]);
          for (let i = 1; i <= 240; i++) {
            if (i === Number(mesesFinanciamientoContrato)) {
              cantidadModificacionesPlazoPlus = - Number(montoPlazo);
            } else if (i === ( Number(mesesFinanciamientoContrato) + Number(nMeses) )) {
              cantidadModificacionesPlazoPlus = Number(montoPlazo);
            } else {
              cantidadModificacionesPlazoPlus = 0;
            }
            datosModificacionesPlazoPlus.push(
              {
                numero: i,
                valor: cantidadModificacionesPlazoPlus
              }
            );
          }
        }
        console.log('');
        console.log('');
        console.log('DATOS MODIFICACIONES PLAZO PLUS');
        console.log(datosModificacionesPlazoPlus);
        /*  FIN CALCULOS PARA MODIFICACIONES PLAZO PLUS */
      /* FIN INFORMACION FLUJO BASICO */

      /* CALCULO FLUJO FINAL */

        // VARIABLE PARA ALMACENAR LOS DATOS DE LOS FLUJOS
        const datosFlujoFinal: any = [];
        // VARIABLE QUE CONTIENE LA SUMA DE LOS FLUJOS
        const valores: any = [];
        // VARIABLE QUE CONTIENE LA SUMA DE LOS VALORES
        const sumaValores: any = [];
        /*
          SE VALIDA SI EXISTE INFORMACION EN EL FLUJO.
          DE SER ASI, SE GUARDAN EN LA VARIABLE datosFlujoFinal
        */
        if (datosFlujoBasico.length > 0) {
          datosFlujoFinal.push([datosFlujoBasico]);
        }
        if (datosFlujoRentaContado.length > 0) {
          datosFlujoFinal.push([datosFlujoRentaContado]);
        }
        if (datosModificacionesPlazoPlus.length > 0) {
          datosFlujoFinal.push([datosModificacionesPlazoPlus]);
        }

        /* SE OBTIENE LOS VALORES DEL ARRAY */
        // OBTIENE LA SUMA DE LOS NUMERO NEGATIVOS
        let datosNumerosNegativos: any = 0;
        for (let i = 0; i < datosFlujoFinal.length; i++) {

          for (let j = 0; j < datosFlujoFinal[i].length; j++) {

            for (let k = 0; k < datosFlujoFinal[i][j].length; k++) {

              if (datosFlujoFinal[i][j][k].valor < 0) {
                datosNumerosNegativos = datosNumerosNegativos + Number(datosFlujoFinal[i][j][k].valor);
              }
              valores.push([datosFlujoFinal[i][j][k].valor]);
            }
          }
         }
         /* FIN */

         /* OBTENER VALORES */
         // DIVISOR
        let divisor: any;
        divisor = datosFlujoFinal.length;
        // NUMERO DE DATOS
        let numeroDatos: any;
        numeroDatos = valores.length;
        let resultadoDatos: any;
        resultadoDatos = numeroDatos / divisor;
        switch (divisor) {
          case 1:
            console.log('uno');
            for (let irf = 0; irf < resultadoDatos; irf++) {
              console.log('');
              console.log(irf + 1);
              console.log('Valores primer flujo: ' + valores[irf]);
              console.log('Resultado de Posicion ' + irf);
              console.log('Suma de flujos: ' + (Number(valores[irf])) );
              sumaValores.push([Number(valores[irf])]);
            }
            break;
          case 2:
            console.log('dos');
            console.log(resultadoDatos);
            for (let irf = 0; irf < resultadoDatos; irf++) {
              let x = resultadoDatos;
              x = (x) + irf;
              console.log('');
              console.log('POSICION: ' + irf);
              console.log('Array 1 ' + 'Posicion ' + irf + '. Valores primer flujo: ' + valores[irf]);
              console.log('Array 2 ' + 'Posicion ' + x + '. Valores segundo flujo: ' + valores[x]);
              console.log('Resultado de Posicion ' + irf + ' + Posicion ' + x);
              console.log('Suma de flujos: ' + (Number(valores[irf]) + Number(valores[x])));
              sumaValores.push([(Number(valores[irf]) + Number(valores[x]))]);
            }
            break;
          case 3:
            console.log('tres');
            break;
          default:
            console.log('Caso de uso no especificado');
            break;
        }
        console.log('');
        console.log('FLUJO FINAL');
        console.log(sumaValores);
         /* OBTENER VALORES */
      /* FIN CALCULO FLUJO FINAL */

      /* DATOS DE INFORMACION FINANCIERA */
        let precioProyectoVenta: any;
        let ingresosProyectadosPorRenta: any;
        let capital: any;
        let creditoHipotecarioRestante: any;
        let utilidad: any;
        let resultadoUtilidad: any;
        let cashMultiple: any;
        let tirMensual: any;
        let tirAnualizado: any;

        console.log('');
        console.log('INFORMACION FINANCIERA');
        // PRECIO PROYECTADO DE VENTA
        precioProyectoVenta = Number(precioDeVenta);
        console.log('PRECIO PROYECTADO POR VENTA: ' + precioProyectoVenta);
        // FIN PRECIO PROYECTADO DE VENTA

        // INGRESOS PROYECTADOS POR VENTAS
        if (codigoCompra.includes('RENTA')) {
          ingresosProyectadosPorRenta = Number(valorRentaMenosMantenimiento) * Number(mesReventa);
        } else {
          ingresosProyectadosPorRenta = 0;
        }
        console.log('INGRESO PROYECTADO POR RENTA: ' + ingresosProyectadosPorRenta);
        // FIN INGRESOS PROYECTADOS POR VENTAS

        // CREDITO HIPOTECARIO RESTANTE
        if (valorRestanteHipoteca === 0) {
          creditoHipotecarioRestante = 'No aplica';
        } else {
          creditoHipotecarioRestante = - (Number(valorRestanteHipoteca));
        }
        console.log('CREDITO HIPOTECARIO RESTANTE: ' + creditoHipotecarioRestante);
        // FIN CREDITO HIPOTECARIO RESTANTE

        // UTILIDAD
        utilidad = - pagoInicial;
        resultadoUtilidad = 0;
        for (let i = 0; i < sumaValores.length; i++) {

          utilidad = (Number(utilidad) + Number(sumaValores[i]));
        }

        let valorPrecioFinal: any = 0;
        switch (((datosPrecioFinal.toString()).split(',')).length) {
          case 1:
            valorPrecioFinal = Number( ( (datosPrecioFinal.toString()).split(','))[0] );
            break;

          case 2:
            valorPrecioFinal = Number( ((datosPrecioFinal.toString()).split(','))[0] )
            + Number( ((datosPrecioFinal.toString()).split(','))[1] );
            break;

            case 3:
              valorPrecioFinal = Number( ((datosPrecioFinal.toString()).split(','))[0] )
              + Number( ((datosPrecioFinal.toString()).split(','))[1] )
              + Number( ((datosPrecioFinal.toString()).split(','))[2] );
              break;
        }
        resultadoUtilidad = Number(utilidad)  - Number(valorPrecioFinal);
        // console.log('UTILIDAD: ' + utilidad);
        // console.log('PRECIO FINAL: ' + valorPrecioFinal);
        console.log('RESULTADO UTILIDAD: ' + utilidad);
        console.log('RESULTADO UTILIDAD: ' + resultadoUtilidad);
        // UTILIDAD

        // CAPITAL
        if (metodo.includes('HIPOTECARIO')) {
          capital = ( Number(datosNumerosNegativos) + ( - valorPrecioFinal) ) +
          ( (Number(-mensualidadHipoteca)) + Number(valorRentaMenosMantenimiento) );
        } else if (codigoCompra.includes('RENTA')) {
          capital = ( Number(datosNumerosNegativos) + ( - valorPrecioFinal) ) - Number(mensualidadHipoteca);
        } else {
          capital = ( Number(datosNumerosNegativos) + ( - valorPrecioFinal) ) +
          ( (Number(-mensualidadHipoteca)) + Number(valorRentaMenosMantenimiento) );
        }
        console.log('MENSUALIDAD HIPOTECA: ' + mensualidadHipoteca);
        console.log('VALOR RENTA MENOS MTTO: ' + valorRentaMenosMantenimiento);
        console.log('SUMA NEGATIVOS: ' + datosNumerosNegativos);
        console.log('PRECIO FINAL: ' + valorPrecioFinal);
        console.log('SUMA: ' + ( Number(datosNumerosNegativos) + ( - valorPrecioFinal) ) );
        console.log('CAPITAL: ' + capital);
        // FIN CAPITAL

        // CASH MULTIPLE
        cashMultiple = (- capital + utilidad) / - capital;
        console.log('CASH MULTIPLE: ' + cashMultiple);
        // FIN CASH MULTIPLE

        // TIR MENSUAL
        let finance: any;
        finance = new Finance();
        tirMensual = finance.IRR(-pagoInicial,
          Number(sumaValores[0]), Number(sumaValores[1]), Number(sumaValores[2]), Number(sumaValores[3]), Number(sumaValores[4]),
          Number(sumaValores[5]), Number(sumaValores[6]), Number(sumaValores[7]), Number(sumaValores[8]), Number(sumaValores[9]),
          Number(sumaValores[10]), Number(sumaValores[11]), Number(sumaValores[12]), Number(sumaValores[13]), Number(sumaValores[14]),
          Number(sumaValores[15]), Number(sumaValores[16]), Number(sumaValores[17]), Number(sumaValores[18]), Number(sumaValores[19]),
          Number(sumaValores[20]), Number(sumaValores[21]), Number(sumaValores[22]), Number(sumaValores[23]), Number(sumaValores[24]),
          Number(sumaValores[25]), Number(sumaValores[26]), Number(sumaValores[27]), Number(sumaValores[28]), Number(sumaValores[29]),
          Number(sumaValores[30]), Number(sumaValores[31]), Number(sumaValores[32]), Number(sumaValores[33]), Number(sumaValores[34]),
          Number(sumaValores[35]), Number(sumaValores[36]), Number(sumaValores[37]), Number(sumaValores[38]), Number(sumaValores[39]),
          Number(sumaValores[40]), Number(sumaValores[41]), Number(sumaValores[42]), Number(sumaValores[43]), Number(sumaValores[44]),
          Number(sumaValores[45]), Number(sumaValores[46]), Number(sumaValores[47]), Number(sumaValores[48]), Number(sumaValores[49]),
          Number(sumaValores[50]), Number(sumaValores[51]), Number(sumaValores[52]), Number(sumaValores[53]), Number(sumaValores[54]),
          Number(sumaValores[55]), Number(sumaValores[56]), Number(sumaValores[57]), Number(sumaValores[58]), Number(sumaValores[59]),
          Number(sumaValores[60]), Number(sumaValores[61]), Number(sumaValores[62]), Number(sumaValores[63]), Number(sumaValores[64]),
          Number(sumaValores[65]), Number(sumaValores[66]), Number(sumaValores[67]), Number(sumaValores[68]), Number(sumaValores[69]),
          Number(sumaValores[70]), Number(sumaValores[71]), Number(sumaValores[72]), Number(sumaValores[73]), Number(sumaValores[74]),
          Number(sumaValores[75]), Number(sumaValores[76]), Number(sumaValores[77]), Number(sumaValores[78]), Number(sumaValores[79]),
          Number(sumaValores[80]), Number(sumaValores[81]), Number(sumaValores[82]), Number(sumaValores[83]), Number(sumaValores[84]),
          Number(sumaValores[85]), Number(sumaValores[86]), Number(sumaValores[87]), Number(sumaValores[88]), Number(sumaValores[89]),
          Number(sumaValores[90]), Number(sumaValores[91]), Number(sumaValores[92]), Number(sumaValores[93]), Number(sumaValores[94]),
          Number(sumaValores[95]), Number(sumaValores[96]), Number(sumaValores[97]), Number(sumaValores[98]), Number(sumaValores[99]),
          Number(sumaValores[100]), Number(sumaValores[101]), Number(sumaValores[102]), Number(sumaValores[103]), Number(sumaValores[104]),
          Number(sumaValores[115]), Number(sumaValores[106]), Number(sumaValores[107]), Number(sumaValores[108]), Number(sumaValores[109]),
          Number(sumaValores[110]), Number(sumaValores[111]), Number(sumaValores[112]), Number(sumaValores[113]), Number(sumaValores[114]),
          Number(sumaValores[115]), Number(sumaValores[116]), Number(sumaValores[117]), Number(sumaValores[118]), Number(sumaValores[119]),
          Number(sumaValores[120]), Number(sumaValores[121]), Number(sumaValores[122]), Number(sumaValores[123]), Number(sumaValores[124]),
          Number(sumaValores[125]), Number(sumaValores[126]), Number(sumaValores[127]), Number(sumaValores[128]), Number(sumaValores[129]),
          Number(sumaValores[130]), Number(sumaValores[131]), Number(sumaValores[132]), Number(sumaValores[133]), Number(sumaValores[134]),
          Number(sumaValores[135]), Number(sumaValores[136]), Number(sumaValores[137]), Number(sumaValores[138]), Number(sumaValores[139]),
          Number(sumaValores[140]), Number(sumaValores[141]), Number(sumaValores[142]), Number(sumaValores[143]), Number(sumaValores[144]),
          Number(sumaValores[145]), Number(sumaValores[146]), Number(sumaValores[147]), Number(sumaValores[148]), Number(sumaValores[149]),
          Number(sumaValores[150]), Number(sumaValores[151]), Number(sumaValores[152]), Number(sumaValores[153]), Number(sumaValores[154]),
          Number(sumaValores[155]), Number(sumaValores[156]), Number(sumaValores[157]), Number(sumaValores[158]), Number(sumaValores[159]),
          Number(sumaValores[160]), Number(sumaValores[161]), Number(sumaValores[162]), Number(sumaValores[163]), Number(sumaValores[164]),
          Number(sumaValores[165]), Number(sumaValores[166]), Number(sumaValores[167]), Number(sumaValores[168]), Number(sumaValores[169]),
          Number(sumaValores[170]), Number(sumaValores[171]), Number(sumaValores[172]), Number(sumaValores[173]), Number(sumaValores[174]),
          Number(sumaValores[175]), Number(sumaValores[176]), Number(sumaValores[177]), Number(sumaValores[178]), Number(sumaValores[179]),
          Number(sumaValores[180]), Number(sumaValores[181]), Number(sumaValores[182]), Number(sumaValores[183]), Number(sumaValores[184]),
          Number(sumaValores[185]), Number(sumaValores[186]), Number(sumaValores[187]), Number(sumaValores[188]), Number(sumaValores[189]),
          Number(sumaValores[190]), Number(sumaValores[191]), Number(sumaValores[192]), Number(sumaValores[193]), Number(sumaValores[194]),
          Number(sumaValores[195]), Number(sumaValores[196]), Number(sumaValores[197]), Number(sumaValores[198]), Number(sumaValores[199]),
          Number(sumaValores[200]), Number(sumaValores[201]), Number(sumaValores[202]), Number(sumaValores[203]), Number(sumaValores[204]),
          Number(sumaValores[205]), Number(sumaValores[206]), Number(sumaValores[207]), Number(sumaValores[208]), Number(sumaValores[209]),
          Number(sumaValores[210]), Number(sumaValores[211]), Number(sumaValores[212]), Number(sumaValores[213]), Number(sumaValores[214]),
          Number(sumaValores[215]), Number(sumaValores[216]), Number(sumaValores[217]), Number(sumaValores[218]), Number(sumaValores[219]),
          Number(sumaValores[220]), Number(sumaValores[221]), Number(sumaValores[222]), Number(sumaValores[223]), Number(sumaValores[224]),
          Number(sumaValores[225]), Number(sumaValores[226]), Number(sumaValores[227]), Number(sumaValores[228]), Number(sumaValores[229]),
          Number(sumaValores[230]), Number(sumaValores[231]), Number(sumaValores[232]), Number(sumaValores[233]), Number(sumaValores[234]),
          Number(sumaValores[235]), Number(sumaValores[236]), Number(sumaValores[237]), Number(sumaValores[238]), Number(sumaValores[239]),
          );
        // FIN TIR MENSUAL

        // TIR ANUALIZADO
        tirAnualizado = Math.pow( (1 + ( tirMensual / 100) ), 12);
        tirAnualizado = ( tirAnualizado - 1 );
        // FIN TIR ANUALIZADO

      /* FIN DATOS DE INFORMACION FINANCIERA */

        // INSTANCIA JSPDF
        const doc = new jsPDF('p', 'px', 'a4');
        const docPdfCorridaFinanciera = new jsPDF('p', 'px', 'a4');
        let ancho: any;
        let alto: any;
        ancho = doc.internal.pageSize.getWidth();
        alto = doc.internal.pageSize.getHeight();

        // LOGOTIPO IDEX
        let imgData: any;

        imgData = 'data:image/png;base64,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' +
        '8bBJs0AtkJFaaNXZxmrkUK1GvlbyJF' +
        '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';

        doc.addImage(imgData, 'PNG', 15, 10, 55, 15);
        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text('Tabla de amortización', 15, 42.5);
        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(1.5);
        doc.line(15, 52.5, ancho - 15, 52.5);
        doc.setFontSize(16);
        doc.text('Datos Generales', 15, 65.5);

        // INFORMACION FINANCIERA
        doc.autoTable({
          margin: {top: 70},
          styles: {
            overflow: 'linebreak',
            cellWidth: '100',
            font: 'arial',
            fontSize: 8,
            cellPadding: 2,
            overflowColumns: 'linebreak'
          },
          head: [
            [
              {content: 'Informacion Financiera', colSpan: 4, styles: {halign: 'center', fillColor: [22, 160, 133]}},
            ]
          ],
          body: [
            [
              {colSpan: 2, content: 'Rendimiento esperado (TIR)', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPercent.format(tirAnualizado), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Precio Proyectado de Venta', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(precioProyectoVenta), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Ingresos Proyectados por Rentas', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(ingresosProyectadosPorRenta), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Ingresos Proyectados por Tasa de Rendimiento', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(sumaCantidadFlujoRentaContado), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Capital', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(capital), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Credito Hipotecario Restante', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(creditoHipotecarioRestante), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Utilidad', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(utilidad), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Cash Multiple', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: trunc(cashMultiple, 2), styles: {valign: 'middle', halign: 'center'}}
            ]
          ],
          theme: 'grid'
        });

        // INFORMACION ADICIONAL
        doc.autoTable({
          margin: {top: 60},
          styles: {
            overflow: 'linebreak',
            cellWidth: '100',
            font: 'arial',
            fontSize: 8,
            cellPadding: 2,
            overflowColumns: 'linebreak'
          },
          head: [
            [
              {content: 'Informacion adicional', colSpan: 4, styles: {halign: 'center', fillColor: [22, 160, 133]}},
            ]
          ],
          body: [
            [
              {colSpan: 2, content: 'Valor Inmueble con Descuento', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(valorInmuebleDescuento), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Pago Inicial', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(pagoInicial), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Monto Mensual a Pagar Plazo', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(montoPlazo), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Meses de Plazo', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: mesesFinanciamientoContrato, styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Pago a la Escrituración', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(escrituracion), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Costo de Cierre', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(costoCierre), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Valor de Hipoteca', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(valorHipoteca), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Mensualidad Hipoteca', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(mensualidadHipoteca), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Meses de Pago de Hipoteca', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: mesesPagoHipoteca, styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Valor de Renta (-) Menos Costo de Mantenimiento', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(valorRentaMenosMantenimiento), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Meses de Renta', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: mesReventa, styles: {valign: 'middle', halign: 'center'}}
            ]
          ],
          theme: 'grid'
        });

        // TABLA DE AMORTIZACION
        if (metodo.includes('HIPOTECARIO')) {
          const bodyPrueba = [];
          doc.autoTable({
            margin: {top: 60},
            styles: {
              overflow: 'linebreak',
              cellWidth: '100',
              font: 'arial',
              fontSize: 10,
              cellPadding: 5,
              overflowColumns: 'linebreak'
            },
            head: [
              [
                {content: 'No. Periodos', styles: {halign: 'center'}},
                {content: 'Saldo Inicial', styles: {halign: 'center'}},
                {content: 'Cuota Fija', styles: {halign: 'center'}},
                {content: 'Interes', styles: {halign: 'center'}},
                {content: 'Abono a Capital', styles: {halign: 'center'}},
                {content: 'Saldo Final', styles: {halign: 'center'}}
              ]
            ]
          });

          let sumaTotalInteres: any;
          let sumaTotalPagoCapital: any;
          sumaTotalInteres = 0;
          sumaTotalPagoCapital = 0;
          console.log('REVISAR');
          console.log(tablaAmortizacion);
          for (let x = 0; x < tablaAmortizacion.length; x++) {
            sumaTotalInteres = sumaTotalInteres + tablaAmortizacion[x][3];
            sumaTotalPagoCapital = sumaTotalPagoCapital + tablaAmortizacion[x][4];
            bodyPrueba.push([
              tablaAmortizacion[x][0],
              formatterPeso.format(tablaAmortizacion[x][1]),
              formatterPeso.format(tablaAmortizacion[x][2]),
              formatterPeso.format(tablaAmortizacion[x][3]),
              formatterPeso.format(tablaAmortizacion[x][4]),
              formatterPeso.format(tablaAmortizacion[x][5])
            ]);
          }
          /* bodyPrueba.push([
            'TOTAL',
            '',
            '',
            formatterPeso.format(sumaTotalInteres),
            // formatterPeso.format(valorHipoteca)
            formatterPeso.format(sumaTotalPagoCapital)
          ]); */
          doc.autoTable({
            styles: {
              overflow: 'linebreak',
              cellWidth: '100',
              font: 'arial',
              fontSize: 8,
              cellPadding: 2,
              overflowColumns: 'linebreak',
              halign: 'center'
            },
            columnStyles: {
              0: {halign: 'center', fillColor: [30, 144, 255]},
              1: {halign: 'center'},
              2: {halign: 'center'},
              3: {halign: 'center'},
              4: {halign: 'center'}
            },
            body: bodyPrueba
          });

        }

        // SE GENERA DOCUEMENTO CORRIDA FINANCIERA
        /*docPdfCorridaFinanciera.addImage(imgData, 'PNG', 15, 10, 55, 15);
        docPdfCorridaFinanciera.setFont('helvetica');
        docPdfCorridaFinanciera.setFontType('bold');
        docPdfCorridaFinanciera.text('Corrida financiera ' + $('#nombre_pdf').val(), 15, 42.5);
        docPdfCorridaFinanciera.setDrawColor(255, 0, 0);
        docPdfCorridaFinanciera.setLineWidth(1.5);
        docPdfCorridaFinanciera.line(15, 52.5, ancho - 15, 52.5);
        docPdfCorridaFinanciera.setFontSize(16);
        docPdfCorridaFinanciera.text(nombreCliente, ancho / 3.5, 68);

        // CARACTERISTICAS
        docPdfCorridaFinanciera.autoTable({
          margin: {top: 80},
          styles: {
            overflow: 'linebreak',
            cellWidth: '100',
            font: 'arial',
            fontSize: 8,
            cellPadding: 2,
            overflowColumns: 'linebreak'
          },
          /*head: [
            [
              {content: 'Informacion Financiera', colSpan: 4, styles: {halign: 'center', fillColor: [22, 160, 133]}},
            ]
          ], */
          /* body: [
            [
              {colSpan: 2, content: 'Unidad', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: torreDepartamento +
                '-' + nivelDepartamento +
                '-' + nombreDepartamento,
                styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}
              }
            ],
            [
              {colSpan: 2, content: 'Superficie en M2', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: metrosCuadradosPrototipo, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
            ],
            [
              {colSpan: 2, content: 'Prototipo', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: prototipoDepartamento, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
            ],
            [
              {colSpan: 2, content: 'Nivel', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: nivelDepartamento, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
            ],
            [
              {colSpan: 2, content: 'Torre', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: torreDepartamento, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
            ],
            [
              {colSpan: 2, content: 'Precio preventa', styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}},
              {colSpan: 2, content: formatterPeso.format((metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento))),
                styles: {valign: 'middle', halign: 'center',
              fontStyle: 'bold'}}
            ]
          ],
          theme: 'plain'
        });

        // PLAN HIPOTECARIO
        docPdfCorridaFinanciera.autoTable({
          margin: {top: 60},
          styles: {
            overflow: 'linebreak',
            cellWidth: '100',
            font: 'arial',
            fontSize: 8,
            cellPadding: 2,
            overflowColumns: 'linebreak'
          },
          head: [
            [
              {content: 'Plan Hipotecario', colSpan: 6, styles: {halign: 'center', fillColor: [22, 160, 133]}},
            ]
          ],
          body: [
            [
              {colSpan: 2, content: 'Precio', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 4, content: formatterPeso.format(Math.round((metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento)))), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'Enganche a la firma', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 4, content: formatterPeso.format(pagoInicial), styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              { colSpan: 2, content: 'Enganche financiado', styles: {valign: 'middle', halign: 'center', cellWidth: '200'} },
              { colSpan: 2, content: [
                'Porcentaje: ' + formatterPercent.format(plazoVenta / 100),
                '  Monto: ' + formatterPeso.format( Math.round( (plazoVenta / 100) *
                ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento)) ) ) )
              ], styles: {valign: 'middle', halign: 'center'}},
              { colSpan: 2, content: [
                'Financiamiento: ' + mesesFinanciamientoContrato + ' meses',
                ' Mensualidad: ' + formatterPeso.format( Math.round( ( ( (plazoVenta / 100) *
                ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento)) ) ) - pagoInicial ) / mesesFinanciamientoContrato
                ) )
              ], styles: {valign: 'middle', halign: 'center'}},
            ],
            [
              {colSpan: 2, content: 'Pago a la firma de escritura', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPercent.format(escritura / 100), styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 2, content: formatterPeso.format(Math.round( (escritura / 100) *
                ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento)) ) )),
                styles: {valign: 'middle', halign: 'center'}}
            ],
            [
              {colSpan: 2, content: 'TOTAL', styles: {valign: 'middle', halign: 'center'}},
              {colSpan: 4, content:  formatterPeso.format(Math.round( ( (escritura / 100) *
                ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento)) ) ) +
                ( (plazoVenta / 100) *
                ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
                * (Math.pow(1.01, nivelDepartamento)) ) )
                )),
                styles: {valign: 'middle', halign: 'center'}}
            ]
          ],
          theme: 'grid'
        });

        // TABLA CORRIDA FINANCIERA
        const bodyCorridaFinanciera: any = [];
        docPdfCorridaFinanciera.autoTable({
          margin: {top: 60},
          styles: {
            overflow: 'linebreak',
            cellWidth: '100',
            font: 'arial',
            fontSize: 10,
            cellPadding: 5,
            overflowColumns: 'linebreak'
          },
          head: [
            [
              {content: 'Pago', styles: {halign: 'center'}},
              {content: 'Fecha', styles: {halign: 'center'}},
              {content: 'Capital Pactado', styles: {halign: 'center'}},
              {content: 'Abono a Capital', styles: {halign: 'center'}},
              {content: 'Mensualidad', styles: {halign: 'center'}}
            ]
          ]
        });

        let capitalPactadoCorrida: any;
        let abonoCapitalCorrida: any;
        let mensualidadCorrida: any;
        capitalPactadoCorrida = Math.round(valorInmuebleDescuento);
        abonoCapitalCorrida =  Math.round( ( ( (plazoVenta / 100) *
        ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
        * (Math.pow(1.01, nivelDepartamento)) ) ) - pagoInicial ) / mesesFinanciamientoContrato
        );
        mensualidadCorrida = abonoCapitalCorrida;

        bodyCorridaFinanciera.push([
          'Apartado',
          fechaPagoApartado,
          formatterPeso.format(Math.round(valorInmuebleDescuento)),
          formatterPeso.format(20000),
          formatterPeso.format(20000)
        ]);

        bodyCorridaFinanciera.push([
          'Enganche',
          fechaInicioContrato,
          formatterPeso.format(Math.round(Number(valorInmuebleDescuento) - 20000)),
          formatterPeso.format(pagoInicial - 20000),
          formatterPeso.format(pagoInicial - 20000)
        ]);

        let fechaInicioPagosCorrida: any;
        let fechaFormatoCorrida: any;
        let mesFormatoCorrida: any;
        let diaFormatoCorrida: any;
        let totalmensualidadCorrida: any;
        totalmensualidadCorrida = 0;
        fechaInicioPagosCorrida = new Date(fechaInicioContrato);
        console.log(fechaInicioPagosCorrida.setDate(Number(diaPago)));

        for (let x = 1; x <= mesesFinanciamientoContrato; x++) {

          fechaInicioPagosCorrida = new Date(fechaInicioContrato);

          if (x === 1) {
            capitalPactadoCorrida = capitalPactadoCorrida - pagoInicial - 20000;
          } else {
            capitalPactadoCorrida = capitalPactadoCorrida - abonoCapitalCorrida;
          }

          mesFormatoCorrida = fechaInicioPagosCorrida.setMonth((fechaInicioPagosCorrida.getMonth() + 1) +
          Number(x - 1));
          diaFormatoCorrida = fechaInicioPagosCorrida.setDate(diaPago);
          if (mesFormatoCorrida.length < 2) {
            mesFormatoCorrida = '0' + mesFormatoCorrida;
          }
          bodyCorridaFinanciera.push([
            x,
            fechaFormatoCorrida = new Date(fechaInicioPagosCorrida).toISOString().slice(0 , 10).split('T')[0],
            formatterPeso.format(Math.round(capitalPactadoCorrida)),
            formatterPeso.format(Math.round(abonoCapitalCorrida)),
            formatterPeso.format(Math.round(mensualidadCorrida))
          ]);
          totalmensualidadCorrida = totalmensualidadCorrida + mensualidadCorrida;
        }

        bodyCorridaFinanciera.push([
          'FIRMA',
          '',
          '',
          '',
          formatterPeso.format(Math.round( (escritura / 100) *
          ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
          * (Math.pow(1.01, nivelDepartamento)) ) ))
        ]);

        bodyCorridaFinanciera.push([
          'TOTAL',
          '',
          '',
          '',
          formatterPeso.format(Math.round( ((escritura / 100) *
          ( (metrosCuadradosPrototipo * precioInicialDesarrollo)
          * (Math.pow(1.01, nivelDepartamento)) )) + totalmensualidadCorrida + pagoInicial ))
        ]);
        docPdfCorridaFinanciera.autoTable({
          styles: {
            overflow: 'linebreak',
            cellWidth: '100',
            font: 'arial',
            fontSize: 8,
            cellPadding: 2,
            overflowColumns: 'linebreak',
            halign: 'center'
          },
          columnStyles: {
            0: {halign: 'center', fillColor: [30, 144, 255]},
            1: {halign: 'center'},
            2: {halign: 'center'},
            3: {halign: 'center'},
            4: {halign: 'center'}
          },
          body: bodyCorridaFinanciera
        }); */

        // SE GUARDA EL DOCUMENTO PDF
        doc.save('Tabla-amortizacion-' + $('#nombre_pdf').val() + '.pdf');
        // docPdfCorridaFinanciera.save(nombreCliente + '-' + nombreDepartamento + '-' + $('#nombre_pdf').val() + '.pdf');
        this.notificacion.info('Los archivos han sido generados.', 'PDF Generado', {
          placeholder: 'pruebas',
          showProgressBar: false,
          titleMaxLength: 200
        });
  }
}
