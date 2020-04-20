import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as $ from 'jquery';
import { Finance } from 'financejs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnotifyService, SnotifyPosition, SnotifyToast } from 'ng-snotify';
import { environment, position } from './../../environments/environment';
import { Desarrollo } from '../interfaces/desarrollo';
import { SupuestoVenta } from '../interfaces/supuesto-venta';
import { SupuestoObra } from '../interfaces/supuesto-obra';
import { Piso } from '../interfaces/piso';
import { Prototipo } from '../interfaces/prototipo';
import { SupuestoMercado } from '../interfaces/supuesto-mercado';
import { SupuestoCompra } from '../interfaces/supuesto-compra';
import { Plusvalia } from '../interfaces/plusvalia';
import { SupuestoHipotecario } from '../interfaces/supuesto-hipotecario';
import { Apartados } from '../interfaces/apartados';

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
  selector: 'app-corrida-financiera',
  templateUrl: './corrida-financiera.component.html',
  styleUrls: ['./corrida-financiera.component.css']
})
export class CorridaFinancieraComponent implements OnInit {

  // VARIABLES PARA GUARDAR INFORMACION DE LA CORRIDA FINANCIERA

  /* VARIABLES QUE ALMACENAN LA INFORMACION DE LA CORRIDA FINANCIERA
     PARA SU USO POSTERIOR EN EL METODO autorizacion() */
  corridaFinanciera;
  // ENCABEZADO CORRIDA FINANCIERA
  encabezadoCorridaFinanciera;
  idCrmNegociacion;
  // INFORMACION GENERAL CORRIDA FINANCIERA
  generalesCorridaFinanciera;
  // TABLA DE PAGOS CORRIDA FINANCIERA
  tablaCorridaFinanciera;

