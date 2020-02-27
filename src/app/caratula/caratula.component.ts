import { Component, OnInit, Input, Output } from '@angular/core';
import { HojaLlenado } from '../interfaces/calculadora/hoja-llenado';

@Component({
  selector: 'app-caratula',
  templateUrl: './caratula.component.html',
  styleUrls: ['./caratula.component.css']
})
export class CaratulaComponent implements OnInit {

  @Input() tasaBanxico: any;
  @Input() datosCaratula: HojaLlenado = {
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
  constructor() { }

  ngOnInit() {
    console.log('TS caratula');
    console.log(this.tasaBanxico);
  }

}
