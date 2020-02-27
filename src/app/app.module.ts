import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ParametrosCalculadoraComponent } from './parametros-calculadora/parametros-calculadora.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { ParamPrecioComponent } from './param-precio/param-precio.component';
import { ParamPisoComponent } from './param-piso/param-piso.component';
import { ParamVentaComponent } from './param-venta/param-venta.component';
import { ParamMercadoComponent } from './param-mercado/param-mercado.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ParamHipotecarioComponent } from './param-hipotecario/param-hipotecario.component';
import { ParamObraComponent } from './param-obra/param-obra.component';
import { ParamCompraComponent } from './param-compra/param-compra.component';
import { ParamCodigosComponent } from './param-codigos/param-codigos.component';
import { ParamPlusvaliaComponent } from './param-plusvalia/param-plusvalia.component';
import { CaratulaComponent } from './caratula/caratula.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CorridaFinancieraComponent } from './corrida-financiera/corrida-financiera.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    ParametrosCalculadoraComponent,
    CalculadoraComponent,
    ParamPrecioComponent,
    ParamPisoComponent,
    ParamVentaComponent,
    ParamMercadoComponent,
    ConfiguracionComponent,
    ParamHipotecarioComponent,
    ParamObraComponent,
    ParamCompraComponent,
    ParamCodigosComponent,
    ParamPlusvaliaComponent,
    CaratulaComponent,
    CrearUsuarioComponent,
    CorridaFinancieraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SnotifyModule,
    NgxUiLoaderModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