  /** FIN VARIABLES */

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  desarrollos: Desarrollo[];
  desarrolloDetalles: Desarrollo[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestoVenta: SupuestoVenta[];
  supuestoVentaDetalles: SupuestoVenta[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestosObra: SupuestoObra[];
  supuestosObraDetalles: SupuestoObra[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  pisos: Piso[];
  pisoDetalles: Piso[];
  nivelDetalles: Piso[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  prototipos: Prototipo[];
  prototipoDetalles: Prototipo[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestosHipotecarios: SupuestoHipotecario[];
  supuestosHipotecariosDetalles: SupuestoHipotecario[];

  // GUARDA LOS DATOS DE LA RESPUESTA GET DE LA API
  apartadosCrm: Apartados[];
  apartadosCrmDetalles: Apartados[];
  // GUARDAMOS LA INFORMACION DE LA UBICACION
  ubicacionCrm;
  proyectoCrm;
  torreCrm;
  torreCrmLetra;
  pisoCrm;
  departamentoCrm;
  prototipoCrm;
  metrosCuadradosCrm;
  metrosPatioCrm;
  vistaCrm;

  // PUESTO DEL USUARIO
  workPosition;
  idDesarrollo;
  idSupuestoObra;
  idPiso;
  idPrototipo;
  idSupuestoVenta;
  idNegociacionCrm;

  /* DATOS A MOSTRAR EN TIEMPO REAL */
  nombreClienteCorrida;
  desarrolloCorrida;
  numeroDeptoCorrida;
  prototipoCorrida;
  pisoCorrida;
  torreCorrida;
  torreLetra;
  financiamientoCorrida;
  pagoApartadoCorrida;
  inicioContratoCorrida;
  fechaFirmaCorrida;
  mesesFinanciamientoCorrida;
  diaPagoCorrida;
  plusvalias: Plusvalia[];
  supuestosCompra: SupuestoCompra[];
  supuestoMercado: SupuestoMercado[];

  constructor(private httpClient: HttpClient,
              private ngxService: NgxUiLoaderService,
              private notificacion: SnotifyService) {

                this.workPosition = position.work_position;
   }

  /* METODO ACTUALIZAR LISTA */
  actualizarListaDesarrollos() {

    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos').subscribe( (data: Desarrollo[]) => {
      this.desarrollos = data;
    } );
  }

  /* DETALLES DEL NIVEL POR NOMBRE Y ID DE DESARROLLO */
  detallesNivel(id: any, nivel: any) {
    let onlyId: any;
    onlyId = id.split(' ');
    this.httpClient.get(environment.API_ENDPOINT + '/pisos/' + onlyId[0] + '/' + parseInt(nivel, 10)).subscribe(
      (data: Piso[]) => {
        this.nivelDetalles = data;
        this.pisoCorrida = data[0].numero_piso;
        // this.pisoCorrida = data[0].numero_piso;
        console.log('DETALLES PISO');
        console.log(data);
        console.log(this.pisoCorrida);
      }
    );
  }
  /* FIN DETALLES DEL NIVEL */

  /* DETALLES NEGOCIACIONES CRM */
  detallesNegociacion(id: any) {

    // SEPARAMOS EL ID DE LA CADENA
    let onlyId: any;
    onlyId = id.split(' ');
    this.idCrmNegociacion = onlyId[0];

    this.httpClient.get(environment.API_ENDPOINT + '/apartados-crm/detalles-negociacion/' + onlyId[0]).subscribe(
      (data: Apartados[]) => {

        let conversionTorre: any;
        let ubicacion: any;
        let ubicacionCompleta: any;
        this.apartadosCrmDetalles = data;
        ubicacionCompleta = data[0].producto;
        ubicacion = data[0].producto.split('-');
        this.proyectoCrm = ubicacion[0];
        this.torreCrmLetra = ubicacion[1];
        this.torreCrm = ubicacion[1];
        this.pisoCrm = ubicacion[2];
        this.departamentoCrm = ubicacion[3];
        this.ubicacionCrm = ubicacionCompleta;
        this.prototipoCrm = data[0].prototipo;
        this.metrosCuadradosCrm = data[0].m2;
        this.vistaCrm = data[0].vista;
        this.metrosPatioCrm = data[0].patio;

        // ASIGNACION DE VALORES
        conversionTorre = {
          A: 1,
          B: 2,
          C: 3,
          D: 4,
          E: 5,
          F: 6,
          G: 7,
          H: 8,
          I: 9,
          J: 10,
          K: 11
        };
        // ASIGNAR LETRA AL NIVEL
        for (const value in conversionTorre) {
          if (value === this.torreCrm ) {
            this.torreCrm = conversionTorre[value];
          }
        }

        console.log('DETALLES NEGOCIACION ' + data[0].id_negociacion);
        console.log(data);
      }
    );
    console.log(id);
  }
  /* FIN DETALLES NEGOCIACION CRM */

  /* OBTIENE DETALLES DESARROLLO */
  obtenerDetalleDesarrollo(id: any) {
    console.log('Datos');
    console.log(id);
    // SEPARAMOS LA CADENA
    let desarrolloSplit: any;
    desarrolloSplit = this.desarrolloCorrida.split(' ');
    this.desarrolloCorrida = desarrolloSplit[1];
    this.httpClient.get(environment.API_ENDPOINT + '/desarrollos/details/' + id).subscribe(
      (data: Desarrollo[]) => {
        this.desarrolloDetalles = data;
        console.log('DETALLES DESARROLLO');
        console.log(data);

        this.httpClient.get(environment.API_ENDPOINT + '/apartados-crm/lista-desarrollo/' + data[0].nombre).subscribe(
          (apartadosCrm: Apartados[]) => {
            this.apartadosCrm = apartadosCrm;
            console.log('NEGOCIACIONES EN FASE DE APARTADO');
            console.log(apartadosCrm);
          }
        );
      }
    );
  }
  /* FIN OBTIENE DETALLES DESARROLLO */

  /* OBTIENE DETALLES DEL SUPUESTO DE OBRA */
  obtenerDetalleSupuestoObra(id: any) {
    console.log('Datos');
    console.log(id);
    // SEPARAMOS LA CADENA
    let torreSplit: any;
    torreSplit = this.torreLetra.split(' ');
    this.torreCorrida = torreSplit[1];
    this.torreLetra = torreSplit[1];

    let conversionTorre: any;
    // ASIGNACION DE VALORES
    conversionTorre = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E',
      6: 'F',
      7: 'G',
      8: 'H',
      9: 'I',
      10: 'J',
      11: 'K'
    };
    // ASIGNAR LETRA AL NIVEL
    for (const value in conversionTorre) {

      if (value === this.torreCorrida ) {
        this.torreLetra = conversionTorre[value];
      }
    }

    this.httpClient.get(environment.API_ENDPOINT + '/supuesto-obra/details/' + id).subscribe(
      (data: SupuestoObra[]) => {
        this.supuestosObraDetalles = data;
        console.log('DETALLES SUPUESTO OBRA');
        console.log(data);
      }
    );

  }
  /* FIN OBTIENE DETALLES DEL SUPUESTO DE OBRA */

  /* OBTIENE DETALLES DEL PISO */
  obtenerDetallePiso(id: any) {
    console.log('Datos');
    console.log(id);
    // SEPARAMOS LA CADENA
    let pisoSplit: any;
    pisoSplit = this.pisoCorrida.split(' ');
    this.pisoCorrida = pisoSplit[1];

    this.httpClient.get(environment.API_ENDPOINT + '/pisos/details/' + id).subscribe(
      (data: Piso[]) => {
        this.pisoDetalles = data;
        console.log('DETALLES PISO');
        console.log(data);
      }
    );
  }
  /* FIN OBTIENE DETALLES DEL PISO */

  /* OBTIENE DETALLES PROTOTIPO */
  obtenerDetallePrototipo(id: any) {
    console.log('Datos');
    console.log(id);

    this.httpClient.get(environment.API_ENDPOINT + '/prototipos/details/' + id).subscribe(
      (data: Prototipo[]) => {
        this.prototipoDetalles = data;
        console.log('DETALLES PROTOTIPO');
        console.log(data);
        // SEPARAMOS LA CADENA
        let prototipoSplit: any;
        prototipoSplit = this.prototipoCorrida.split(' ');
        this.prototipoCorrida = prototipoSplit[1];
      }
    );
  }
  /* FIN OBTIENE DETALLES PROTOTIPO */

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

  calcularCosto(type: any) {

    let mtsCuadrados: any;
    let costoVentaMtsCuadrados: any;
    let precio: any;

    if (type === 'prototipo') {

      mtsCuadrados = $('#metros_cuadrados_prototipo_corrida').val();
      costoVentaMtsCuadrados = $('#costo_venta_metro_cuadrado_corrida').val();
      precio = $('#precio_preventa_corrida').val(costoVentaMtsCuadrados * mtsCuadrados);
    } else if (type === 'excedente') {

      mtsCuadrados = $('#metros_cuadrados_patio_corrida').val();
      costoVentaMtsCuadrados = $('#costo_venta_metro_cuadrado_patio_corrida').val();
      precio = $('#precio_preventa_patio_corrida').val(costoVentaMtsCuadrados * mtsCuadrados);
    }
  }

  // SE GENERA REGISTRO DE LA CORRIDA FINANCIERA PARA SER AUTORIZADO
  autorizacion() {

    // CUERPO DE LA CORRIDA FINANCIERA
    console.log('CORRIDA FINANCIERA');
    this.corridaFinanciera = [
      {id_negociacion_crm: this.idCrmNegociacion},
      {encabezado: this.encabezadoCorridaFinanciera},
      {generales: this.generalesCorridaFinanciera},
      {tabla: this.tablaCorridaFinanciera}
    ];
    console.log(this.corridaFinanciera);
  }

  generarPDF() {

    console.log('FENERANDO CORRIDA FINANCIERA');

    // DECLARACION DE VARIABLES
    let nombreClientePDF: any;
    let clientePDF: any;
    let superficieCorridaPDF: any;
    let prototipoCorridaPDF: any;
    let nivelCorridaPDF: any;
    let torreCorridaPDF: any;
    let torreLetraCorridaPDF: any;
    let numeroDepartamentoCorridaPDF: any;
    let precioPreventaCorridaPDF: any;
    let precioPreventaPatioCorridaPDF: any;
    let conversionTorre: any;
    let fechaPagoApartado: any;
    let fechaInicioContrato: any;
    let diaPago: any;
    let metodoFinanciamiento: any;
    let mesesFinanciamientoContrato: any;
    let firmaVenta: any;
    let porcentajeComisionInmueble: any;
    let valorInmuebleDescuento: any;
    let plusvaliaPiso: any;
    let descuentoVenta: any;
    let comisionApertura: any;
    let pagoFirma: any;
    let pagoInicial: any;
    let plazoVenta: any;
    let escritura: any;
    let fechaFirmaCorrida: any;
    let calculoPrecioPreventa: any;
    let superficiePatioCorridaPDF: any;

    // ASIGNACION DE VALORES
    conversionTorre = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E',
      6: 'F',
      7: 'G',
      8: 'H',
      9: 'I',
      10: 'J',
      11: 'K'
    };

    nombreClientePDF = $('#cliente_corrida').val();
    // SEPARAMOS LA CADENA, LA POSICION [1] CONTIENE EL NOMBRE COMPLETO
    clientePDF = nombreClientePDF.split(':');
    superficieCorridaPDF = $('#metros_cuadrados_prototipo_corrida').val();
    precioPreventaCorridaPDF = $('#precio_preventa_corrida').val();
    superficiePatioCorridaPDF = $('#metros_cuadrados_patio_corrida').val();
    precioPreventaPatioCorridaPDF = $('#costo_venta_metro_cuadrado_patio_corrida').val();
    prototipoCorridaPDF = this.prototipoCrm;
    nivelCorridaPDF = this.pisoCrm;
    torreCorridaPDF = this.torreCrm;
    /*nivelCorridaPDF = this.pisoCorrida;
    torreCorridaPDF = this.torreCorrida;*/
    numeroDepartamentoCorridaPDF = $('#numero_departamento_corrida').val();
    precioPreventaCorridaPDF = $('#costo_venta_metro_cuadrado_corrida').val();
    // precioPreventaCorridaPDF = $('#precio_preventa_corrida').val();
    fechaPagoApartado = $('#fecha_pago_apartado_corrida').val();
    fechaInicioContrato = $('#fecha_inicio_contrato_corrida').val();
    diaPago = $('#dia_pago_corrida').val();
    metodoFinanciamiento = $('#nombre_venta').val();
    fechaFirmaCorrida = $('#fecha_firma_corrida').val();
    superficiePatioCorridaPDF = $('#metros_cuadrados_patio_corrida').val();

    // VERIFICA EL METODO DE FINANCIAMIENTO
    if (metodoFinanciamiento.includes('CONTADO')) {

      // SI ES CONTADO Y TIENE MESES DE FINANCIAMIENTO, ASIGNA EL VALOR DE meses_plazo_venta
      if ($('#meses_financiamiento_corrida').val() > 0 ) {

        mesesFinanciamientoContrato = $('#meses_plazo_venta').val();
        this.notificacion.warning('El metodo de financiamiento CONTADO no puede tener meses de financiamiento', {
          showProgressBar: false,
          titleMaxLength: 200
        });
      }
    } else {

      mesesFinanciamientoContrato = $('#meses_financiamiento_corrida').val();
    }

    firmaVenta = $('#firma_venta').val();
    plusvaliaPiso = $('#plusvalia_piso').val();
    descuentoVenta = $('#descuento_venta').val();
    comisionApertura = $('#comision_apertura').val();
    plazoVenta = $('#plazo_venta').val();
    escritura = $('#escritura_venta').val();

    // ASIGNAR LETRA AL NIVEL
    console.log('AAA');
    console.log(this.torreCrm);
    console.log(torreLetraCorridaPDF);
    for (const value in conversionTorre) {

      if (value === this.torreCrm ) {
        torreLetraCorridaPDF = conversionTorre[value];
      }
    }
    console.log(torreLetraCorridaPDF);
    valorInmuebleDescuento = precioPreventaCorridaPDF * superficieCorridaPDF
    * (1 + (plusvaliaPiso / 100)) * (1 - (descuentoVenta / 100 ));
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
    // console.log(precioPreventaCorridaPDF);

    // GUARDA EL PRECIO DE PREVENTA DE ACUERDO A SU NIVEL
    // VERIFICAMOS EL NUMERO DE PISO
    if (this.pisoCorrida === 'PB') {

      calculoPrecioPreventa = Math.round(
        ( Number(superficieCorridaPDF) * Number(precioPreventaCorridaPDF) ) +
        ( Number(superficiePatioCorridaPDF) * Number(precioPreventaPatioCorridaPDF) )
      );
      console.log('SUPERFICIE PROTOTIPO' + Number(superficieCorridaPDF) * Number(precioPreventaCorridaPDF));
      console.log('SUPERFICIE PATIO' + Number(superficiePatioCorridaPDF) * Number(precioPreventaPatioCorridaPDF));
    } else if (this.pisoCorrida === '02') {

      calculoPrecioPreventa = Math.round(
        (
          ( Number(superficieCorridaPDF) * Number(precioPreventaCorridaPDF) ) +
          ( Number(superficiePatioCorridaPDF) * Number(precioPreventaPatioCorridaPDF) )
        ) *
        (Math.pow(1.01, this.pisoCorrida))
      );
    } else {

      calculoPrecioPreventa = Math.round( ( Number(superficieCorridaPDF) * Number(precioPreventaCorridaPDF) )
      * (Math.pow(1.01, this.pisoCorrida)) );
      superficiePatioCorridaPDF = 'No aplica';
    }

    console.log('Calculo preventa piso ' + this.pisoCorrida + '. ' + calculoPrecioPreventa);
    // INSTANCIA JSPDF
    const docPdfCorridaFinanciera = new jsPDF('p', 'px', 'a4');
    let ancho: any;
    let alto: any;
    ancho = docPdfCorridaFinanciera.internal.pageSize.getWidth();
    alto = docPdfCorridaFinanciera.internal.pageSize.getHeight();

    // LOGOTIPO IDEX
    let imgData: any;
    let imgDesarrollo: any;

    imgData = 'data:image/png;base64,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' +
    '8bBJs0AtkJFaaNXZxmrkUK1GvlbyJF' +
    '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';

    // SE AGREGA LA IMAGEN DE ACUERDO AL DESARROLLO
    let desarrolloSeleccionado: any;
    desarrolloSeleccionado = $('#desarrollo').val();

    switch (desarrolloSeleccionado) {
      case 'ANUVA':
        imgDesarrollo = 'data:image/png;base64,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';
        break;
    }

    // VARIABLE PARA CENTRAR EL TEXTO
    let xOffset: any;
    // SE GENERA DOCUEMENTO CORRIDA FINANCIERA
    docPdfCorridaFinanciera.addImage(imgData, 'PNG', 15, 10, 55, 15);
    docPdfCorridaFinanciera.setFont('helvetica');
    docPdfCorridaFinanciera.setFontType('bold');
    docPdfCorridaFinanciera.text('Corrida financiera - PLAN ' + metodoFinanciamiento.toUpperCase() + ' '
    + $('#desarrollo').val(), 15, 42.5);
    docPdfCorridaFinanciera.setDrawColor(255, 0, 0);
    docPdfCorridaFinanciera.setLineWidth(1.5);
    docPdfCorridaFinanciera.line(15, 52.5, ancho - 15, 52.5);
    docPdfCorridaFinanciera.setFontSize(16);
    docPdfCorridaFinanciera.addImage(imgDesarrollo, 'PNG', ancho / 7, 54.5, 300, 100);
    xOffset = (docPdfCorridaFinanciera.internal.pageSize.width / 2) -
    (docPdfCorridaFinanciera.getStringUnitWidth(clientePDF[1].toUpperCase()) *
    docPdfCorridaFinanciera.internal.getFontSize() / 2);
    docPdfCorridaFinanciera.text(clientePDF[1].toUpperCase(), xOffset, 155);

    // CARACTERISTICAS
    docPdfCorridaFinanciera.autoTable({
      margin: {top: 160},
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
      body: [
        [
          {colSpan: 2, content: 'Unidad', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.torreCrmLetra +
            '-' + nivelCorridaPDF +
            '-' + numeroDepartamentoCorridaPDF,
            styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}
          }
        ],
        [
          {colSpan: 2, content: 'Superficie en M2', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: superficieCorridaPDF, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Patio Descubierto M2', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: superficiePatioCorridaPDF, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Prototipo', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.prototipoCrm, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Nivel', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.pisoCorrida, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Torre', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.torreCrmLetra, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Vista', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.vistaCrm, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Precio preventa', styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}},
          {colSpan: 2, content: formatterPeso.format( calculoPrecioPreventa ),
            styles: {valign: 'middle', halign: 'center',
          fontStyle: 'bold'}}
        ]
      ],
      theme: 'plain'
    });

