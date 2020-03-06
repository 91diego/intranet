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

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  prototipos: Prototipo[];
  prototipoDetalles: Prototipo[];

  // GUARDA LOS DATOS LA RESPUESTA GET DE LA API
  supuestosHipotecarios: SupuestoHipotecario[];
  supuestosHipotecariosDetalles: SupuestoHipotecario[];

  // PUESTO DEL USUARIO
  workPosition;
  idDesarrollo;
  idSupuestoObra;
  idPiso;
  idPrototipo;
  idSupuestoVenta;

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
    } else if(type === 'excedente'){

      mtsCuadrados = $('#metros_cuadrados_patio_corrida').val();
      costoVentaMtsCuadrados = $('#costo_venta_metro_cuadrado_patio_corrida').val();
      precio = $('#precio_preventa_patio_corrida').val(costoVentaMtsCuadrados * mtsCuadrados);
    }
  }

  generarPDF() {
    console.log('Corrida financiera');

    // DECLARACION DE VARIABLES
    let nombreClientePDF: any;
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
    superficieCorridaPDF = $('#metros_cuadrados_prototipo_corrida').val();
    precioPreventaCorridaPDF = $('#precio_preventa_corrida').val();
    superficiePatioCorridaPDF = $('#metros_cuadrados_patio_corrida').val();
    precioPreventaPatioCorridaPDF = $('#costo_venta_metro_cuadrado_patio_corrida').val();
    prototipoCorridaPDF = this.prototipoCorrida;
    nivelCorridaPDF = this.pisoCorrida;
    torreCorridaPDF = this.torreCorrida;
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
    for (const value in conversionTorre) {

      if (value === this.torreCorrida ) {
        torreLetraCorridaPDF = conversionTorre[value];
      }
    }
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
    } else if(this.pisoCorrida === '2') {

      calculoPrecioPreventa = Math.round(
        (
          ( Number(superficieCorridaPDF) * Number(precioPreventaCorridaPDF) ) +
          ( Number(superficiePatioCorridaPDF) * Number(precioPreventaPatioCorridaPDF) )
        ) *
        (Math.pow(1.01, this.pisoCorrida))
      );
    } else {

      calculoPrecioPreventa = Math.round( ( Number(superficieCorridaPDF) * Number(precioPreventaCorridaPDF) ) + ( 30.77 * 15000)
      * (Math.pow(1.01, this.pisoCorrida)) );
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

    imgData = 'data:image/png;base64,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' +
    '8bBJs0AtkJFaaNXZxmrkUK1GvlbyJF' +
    '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';

    // SE GENERA DOCUEMENTO CORRIDA FINANCIERA
    docPdfCorridaFinanciera.addImage(imgData, 'PNG', 15, 10, 55, 15);
    docPdfCorridaFinanciera.setFont('helvetica');
    docPdfCorridaFinanciera.setFontType('bold');
    docPdfCorridaFinanciera.text('Corrida financiera ' + $('#desarrollo').val(), 15, 42.5);
    docPdfCorridaFinanciera.setDrawColor(255, 0, 0);
    docPdfCorridaFinanciera.setLineWidth(1.5);
    docPdfCorridaFinanciera.line(15, 52.5, ancho - 15, 52.5);
    docPdfCorridaFinanciera.setFontSize(16);
    docPdfCorridaFinanciera.text(nombreClientePDF, ancho / 3.5, 68);

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
      body: [
        [
          {colSpan: 2, content: 'Unidad', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: torreLetraCorridaPDF +
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
          {colSpan: 2, content: 'Prototipo', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.prototipoCorrida, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Nivel', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: this.pisoCorrida, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
        ],
        [
          {colSpan: 2, content: 'Torre', styles: {valign: 'middle', halign: 'center'}},
          {colSpan: 2, content: torreLetraCorridaPDF, styles: {valign: 'middle', halign: 'center', fontStyle: 'bold'}}
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
          {content: 'Informacion corrida financiera', colSpan: 6, styles: {halign: 'center', fillColor: [22, 160, 133]}},
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
    docPdfCorridaFinanciera.save('Corrida financiera-' + nombreClientePDF + '-' + numeroDepartamentoCorridaPDF
    + '-' + $('#desarrollo').val() + '.pdf');
    this.notificacion.info('El archivo ha sido generado.', 'PDF Generado', {
      showProgressBar: false,
      titleMaxLength: 200
    });

  }

  ngOnInit() {

    this.ngxService.start(); // start foreground loading with 'default' id

    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground loading with 'default' id
    }, 1500);
    this.actualizarListaDesarrollos();

    $( () => {

      /* VALIDA SELECCION DEL PROTOTIPO */
      if ($('#prototipo_corrida').val() === null) {

        $('#div_calcular_costo_corrida').hide();

      }
      /* FIN VALIDA SELECCION DEL PROTOTIPO */

      /* MUESTRA EL DIV DEL FORMULARIO DE LA CORRIDA */
      $('#prototipo_corrida').on('change', () => {

        if ($('#prototipo_corrida').val() != null) {

          $('#div_calcular_costo_corrida').show();
        }
      });
      /* FIN MUESTRA FORMULARIO DE LA CORRIDA */

      /* VALIDA SELECCION DEL NIVEL */
      if ($('#nivel_corrida').val() === null) {

        $('#div_calcular_costo_patio_corrida').hide();

      }
      /* FIN VALIDA SELECCION DEL NIVEL */

      /* MUESTRA EL DIV DEL FORMULARIO CALCULO COSTO PATIO */
      $('#nivel_corrida').on('change', () => {

        if (this.pisoCorrida === 'PB' || this.pisoCorrida === '2') {

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
        $('#precio_preventa_corrida').show();
      });

      $('#recalcular_costo_patio').on('click', () => {
        $('#precio_preventa_patio_corrida').show();
      });

    });
  }
}
