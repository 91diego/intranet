import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { ParametrosCalculadoraComponent } from './parametros-calculadora/parametros-calculadora.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { CaratulaComponent } from './caratula/caratula.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';
import { CorridaFinancieraComponent } from './corrida-financiera/corrida-financiera.component';


const routes: Routes = [
  /* {
    path: '',
    component: LoginComponent
  }, */
  {
    path: 'crear-usuario',
    component: CrearUsuarioComponent /*,
    canActivate: [AfterLoginService] */
  },
  /*{
    path: ':workPosition',
    component: HomeComponent /*,
    canActivate: [AfterLoginService] */
  // },
  {
    path: ':workPosition',
    component: HomeComponent /*,
    canActivate: [AfterLoginService] */
  },
  {
    path: ':workPosition/calculadora',
    component: CalculadoraComponent /* ,
    canActivate: [AfterLoginService] */
  },
  {
    path: ':workPosition/corrida-financiera',
    component: CorridaFinancieraComponent
  },
  {
    path: ':workPosition/calculadora/caratula',
    component: CaratulaComponent /* ,
    canActivate: [AfterLoginService] */
  },
  {
    path: ':workPosition/configuracion-calculadora',
    component: ParametrosCalculadoraComponent /* ,
    canActivate: [AfterLoginService] */
  },
  {
    path: ':workPosition/configuracion-calculadora/configuracion/:id',
    component: ConfiguracionComponent /* ,
    canActivate: [AfterLoginService] */
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