    // GUARDAMOS LA INFORMACION PARA SER UTILIZADA POR EL METODO autorizar()
    this.encabezadoCorridaFinanciera = [
      {cliente: clientePDF[1]},
      {unidad: this.torreCrmLetra + '-' + nivelCorridaPDF + '-' + numeroDepartamentoCorridaPDF},
      {superficie_m2: superficieCorridaPDF},
      {patio_m2: superficiePatioCorridaPDF},
      {prototipo: this.prototipoCrm},
      {nivel: this.pisoCorrida},
      {torre: this.torreCrmLetra},
      {precio_preventa: calculoPrecioPreventa}
    ];

    // PLAN DE FINANCIAMIENTO
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
          {content: 'Plan ' + metodoFinanciamiento.toUpperCase(), colSpan: 6, styles: {halign: 'center', fillColor: [22, 160, 133]}},
        ]
      ],
      body: [
        [
          {colSpan: 2, content: 'Precio', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 4, content: formatterPeso.format(calculoPrecioPreventa), styles: {valign: 'middle', halign: 'center'}}
        ],
        [
          {colSpan: 2, content: 'Enganche a la firma', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 4, content: formatterPeso.format(pagoInicial), styles: {valign: 'middle', halign: 'center'}}
        ],
        [
          { colSpan: 2, content: 'Enganche financiado', styles: {valign: 'middle', halign: 'center', cellWidth: '200'} },
          { colSpan: 2, content: [
            'Porcentaje: ' + formatterPercent.format(plazoVenta / 100),
            '  Monto: ' + formatterPeso.format( Math.round( (plazoVenta / 100) * calculoPrecioPreventa ) )
          ], styles: {valign: 'middle', halign: 'center'}},
          { colSpan: 2, content: [
            'Financiamiento: ' + mesesFinanciamientoContrato + ' meses',
            ' Mensualidad: ' + formatterPeso.format( Math.round( ( ( (plazoVenta / 100) * calculoPrecioPreventa ) -
            pagoInicial ) / mesesFinanciamientoContrato
            ) )
          ], styles: {valign: 'middle', halign: 'center'}},
        ],
        [
          {colSpan: 2, content: 'Pago a la firma de escritura', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: formatterPercent.format(escritura / 100), styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: formatterPeso.format( Math.round( (escritura / 100) * calculoPrecioPreventa ) ),
            styles: {valign: 'middle', halign: 'center'}}
        ],
        [
          {colSpan: 2, content: 'TOTAL', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 4, content:  formatterPeso.format( Math.round( ( (escritura / 100) * calculoPrecioPreventa ) +
            ( (plazoVenta / 100) * calculoPrecioPreventa ) ) ),
            styles: {valign: 'middle', halign: 'center'}}
        ]
      ],
      theme: 'grid'
    });

    // GUARDAMOS LA INFORMACION GENERAL DE LA CORRIDA FINANCIERA
    this.generalesCorridaFinanciera = [
      {precio: calculoPrecioPreventa},
      {enganche_firma: pagoInicial},
      {enganche_financiado: [
        {porcentaje: plazoVenta / 100},
        {monto: Math.round( (plazoVenta / 100) * calculoPrecioPreventa )},
        {financiamiento: mesesFinanciamientoContrato},
        {mensualidad: Math.round( ( ( (plazoVenta / 100) * calculoPrecioPreventa ) -
        pagoInicial) / mesesFinanciamientoContrato )}
      ]},
      {pago_escritura: [
        {firma_porcentaje: escritura / 100},
        {firma_monto: Math.round( (escritura / 100) * calculoPrecioPreventa )}
      ]},
      {total: Math.round( ( (escritura / 100) * calculoPrecioPreventa ) +
      ( (plazoVenta / 100) * calculoPrecioPreventa ) )}
    ];

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
    calculoPrecioPreventa ) - pagoInicial ) / mesesFinanciamientoContrato);
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
      new Date(fechaFirmaCorrida).toISOString().slice(0 , 10).split('T')[0],
      '',
      '',
      formatterPeso.format(Math.round( (escritura / 100) * calculoPrecioPreventa ))
    ]);

    bodyCorridaFinanciera.push([
      'TOTAL',
      '',
      '',
      '',
      formatterPeso.format(Math.round( ( (escritura / 100) * calculoPrecioPreventa ) +
      totalmensualidadCorrida + pagoInicial ))
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
    });

    // SE GUARDA EL DOCUMENTO PDF
    docPdfCorridaFinanciera.save('Corrida financiera-' + clientePDF[1] + '-' + numeroDepartamentoCorridaPDF
    + '-' + $('#desarrollo').val() + '.pdf');
    this.notificacion.info('El archivo ha sido generado.', 'PDF Generado', {
      showProgressBar: false,
      titleMaxLength: 200
    });

    // SE GUARDAN LOS DATOS PARA SER UTILIZADOS EN EL METODO autorizacion()
    this.tablaCorridaFinanciera = bodyCorridaFinanciera;
  }

  ngOnInit() {

    this.ngxService.start(); // start foreground loading with 'default' id

    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground loading with 'default' id
    }, 3000);
    this.actualizarListaDesarrollos();

    $( () => {

      /* VALIDA SELECCION DEL CLIENTE */
      if ($('#cliente_corrida').val() === null) {

        $('#div_formulario_corrida_financiera').hide();

      }
      /* FIN VALIDA SELECCION DEL CLIENTE */

      /* MUESTRA DIV CON TODO EL FORMULARIO */
      $('#cliente_corrida').on('change', () => {

        if ($('#cliente_corrida').val() != null) {

          $('#div_formulario_corrida_financiera').show();
          // LIMPIA EL CAMPO DEL PROTOTIPO
          $('#prototipo_corrida').val('');

          // OCULTA EL FORMULARIO PARA CALCULAR EL COSTO DEL PROTOTIPO
          $('#div_calcular_costo_corrida').hide();
          // LIMPIA LOS CAMPOS DEL FORMUALRIO CALCULAR COSTO
          $('#metros_cuadrados_prototipo_corrida').val(0);
          $('#costo_venta_metro_cuadrado_corrida').val(0);
          $('#precio_preventa_corrida').val(0);

          // OCULTA EL FORMULARIO PARA CALCULAR EL COSTO DEL EXCENDENTE
          $('#div_calcular_costo_patio_corrida').hide();
          // LIMPIA LOS CAMPOS DEL FORMUALRIO CALCULAR COSTO
          $('#metros_cuadrados_patio_corrida').val(0);
          $('#costo_venta_metro_cuadrado_patio_corrida').val(0);
          $('#precio_preventa_patio_corrida').val(0);

          // LIMPIAMOS LOS CAMPOS DEL METODO DE FINANCIAMIENTO
          $('#metodo_financiamiento_corrida').val(0);
          $('#meses_financiamiento_corrida').val(0);
          $('#fecha_pago_apartado_corrida').val(0);
          $('#fecha_inicio_contrato_corrida').val(0);
          $('#fecha_firma_corrida').val(0);
          $('#dia_pago_corrida').val(0);
        } else {

          $('#div_formulario_corrida_financiera').hide();
          $('#div_calcular_costo_corrida').show();
        }
      });
      /* FIN MUESTRA DIV CON TODO EL FORMULARIO */

      /* VALIDA SELECCION DEL PROTOTIPO */
      if ($('#cliente_corrida').val() === null) {

        $('#div_calcular_costo_corrida').hide();

      }
      /* FIN VALIDA SELECCION DEL PROTOTIPO */

      /* MUESTRA EL DIV DEL FORMULARIO DE LA CORRIDA */
      $('#cliente_corrida').on('change', () => {

        if ($('#cliente_corrida').val() != null) {

          $('#div_calcular_costo_corrida').show();
        }
      });
      /* FIN MUESTRA FORMULARIO DE LA CORRIDA */

      /* VALIDA SELECCION DEL NIVEL */
      if ($('#nivel_crm').val() === 0) {

        $('#div_calcular_costo_patio_corrida').hide();

      }
      /* FIN VALIDA SELECCION DEL NIVEL */

      /* MUESTRA EL DIV DEL FORMULARIO CALCULO COSTO PATIO */
      $('#nivel_crm').on('change', () => {

        if (this.pisoCorrida === 'PB' || this.pisoCorrida === '02') {

          $('#div_calcular_costo_patio_corrida').show();
        } else {

          $('#div_calcular_costo_patio_corrida').hide();
        }
      });
      /* FIN MUESTRA FORMULARIO CALCULO COSTO PATIO*/

      /* VALIDA SELECCION DE DESARROLLO */
      if ($('#desarrollo_corrida').val() === null) {

        $('#formulario_corrida').hide();
      }
      /* FIN VALIDA SELECCION DEL DESARROLLO */

      /* MUESTRA EL DIV DEL FORMULARIO DE LA CORRIDA */
      $('#desarrollo_corrida').on('change', () => {

        if ($('#desarrollo_corrida').val() != null) {
          this.ngxService.start(); // start foreground loading with 'default' id

          // Stop the foreground loading after 5s
          setTimeout(() => {
            this.ngxService.stop();
            $('#formulario_corrida').show();
          }, 2000);
        }
      });
      /* FIN MUESTRA FORMULARIO DE LA CORRIDA */
      $('#recalcular_costo').on('click', () => {
        $('#div_precio_preventa_corrida').show();
      });

      $('#recalcular_costo_patio').on('click', () => {
        $('#div_precio_preventa_patio_corrida').show();
      });

    });
  }
}
